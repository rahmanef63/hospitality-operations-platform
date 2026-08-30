import type { PublicPropertyFacts } from "@/shared/pms";
export type ConciergeLink={label:string;href:string;external?:boolean};
export type ConciergeReply={answer:string;topic:"amenities"|"booking"|"contact"|"location"|"rooms"|"welcome";actions:ConciergeLink[];suggestions:string[]};
export type ConciergeContext={facts:PublicPropertyFacts;propertyName:string;address:string;email:string;whatsappHref?:string;mapHref?:string};
