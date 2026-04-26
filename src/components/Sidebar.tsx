import { Inbox, Mail } from 'lucide-react';

interface SidebarProps {
  emailCount?: number;
}

export function Sidebar({ emailCount = 0 }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col justify-between py-6 shrink-0">
      <div>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#e6edf3]">TempMail</h1>
        </div>

        <nav className="px-4 space-y-1">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium bg-[#1f6feb] text-white">
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              Inbox
            </div>
            {emailCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                {emailCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </aside>
  );
}
