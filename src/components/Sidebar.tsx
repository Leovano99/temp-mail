import { Inbox, Mail, X } from 'lucide-react';

interface SidebarProps {
  emailCount?: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ emailCount = 0, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside className={`
      fixed lg:relative z-40 h-full w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col py-6 shrink-0 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#e6edf3]">TempMail</h1>
        </div>
        
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-[#7d8590] hover:text-white hover:bg-[#21262d] rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="px-4 space-y-1">
        <button 
          onClick={() => setIsOpen(false)} // Auto close on mobile after click
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-sm font-medium bg-[#1f6feb] text-white shadow-sm"
        >
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
    </aside>
  );
}
