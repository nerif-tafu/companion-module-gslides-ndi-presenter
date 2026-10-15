import type { CompanionVariableDefinitions } from '@companion-module/base'
import type { PresenterState } from './api.js'
import { QUALITY_LABELS } from './types.js'

export type VariablesSchema = {
  connected: boolean
  title: string
  slide: number
  slide_count: number
  slides_remaining: number
  next_slide: string
  loading: boolean
  out_of_date: boolean
  notes_size: number
  notes_autofit: boolean
  video: boolean
  video_state: string
  video_quality: string
  media_kind: string
  media_position: string
  media_duration: string
  media_remaining: string
  slides_receivers: number
  notes_receivers: number
  slides_ndi_name: string
  notes_ndi_name: string
}

export const variableDefinitions: CompanionVariableDefinitions<VariablesSchema> = {
  connected: { name: 'Connected to the app' },
  title: { name: 'Presentation title' },
  slide: { name: 'Current slide number' },
  slide_count: { name: 'Number of slides' },
  slides_remaining: { name: 'Slides left after this one' },
  next_slide: { name: 'Next slide number (empty on the last slide)' },
  loading: { name: 'Presentation is loading' },
  out_of_date: { name: 'Presentation has been updated in Google Slides since it was loaded' },
  notes_size: { name: 'Notes text size in px (the fitted size while auto-fit is on)' },
  notes_autofit: { name: 'Notes auto-fit is on' },
  video: { name: 'Current slide has video or audio' },
  video_state: { name: 'Video or audio state (playing, paused, ended, buffering, ready, or empty)' },
  video_quality: { name: 'Video quality, e.g. 720p (empty for audio)' },
  media_kind: { name: 'What the current slide has: video, audio, or empty' },
  media_position: { name: 'Video or audio position, e.g. 0:42' },
  media_duration: { name: 'Video or audio length, e.g. 3:34' },
  media_remaining: { name: 'Video or audio time left, e.g. 2:52' },
  slides_receivers: { name: 'Receivers watching the slides output' },
  notes_receivers: { name: 'Receivers watching the presenter view output' },
  slides_ndi_name: { name: 'NDI name of the slides output' },
  notes_ndi_name: { name: 'NDI name of the presenter view output' },
}

export function variableValues(state: PresenterState | null, connected: boolean): VariablesSchema {
  const open = !!state?.presentationId || (state?.slideCount ?? 0) > 0
  const slide = state?.slide ?? 0
  const count = state?.slideCount ?? 0
  const video = state?.video ?? null
  return {
    connected,
    title: open ? (state?.title ?? '') : '',
    slide,
    slide_count: count,
    slides_remaining: Math.max(0, count - slide),
    next_slide: count > 0 && slide < count ? String(slide + 1) : '',
    loading: !!state?.loading,
    out_of_date: !!state?.outOfDate,
    notes_size: Math.round((state?.notesAutoFit ? state.notesEffectiveFontSize : state?.notesFontSize) ?? 0),
    notes_autofit: !!state?.notesAutoFit,
    video: !!video,
    video_state: video?.state ?? '',
    video_quality: video && video.kind !== 'audio' ? (QUALITY_LABELS[video.quality] ?? QUALITY_LABELS[video.best] ?? '') : '',
    media_kind: video ? (video.kind ?? 'video') : '',
    media_position: video && video.duration ? clock(video.position ?? 0) : '',
    media_duration: video && video.duration ? clock(video.duration) : '',
    media_remaining: video && video.duration ? clock(video.duration - (video.position ?? 0)) : '',
    slides_receivers: state?.slidesReceivers ?? 0,
    notes_receivers: state?.notesReceivers ?? 0,
    slides_ndi_name: state?.slidesNdiName ?? '',
    notes_ndi_name: state?.notesNdiName ?? '',
  }
}

/** Seconds as m:ss. */
function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
