export const PWA_ICONS=[
 {src:"/tenant/icons/icon-192.png",sizes:"192x192",type:"image/png"},
 {src:"/tenant/icons/icon-512.png",sizes:"512x512",type:"image/png"},
 {src:"/tenant/icons/icon-512-maskable.png",sizes:"512x512",type:"image/png",purpose:"maskable" as const},
 {src:"/tenant/icons/icon-1024.png",sizes:"1024x1024",type:"image/png"},
 {src:"/tenant/icons/icon-1024-maskable.png",sizes:"1024x1024",type:"image/png",purpose:"maskable" as const},
] as const;
export const PWA_SCREENSHOTS=[
 {src:"/pwa/screenshots/platform-wide.png",sizes:"1280x720",type:"image/png",form_factor:"wide" as const,label:"Hospitality platform on a wide display"},
 {src:"/pwa/screenshots/platform-narrow.png",sizes:"750x1334",type:"image/png",form_factor:"narrow" as const,label:"Hospitality platform on mobile"},
] as const;
export const PWA_PRESENTATION_SCREENSHOT={src:"/pwa/screenshots/presentation-wide.png",sizes:"1280x720",type:"image/png",form_factor:"wide" as const,label:"Guest presentation on a TV display"} as const;
