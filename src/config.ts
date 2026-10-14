import { Regex, type JsonValue, type SomeCompanionConfigField } from '@companion-module/base'

export interface Config {
  host: string
  port: number
  [key: string]: JsonValue
}

export const defaultConfig = (): Config => ({
  host: '127.0.0.1',
  port: 8080,
})

export const getConfigFields = (): SomeCompanionConfigField[] => [
  {
    type: 'static-text',
    id: 'info',
    width: 12,
    label: 'Connection',
    value:
      'Enter the address of the PC running Google Slides NDI Presenter and its remote control port (8080 unless you changed it in the app’s Settings). ' +
      'If Companion runs on another machine, “Allow other devices” must be on in the app’s Settings.',
  },
  {
    type: 'textinput',
    id: 'host',
    label: 'Host',
    width: 8,
    default: '127.0.0.1',
    regex: Regex.HOSTNAME,
  },
  {
    type: 'number',
    id: 'port',
    label: 'Port',
    width: 4,
    default: 8080,
    min: 1,
    max: 65535,
  },
]
