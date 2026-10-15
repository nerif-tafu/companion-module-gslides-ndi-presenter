## Google Slides NDI Presenter

Controls [Google Slides NDI Presenter](https://github.com/nerif-tafu/google-slides-ndi-presenter), the Windows app that sends a Google Slides deck to NDI as live slides plus a presenter view with speaker notes.

### Setting up

1. Run the app on the presentation PC.
2. In this connection, enter that PC's address (`127.0.0.1` if Companion runs on the same machine) and the app's remote control port, which is **8080** unless you changed it.
3. If Companion is on a different machine, open the app's **Settings** and make sure **Allow other devices** is on. Windows may also ask you to allow the app through the firewall.

The connection follows the app live, so feedbacks and variables update as soon as anything changes, including when someone presses a button in the app itself.

### Actions

| Action                    | What it does                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Next / Previous           | Steps through animation builds, then slides, the same as a clicker                     |
| Go to slide               | Jumps to a slide number (variables allowed)                                            |
| Go to first or last slide |                                                                                        |
| Open presentation         | Opens a deck from its share link. It must be shared as "Anyone with the link can view" |
| Refresh presentation      | Pulls in edits made in Google Slides, staying on the current slide                     |
| Close presentation        | Both NDI outputs go to the holding screen                                              |
| Video                     | Play / pause, play, pause, or back to the start, for the video on the current slide    |
| Notes text size           | Bigger, smaller, or a set size. Changing the size turns auto-fit off                   |
| Notes auto-fit            | Toggle, on or off                                                                      |
| Notes scroll              | Down, up, or back to the top                                                           |

### Feedbacks

Presentation is open · Presentation is loading · Presentation updated in Google Slides · Current slide is… · On the first slide · On the last slide · Current slide has a video · Video is playing · Notes auto-fit is on · Notes can scroll (up/down) · NDI output has receivers

### Variables

| Variable                                                                               |                                                                         |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `$(gslides-ndi:title)`                                                                 | Presentation title                                                      |
| `$(gslides-ndi:slide)` / `$(gslides-ndi:slide_count)`                                  | Current slide and total                                                 |
| `$(gslides-ndi:next_slide)`                                                            | Next slide number, empty on the last slide                              |
| `$(gslides-ndi:slides_remaining)`                                                      | Slides left after this one                                              |
| `$(gslides-ndi:loading)`                                                               | true while a deck is opening or refreshing                              |
| `$(gslides-ndi:out_of_date)`                                                           | true when the deck has been edited in Google Slides since it was loaded |
| `$(gslides-ndi:notes_size)` / `$(gslides-ndi:notes_autofit)`                           | Notes text size in px, and whether auto-fit is on                       |
| `$(gslides-ndi:video)` / `$(gslides-ndi:video_state)` / `$(gslides-ndi:video_quality)` | Whether the slide has a video, its state, and its quality (e.g. 720p)   |
| `$(gslides-ndi:slides_receivers)` / `$(gslides-ndi:notes_receivers)`                   | NDI receivers watching each output                                      |
| `$(gslides-ndi:slides_ndi_name)` / `$(gslides-ndi:notes_ndi_name)`                     | NDI names of the outputs                                                |
| `$(gslides-ndi:connected)`                                                             | Whether Companion can reach the app                                     |

Replace `gslides-ndi` with your connection's label if you renamed it.

### Presets

Ready-made buttons for navigation (with a slide counter), "go to slide 1–24", video, speaker notes, the presentation title, refresh, close, and receiver status for each output. The Refresh preset turns amber and reads UPDATED when someone has edited the deck in Google Slides since it was loaded (the app checks every 30 seconds), so you know a refresh will pick up changes. The Close preset needs a one-second hold so a stray tap can't take the deck off air.
