import type { CompanionPresetDefinitions, CompanionPresetSection, CompanionButtonStyleProps } from '@companion-module/base'
import type { PresenterTypes } from './types.js'

const WHITE = 0xffffff
const BLACK = 0x000000
const DARK = 0x1c1c22
const DIM = 0x333333
const GREY_TEXT = 0x888888
const PURPLE = 0x6a59f5
const GREEN = 0x009933
const RED = 0xcc0000
const AMBER = 0xb36b00

/** How many "Go to slide N" buttons to offer. */
const GOTO_SLIDES = 24

const style = (text: string, extra: Partial<CompanionButtonStyleProps> = {}): CompanionButtonStyleProps => ({
  text,
  size: '14',
  color: WHITE,
  bgcolor: BLACK,
  ...extra,
})

/**
 * @param label the connection label, used to reference this connection's variables in button text
 */
export function getPresetDefinitions(label: string): CompanionPresetDefinitions<PresenterTypes> {
  const v = (name: string): string => `$(${label}:${name})`
  const presets: CompanionPresetDefinitions<PresenterTypes> = {
    // ---- Navigation ----
    previous: {
      type: 'simple',
      name: 'Previous',
      style: style('◀\nPREV', { size: '18' }),
      steps: [{ down: [{ actionId: 'previous', options: {} }], up: [] }],
      feedbacks: [{ feedbackId: 'atFirstSlide', options: {}, style: { bgcolor: DIM, color: GREY_TEXT } }],
    },
    next: {
      type: 'simple',
      name: 'Next',
      style: style('NEXT\n▶', { size: '18', bgcolor: PURPLE }),
      steps: [{ down: [{ actionId: 'next', options: {} }], up: [] }],
      feedbacks: [],
    },
    firstSlide: {
      type: 'simple',
      name: 'First slide',
      style: style('⏮\nFIRST'),
      steps: [{ down: [{ actionId: 'firstLastSlide', options: { target: 'first' } }], up: [] }],
      feedbacks: [{ feedbackId: 'atFirstSlide', options: {}, style: { bgcolor: DIM, color: GREY_TEXT } }],
    },
    lastSlide: {
      type: 'simple',
      name: 'Last slide',
      style: style('LAST\n⏭'),
      steps: [{ down: [{ actionId: 'firstLastSlide', options: { target: 'last' } }], up: [] }],
      feedbacks: [{ feedbackId: 'atLastSlide', options: {}, style: { bgcolor: DIM, color: GREY_TEXT } }],
    },
    slideCounter: {
      type: 'simple',
      name: 'Slide counter',
      style: style(`SLIDE\n${v('slide')}/${v('slide_count')}`, { size: '18', bgcolor: DARK }),
      steps: [{ down: [], up: [] }],
      feedbacks: [{ feedbackId: 'atLastSlide', options: {}, style: { bgcolor: RED, color: WHITE } }],
    },
    nextUp: {
      type: 'simple',
      name: 'Up next',
      style: style(`UP NEXT\n${v('next_slide')}`, { size: '18', bgcolor: DARK }),
      steps: [{ down: [], up: [] }],
      feedbacks: [],
    },

    // ---- Video ----
    videoToggle: {
      type: 'simple',
      name: 'Play / pause video',
      style: style('▶ PLAY', { bgcolor: DARK, size: '18' }),
      steps: [{ down: [{ actionId: 'video', options: { command: 'toggle' } }], up: [] }],
      feedbacks: [
        { feedbackId: 'videoOnSlide', options: {}, style: { bgcolor: DIM, color: GREY_TEXT, text: 'NO\nMEDIA', size: '14' }, isInverted: true },
        { feedbackId: 'videoPlaying', options: {}, style: { bgcolor: GREEN, color: WHITE, text: '⏸ PAUSE' } },
      ],
    },
    videoRestart: {
      type: 'simple',
      name: 'Video back to the start',
      style: style('⟲\nRESTART', { bgcolor: DARK }),
      steps: [{ down: [{ actionId: 'video', options: { command: 'restart' } }], up: [] }],
      feedbacks: [{ feedbackId: 'videoOnSlide', options: {}, style: { bgcolor: DIM, color: GREY_TEXT }, isInverted: true }],
    },
    videoStatus: {
      type: 'simple',
      name: 'Video status',
      style: style(`${v('media_kind')}\n${v('media_position')} / ${v('media_duration')}\n${v('video_state')}`, { bgcolor: DARK, size: '14' }),
      steps: [{ down: [], up: [] }],
      feedbacks: [{ feedbackId: 'videoPlaying', options: {}, style: { bgcolor: GREEN, color: WHITE } }],
    },

    // ---- Notes ----
    notesBigger: {
      type: 'simple',
      name: 'Notes bigger',
      style: style('NOTES\nA+', { size: '18' }),
      steps: [{ down: [{ actionId: 'notesSize', options: { mode: 'increase', size: 48 } }], up: [] }],
      feedbacks: [],
    },
    notesSmaller: {
      type: 'simple',
      name: 'Notes smaller',
      style: style('NOTES\nA−', { size: '18' }),
      steps: [{ down: [{ actionId: 'notesSize', options: { mode: 'decrease', size: 48 } }], up: [] }],
      feedbacks: [],
    },
    notesAutoFit: {
      type: 'simple',
      name: 'Notes auto-fit',
      style: style(`AUTO-FIT\n${v('notes_size')}px`),
      steps: [{ down: [{ actionId: 'notesAutoFit', options: { mode: 'toggle' } }], up: [] }],
      feedbacks: [{ feedbackId: 'notesAutoFit', options: {}, style: { bgcolor: PURPLE, color: WHITE } }],
    },
    notesScrollUp: {
      type: 'simple',
      name: 'Scroll notes up',
      style: style('NOTES\n▲'),
      steps: [{ down: [{ actionId: 'notesScroll', options: { direction: 'up' } }], up: [] }],
      feedbacks: [{ feedbackId: 'notesCanScroll', options: { direction: 'up' }, style: { bgcolor: AMBER, color: WHITE } }],
    },
    notesScrollDown: {
      type: 'simple',
      name: 'Scroll notes down',
      style: style('NOTES\n▼'),
      steps: [{ down: [{ actionId: 'notesScroll', options: { direction: 'down' } }], up: [] }],
      feedbacks: [{ feedbackId: 'notesCanScroll', options: { direction: 'down' }, style: { bgcolor: AMBER, color: WHITE } }],
    },

    // ---- Presentation ----
    presentationTitle: {
      type: 'simple',
      name: 'Presentation title',
      style: style(v('title'), { size: 'auto', bgcolor: DARK }),
      steps: [{ down: [], up: [] }],
      feedbacks: [{ feedbackId: 'loading', options: {}, style: { bgcolor: AMBER, color: WHITE, text: 'LOADING…' } }],
    },
    refresh: {
      type: 'simple',
      name: 'Refresh presentation',
      style: style('⟳\nREFRESH'),
      steps: [{ down: [{ actionId: 'refresh', options: {} }], up: [] }],
      feedbacks: [
        { feedbackId: 'presentationOutOfDate', options: {}, style: { bgcolor: AMBER, color: WHITE, text: '⟳\nUPDATED' } },
        // Listed last so it wins while the refresh is running.
        { feedbackId: 'loading', options: {}, style: { bgcolor: AMBER, color: WHITE, text: '⟳\nREFRESH' } },
      ],
    },
    close: {
      type: 'simple',
      name: 'Close presentation (hold 1s)',
      style: style('CLOSE\n(hold)', { bgcolor: 0x4d0000 }),
      // A long press, so the live output isn't blanked by an accidental tap.
      steps: [{ down: [], up: [], 1000: [{ actionId: 'closePresentation', options: {} }] }],
      feedbacks: [{ feedbackId: 'presentationOpen', options: {}, style: { bgcolor: DIM, color: GREY_TEXT }, isInverted: true }],
    },

    // ---- NDI outputs ----
    slidesReceivers: {
      type: 'simple',
      name: 'Slides output receivers',
      style: style(`SLIDES\nRX ${v('slides_receivers')}`, { bgcolor: DARK }),
      steps: [{ down: [], up: [] }],
      feedbacks: [{ feedbackId: 'receiversConnected', options: { output: 'slides' }, style: { bgcolor: GREEN, color: WHITE } }],
    },
    notesReceivers: {
      type: 'simple',
      name: 'Presenter view receivers',
      style: style(`NOTES\nRX ${v('notes_receivers')}`, { bgcolor: DARK }),
      steps: [{ down: [], up: [] }],
      feedbacks: [{ feedbackId: 'receiversConnected', options: { output: 'notes' }, style: { bgcolor: GREEN, color: WHITE } }],
    },
  }

  // ---- Go to slide N ----
  for (let n = 1; n <= GOTO_SLIDES; n++) {
    presets[`goto_${n}`] = {
      type: 'simple',
      name: `Go to slide ${n}`,
      style: style(`SLIDE\n${n}`, { size: '18' }),
      steps: [{ down: [{ actionId: 'goToSlide', options: { slide: String(n) } }], up: [] }],
      feedbacks: [{ feedbackId: 'currentSlide', options: { slide: n }, style: { bgcolor: RED, color: WHITE } }],
    }
  }

  return presets
}

export const presetStructure: CompanionPresetSection<PresenterTypes>[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Next and Previous step through animations like a clicker.',
    definitions: ['previous', 'next', 'firstSlide', 'lastSlide', 'slideCounter', 'nextUp'],
  },
  {
    id: 'goto',
    name: 'Go to slide',
    description: 'Lights up red on the current slide.',
    definitions: Array.from({ length: GOTO_SLIDES }, (_, i) => `goto_${i + 1}`),
  },
  {
    id: 'video',
    name: 'Video and audio',
    description: 'For slides with an embedded video. Greyed out when the slide has none.',
    definitions: ['videoToggle', 'videoRestart', 'videoStatus'],
  },
  {
    id: 'notes',
    name: 'Speaker notes',
    definitions: ['notesBigger', 'notesSmaller', 'notesAutoFit', 'notesScrollUp', 'notesScrollDown'],
  },
  {
    id: 'presentation',
    name: 'Presentation',
    definitions: ['presentationTitle', 'refresh', 'close'],
  },
  {
    id: 'outputs',
    name: 'NDI outputs',
    description: 'Green when at least one receiver is watching.',
    definitions: ['slidesReceivers', 'notesReceivers'],
  },
]
