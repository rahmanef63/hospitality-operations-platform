import { CmsDesktopNav, CmsMobileDock } from "./cms-nav";
export function CmsShell({ children }: { children: React.ReactNode }) { return <div className="min-h-[calc(100vh-0rem)] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]"><CmsDesktopNav/><div className="min-w-0 pb-[calc(8.75rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</div><CmsMobileDock/></div>; }
