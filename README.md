# companion-module-gslides-ndi-presenter

A [Bitfocus Companion](https://bitfocus.io/companion) module for [Google Slides NDI Presenter](https://github.com/nerif-tafu/google-slides-ndi-presenter), the Windows app that sends a Google Slides deck to NDI as live slides plus a presenter view with speaker notes.

With it you can run the deck from a Stream Deck: next and previous, jump to slides, play videos, change the speaker notes, open and close decks, and see the state of everything on the buttons. See [companion/HELP.md](companion/HELP.md) for the full list of actions, feedbacks, variables and presets.

The module follows the app's state over its event stream (`/api/events`) rather than polling, so buttons update straight away. Commands go to the app's HTTP API.

## Development

You need Node 22 and Yarn (via `corepack enable`).

```bash
yarn install
yarn build        # type-check and compile to dist/
yarn dev          # rebuild on change
yarn lint
yarn companion-module-build   # package into a .tgz you can load into Companion
```

To try it in Companion, point Companion's developer modules folder at the folder that contains this one, then add a "Google Slides NDI Presenter" connection.

Layout:

- `src/index.ts` is the connection instance: lifecycle, status, and wiring state into variables and feedbacks.
- `src/api.ts` is the HTTP client and the event stream reader, with automatic reconnects.
- `src/actions.ts`, `src/feedbacks.ts`, `src/variables.ts` and `src/presets.ts` hold the definitions.
- `src/upgrades.ts` is for upgrade scripts. Add one whenever an action or feedback id, or its options, change.

## License

MIT
