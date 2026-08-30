# Kamyna guest audio and licenses

## Bundled lo-fi collection

The presentation ships with three original loops:

| Key | Title | Creator | Duration | File |
|---|---|---|---:|---|
| `still-morning` | Still Morning | Kamyna Living Studio | 53.37 s | `/audio/still-morning.mp3` |
| `mountain-air` | Mountain Air | Kamyna Living Studio | 50.57 s | `/audio/mountain-air.mp3` |
| `night-courtyard` | Night Courtyard | Kamyna Living Studio | 56.50 s | `/audio/night-courtyard.mp3` |

Every track is generated deterministically from oscillators, envelopes, generated noise, and synthesized percussion. No third-party sample, recording, melody, or streaming service is used. The generator is committed at `scripts/audio/generate_lofi_tracks.py`.

The recordings and generated compositions are dedicated under **CC0 1.0 Universal**. The public license notice is available at `/audio/LICENSE.txt`, while the canonical Creative Commons reference is `https://creativecommons.org/publicdomain/zero/1.0/`.

## Runtime behavior

- Admin selects one track per property under `/admin/welcome`.
- Music is disabled or enabled per property and has a bounded `0–0.5` volume setting.
- `/presentation` starts with audio muted and does not call `play()` until a user presses the icon-only music control or the `M` key.
- The selected track loops locally and is cached by the Kamyna service worker for offline presentation use.
- `/welcome` uses speech synthesis only for configured announcements and also starts muted.

## Adding another track

Do not add a track unless its rights are documented. The current runtime catalog intentionally accepts only reviewed bundled keys. A new track requires all of the following in one code review:

1. A same-origin audio file under `public/audio/`.
2. Provenance stating whether samples were used.
3. A free-license or public-domain reference.
4. Metadata in `shared/announcements/music.ts`.
5. A test asserting the file and license notice exist.
