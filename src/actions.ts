import type { CompanionActionDefinitions } from '@companion-module/base'
import type GSlidesNdiPresenterInstance from './index.js'
import type { EmptyOptions } from './types.js'

export type ActionsSchema = {
  next: EmptyOptions
  previous: EmptyOptions
  goToSlide: { options: { slide: string } }
  firstLastSlide: { options: { target: 'first' | 'last' } }
  openPresentation: { options: { url: string } }
  refresh: EmptyOptions
  closePresentation: EmptyOptions
  video: { options: { command: 'toggle' | 'play' | 'pause' | 'restart' } }
  notesSize: { options: { mode: 'increase' | 'decrease' | 'set'; size: number } }
  notesAutoFit: { options: { mode: 'toggle' | 'on' | 'off' } }
  notesScroll: { options: { direction: 'down' | 'up' | 'top' } }
}

export function getActions(instance: GSlidesNdiPresenterInstance): CompanionActionDefinitions<ActionsSchema> {
  const send = async (path: string, body?: unknown): Promise<void> => {
    try {
      await instance.sendCommand(path, body)
    } catch (err) {
      instance.log('error', `${path}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return {
    next: {
      name: 'Next',
      description: 'Next animation build, or the next slide once the current one has finished building (like a clicker)',
      options: [],
      callback: async () => send('next'),
    },
    previous: {
      name: 'Previous',
      description: 'Previous animation build or slide',
      options: [],
      callback: async () => send('previous'),
    },
    goToSlide: {
      name: 'Go to slide',
      options: [
        {
          type: 'textinput',
          id: 'slide',
          label: 'Slide number',
          default: '1',
          useVariables: true,
          description: 'Counting from 1. Variables are allowed.',
        },
      ],
      callback: async (action) => {
        const slide = parseInt(String(action.options.slide).trim(), 10)
        if (!Number.isFinite(slide) || slide < 1) {
          instance.log('warn', `Go to slide: "${action.options.slide}" isn't a slide number`)
          return
        }
        await send(`goto/${slide}`)
      },
    },
    firstLastSlide: {
      name: 'Go to first or last slide',
      options: [
        {
          type: 'dropdown',
          id: 'target',
          label: 'Slide',
          default: 'first',
          choices: [
            { id: 'first', label: 'First' },
            { id: 'last', label: 'Last' },
          ],
        },
      ],
      callback: async (action) => {
        const count = instance.state?.slideCount ?? 0
        if (count === 0) return
        await send(`goto/${action.options.target === 'last' ? count : 1}`)
      },
    },
    openPresentation: {
      name: 'Open presentation',
      description: 'Opens a Google Slides deck from its share link. It must be shared as “Anyone with the link can view”.',
      options: [
        {
          type: 'textinput',
          id: 'url',
          label: 'Google Slides link',
          default: '',
          useVariables: true,
        },
      ],
      callback: async (action) => {
        const url = String(action.options.url).trim()
        if (!url) {
          instance.log('warn', 'Open presentation: no link given')
          return
        }
        await send('load', { url })
      },
    },
    refresh: {
      name: 'Refresh presentation',
      description: 'Pulls in changes made to the deck in Google Slides, staying on the current slide',
      options: [],
      callback: async () => send('refresh'),
    },
    closePresentation: {
      name: 'Close presentation',
      description: 'Closes the deck; both NDI outputs show the holding screen',
      options: [],
      callback: async () => send('close'),
    },
    video: {
      name: 'Video',
      description: 'Controls the video on the current slide, if there is one',
      options: [
        {
          type: 'dropdown',
          id: 'command',
          label: 'Command',
          default: 'toggle',
          choices: [
            { id: 'toggle', label: 'Play / pause' },
            { id: 'play', label: 'Play' },
            { id: 'pause', label: 'Pause' },
            { id: 'restart', label: 'Back to the start' },
          ],
        },
      ],
      callback: async (action) => send(`video/${action.options.command}`),
    },
    notesSize: {
      name: 'Notes text size',
      description: 'Changing the size turns auto-fit off',
      options: [
        {
          type: 'dropdown',
          id: 'mode',
          label: 'Change',
          default: 'increase',
          choices: [
            { id: 'increase', label: 'Bigger (+4px)' },
            { id: 'decrease', label: 'Smaller (−4px)' },
            { id: 'set', label: 'Set to' },
          ],
        },
        {
          type: 'number',
          id: 'size',
          label: 'Size (px)',
          default: 48,
          min: 12,
          max: 300,
          isVisibleExpression: `$(options:mode) == 'set'`,
        },
      ],
      callback: async (action) => {
        if (action.options.mode === 'set') await send(`notes/size/${Math.round(action.options.size)}`)
        else await send(`notes/${action.options.mode}`)
      },
    },
    notesAutoFit: {
      name: 'Notes auto-fit',
      description: 'Auto-fit shows each slide’s notes as large as will fit without scrolling',
      options: [
        {
          type: 'dropdown',
          id: 'mode',
          label: 'Auto-fit',
          default: 'toggle',
          choices: [
            { id: 'toggle', label: 'Toggle' },
            { id: 'on', label: 'On' },
            { id: 'off', label: 'Off' },
          ],
        },
      ],
      callback: async (action) => send(`notes/autofit/${action.options.mode}`),
    },
    notesScroll: {
      name: 'Notes scroll',
      options: [
        {
          type: 'dropdown',
          id: 'direction',
          label: 'Direction',
          default: 'down',
          choices: [
            { id: 'down', label: 'Down' },
            { id: 'up', label: 'Up' },
            { id: 'top', label: 'Back to the top' },
          ],
        },
      ],
      callback: async (action) => send(`notes/scroll/${action.options.direction}`),
    },
  }
}
