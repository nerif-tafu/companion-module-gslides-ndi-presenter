import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type GSlidesNdiPresenterInstance from './index.js'

type Bool<T extends Record<string, unknown> = Record<string, never>> = { type: 'boolean'; options: T }

export type FeedbacksSchema = {
  presentationOpen: Bool
  loading: Bool
  presentationOutOfDate: Bool
  currentSlide: Bool<{ slide: number }>
  atFirstSlide: Bool
  atLastSlide: Bool
  videoOnSlide: Bool
  videoPlaying: Bool
  notesAutoFit: Bool
  notesCanScroll: Bool<{ direction: 'down' | 'up' }>
  receiversConnected: Bool<{ output: 'slides' | 'notes' }>
}

const WHITE = 0xffffff
const RED = 0xcc0000
const GREEN = 0x009933
const PURPLE = 0x6a59f5
const AMBER = 0xb36b00

export function getFeedbacks(instance: GSlidesNdiPresenterInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
  const s = () => instance.state

  return {
    presentationOpen: {
      type: 'boolean',
      name: 'Presentation is open',
      defaultStyle: { bgcolor: GREEN, color: WHITE },
      options: [],
      callback: () => !!s()?.presentationId,
    },
    loading: {
      type: 'boolean',
      name: 'Presentation is loading',
      description: 'While a deck is being opened or refreshed',
      defaultStyle: { bgcolor: AMBER, color: WHITE },
      options: [],
      callback: () => !!s()?.loading,
    },
    presentationOutOfDate: {
      type: 'boolean',
      name: 'Presentation updated in Google Slides',
      description: 'True when the deck has been edited since it was loaded, until you refresh it',
      defaultStyle: { bgcolor: AMBER, color: WHITE },
      options: [],
      callback: () => !!s()?.outOfDate,
    },
    currentSlide: {
      type: 'boolean',
      name: 'Current slide is…',
      defaultStyle: { bgcolor: RED, color: WHITE },
      options: [{ type: 'number', id: 'slide', label: 'Slide number', default: 1, min: 1, max: 9999 }],
      callback: (feedback) => (s()?.slide ?? 0) === feedback.options.slide,
    },
    atFirstSlide: {
      type: 'boolean',
      name: 'On the first slide',
      defaultStyle: { bgcolor: 0x333333, color: 0x888888 },
      options: [],
      callback: () => {
        const state = s()
        return !!state && state.slideCount > 0 && state.slide <= 1
      },
    },
    atLastSlide: {
      type: 'boolean',
      name: 'On the last slide',
      defaultStyle: { bgcolor: 0x333333, color: 0x888888 },
      options: [],
      callback: () => {
        const state = s()
        return !!state && state.slideCount > 0 && state.slide >= state.slideCount
      },
    },
    videoOnSlide: {
      type: 'boolean',
      name: 'Current slide has video or audio',
      defaultStyle: { bgcolor: PURPLE, color: WHITE },
      options: [],
      callback: () => !!s()?.video,
    },
    videoPlaying: {
      type: 'boolean',
      name: 'Video or audio is playing',
      defaultStyle: { bgcolor: GREEN, color: WHITE },
      options: [],
      callback: () => {
        const state = s()?.video?.state
        return state === 'playing' || state === 'buffering'
      },
    },
    notesAutoFit: {
      type: 'boolean',
      name: 'Notes auto-fit is on',
      defaultStyle: { bgcolor: PURPLE, color: WHITE },
      options: [],
      callback: () => !!s()?.notesAutoFit,
    },
    notesCanScroll: {
      type: 'boolean',
      name: 'Notes can scroll',
      description: 'True when there are more notes off-screen in that direction',
      defaultStyle: { bgcolor: AMBER, color: WHITE },
      options: [
        {
          type: 'dropdown',
          id: 'direction',
          label: 'Direction',
          default: 'down',
          choices: [
            { id: 'down', label: 'Down' },
            { id: 'up', label: 'Up' },
          ],
        },
      ],
      callback: (feedback) => {
        const state = s()
        if (!state) return false
        return feedback.options.direction === 'up' ? state.notesScroll > 0.5 : state.notesScroll < state.notesMaxScroll - 0.5
      },
    },
    receiversConnected: {
      type: 'boolean',
      name: 'NDI output has receivers',
      description: 'True when at least one NDI receiver is watching the output',
      defaultStyle: { bgcolor: GREEN, color: WHITE },
      options: [
        {
          type: 'dropdown',
          id: 'output',
          label: 'Output',
          default: 'slides',
          choices: [
            { id: 'slides', label: 'Slides' },
            { id: 'notes', label: 'Presenter view' },
          ],
        },
      ],
      callback: (feedback) => {
        const state = s()
        if (!state) return false
        return (feedback.options.output === 'notes' ? state.notesReceivers : state.slidesReceivers) > 0
      },
    },
  }
}
