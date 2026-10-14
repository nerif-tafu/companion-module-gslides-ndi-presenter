import { createModuleLogger } from '@companion-module/base'

const log = createModuleLogger('API')

export interface VideoInfo {
  state: 'playing' | 'paused' | 'ended' | 'buffering' | 'ready' | string
  quality: string
  best: string
  resolution: string
}

/** The state document the app publishes on /api/state and /api/events. */
export interface PresenterState {
  url: string
  presentationId: string | null
  title: string | null
  slide: number
  slideCount: number
  notesFontSize: number
  notesAutoFit: boolean
  notesEffectiveFontSize: number
  notesScroll: number
  notesMaxScroll: number
  loading: boolean
  live: boolean
  video: VideoInfo | null
  status: string
  slidesNdiName: string | null
  notesNdiName: string | null
  slidesReceivers: number
  notesReceivers: number
  ndiError: string | null
  liveError: string | null
}

export interface ApiEvents {
  /** A new state arrived (also fired right after connecting). */
  state: (state: PresenterState) => void
  /** The live connection was established. */
  connected: () => void
  /** The live connection dropped or couldn't be made; it will retry on its own. */
  disconnected: (reason: string) => void
}

/**
 * Talks to the app's HTTP API. State is followed live through the Server-Sent Events stream
 * at /api/events, which the app pushes to whenever anything changes, so no polling is needed.
 */
export class PresenterApi {
  readonly #baseUrl: string
  readonly #events: ApiEvents
  #abort: AbortController | null = null
  #retryTimer: ReturnType<typeof setTimeout> | null = null
  #retryDelay = 1000
  #stopped = false

  constructor(host: string, port: number, events: ApiEvents) {
    this.#baseUrl = `http://${host}:${port}`
    this.#events = events
  }

  start(): void {
    this.#stopped = false
    void this.#connect()
  }

  stop(): void {
    this.#stopped = true
    if (this.#retryTimer) clearTimeout(this.#retryTimer)
    this.#retryTimer = null
    this.#abort?.abort()
    this.#abort = null
  }

  /** Sends a command such as `next` or `video/toggle`. Throws with the app's error message on failure. */
  async command(path: string, body?: unknown): Promise<void> {
    const response = await fetch(`${this.#baseUrl}/api/${path}`, {
      method: 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(path === 'load' || path === 'refresh' ? 120_000 : 5_000),
    })
    if (!response.ok) {
      let message = `${response.status} ${response.statusText}`
      try {
        const data = (await response.json()) as { error?: string }
        if (data.error) message = data.error
      } catch {
        // no JSON body
      }
      throw new Error(message)
    }
  }

  async #connect(): Promise<void> {
    if (this.#stopped) return
    const abort = new AbortController()
    this.#abort = abort
    try {
      const response = await fetch(`${this.#baseUrl}/api/events`, {
        headers: { Accept: 'text/event-stream' },
        signal: abort.signal,
      })
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

      this.#retryDelay = 1000
      this.#events.connected()

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += value.replace(/\r\n/g, '\n')
        let end: number
        while ((end = buffer.indexOf('\n\n')) >= 0) {
          const block = buffer.slice(0, end)
          buffer = buffer.slice(end + 2)
          const data = block
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trimStart())
            .join('\n')
          if (data) this.#handleData(data)
        }
      }
      throw new Error('The app closed the connection')
    } catch (err) {
      if (this.#stopped || abort.signal.aborted) return
      const reason = describeError(err)
      log.debug(`Event stream ended: ${reason}`)
      this.#events.disconnected(reason)
      this.#retryTimer = setTimeout(() => void this.#connect(), this.#retryDelay)
      this.#retryDelay = Math.min(this.#retryDelay * 2, 5_000)
    }
  }

  #handleData(data: string): void {
    try {
      this.#events.state(JSON.parse(data) as PresenterState)
    } catch (err) {
      log.warn(`Ignoring malformed state from the app: ${describeError(err)}`)
    }
  }
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: { code?: string } }).cause
    if (cause?.code === 'ECONNREFUSED') return 'Connection refused (is the app running, and is the port right?)'
    if (cause?.code === 'ECONNRESET') return 'The app closed the connection'
    if (cause?.code === 'EHOSTUNREACH' || cause?.code === 'ENOTFOUND') return 'Host not found'
    if (cause?.code) return `${err.message} (${cause.code})`
    return err.message
  }
  return String(err)
}
