import { cn } from "@/lib/utils";
type BotanicalMarkProps={className?:string;title?:string};
export function BotanicalMark({className,title}:BotanicalMarkProps){return <span className={cn("inline-block shrink-0 bg-current",className)} role={title?"img":undefined} aria-label={title} aria-hidden={title?undefined:true} style={{WebkitMask:"url(/tenant/brand/botanical-mark.svg) center / contain no-repeat",mask:"url(/tenant/brand/botanical-mark.svg) center / contain no-repeat"}}/>;}
