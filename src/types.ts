import type { ActionsSchema } from './actions.js'
import type { Config } from './config.js'
import type { FeedbacksSchema } from './feedbacks.js'
import type { VariablesSchema } from './variables.js'

export interface PresenterTypes {
  config: Config
  secrets: undefined
  actions: ActionsSchema
  feedbacks: FeedbacksSchema
  variables: VariablesSchema
}

export type EmptyOptions = { options: Record<string, never> }

/** Video quality ids reported by the player, as people know them. */
export const QUALITY_LABELS: Record<string, string> = {
  hd2160: '4K',
  hd1440: '1440p',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
}
