#!/usr/bin/env node
import { readFileSync } from "node:fs";
const checks = [
  ["shared/brand/config.ts", '@/tenant'],
  ["shared/config/site.ts", '@/tenant'],
  ["shared/media/assets.ts", '@/tenant'],
  ["shared/content/config/site-content.ts", '@/tenant'],
  ["shared/pms/config.ts", '@/tenant'],
];
const errors=[];
for(const [file,needle] of checks){const source=readFileSync(file,"utf8");if(!source.includes(needle))errors.push(`${file} must resolve provider identity/config through the tenant boundary`);}
const platform=JSON.parse(readFileSync(".platform/distribution.json","utf8"));
for(const required of ["tenant/","public/tenant/"]){if(!platform.tenantProtectedPrefixes.includes(required))errors.push(`tenantProtectedPrefixes must include ${required}`);}
if(errors.length){console.error(`✖ ${errors.length} tenant-boundary violation(s):`);errors.forEach(e=>console.error(`  · ${e}`));process.exit(1);}
console.log("✓ audit-brand-copy: provider identity and content remain behind protected tenant overlays");
