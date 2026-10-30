import { CmsOverview } from "@/features/cms";
import { loadCmsOverview } from "@/shared/cms/admin";
import { initializeCmsAction, publishCmsAction } from "./actions-core";
export const instant=false;
export default async function Page({searchParams}:{searchParams:Promise<{status?:string;error?:string}>}){const [overview,params]=await Promise.all([loadCmsOverview(),searchParams]);return <CmsOverview overview={overview} status={params.status} error={params.error} initializeAction={initializeCmsAction} publishAction={publishCmsAction}/>;}
