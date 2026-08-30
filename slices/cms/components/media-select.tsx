import { MEDIA_OPTIONS } from "@/shared/media";
export function MediaSelect({ name, value, label }: { name: string; value: string; label: string }) {
  return <label className="grid gap-2 text-xs font-semibold"><span>{label}</span><select name={name} defaultValue={value} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3 text-sm">{MEDIA_OPTIONS.map((item)=><option key={item.key} value={item.key}>{item.label}</option>)}</select></label>;
}
