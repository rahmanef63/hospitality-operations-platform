# Guest-visible welcome and presentation controls

All controls are property-scoped and live under `/admin/welcome`.

## Standard `/welcome`

The admin can show or hide:

- brand header;
- language selector;
- time-aware greeting and voice mute control;
- welcome body copy;
- reservation details;
- contact-host button;
- signature;
- private-page note.

The primary headline remains present, and the page always occupies the full viewport width with a `100svh`/`100dvh` minimum. Compact landscape rules keep the standard welcome inside short TV and browser viewports.

## TV `/presentation`

The admin can show or hide:

- brand top bar;
- language selector;
- current time-aware greeting on the arrival slide;
- slide counter;
- install-PWA button.

Four reviewed slide roles are available: welcome message, guest/stay context, brand stillness, and contact host. Each role can be enabled, ordered, assigned one reviewed visual, and given a 5–60 second duration. At least one slide must remain enabled. The visual-concept disclosure is not configurable and remains visible until final property photography replaces concept assets.

## Audio

Announcement voice and presentation music are separate controls. Both start muted. The announcement channel uses browser speech synthesis; the presentation channel plays one of the bundled CC0 lo-fi tracks selected by the admin. No guest contact, finance, notes, or other private PMS fields are sent to either audio path.
