import { useState, FormEvent, useEffect } from 'react';
import { Copy, RefreshCw, Check, PlusCircle, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  email: string;
  availableDomains: string[];
  onNewAddress: () => void;
  onRefreshInbox: () => void;
  onCustomAddressSubmit: (address: string) => void;
}

export function Header({ email, availableDomains, onNewAddress, onRefreshInbox, onCustomAddressSubmit }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialParts = email.includes('@') ? email.split('@') : [email, availableDomains[0]];
  const [editUsername, setEditUsername] = useState(initialParts[0]);
  const [selectedDomain, setSelectedDomain] = useState(initialParts[1] || availableDomains[0]);

  useEffect(() => {
    if (email) {
      const parts = email.split('@');
      if (parts.length === 2) {
        setEditUsername(parts[0]);
        setSelectedDomain(parts[1]);
      }
    }
  }, [email, isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (editUsername.trim()) {
      onCustomAddressSubmit(`${editUsername.trim()}@${selectedDomain}`);
    }
    setIsEditing(false);
  };

  return (
    <header className="h-16 bg-[#0d1117] border-b border-[#30363d] flex items-center flex-row-reverse justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-4">
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
            <input 
              autoFocus
              className="bg-[#0e1116] border border-[#30363d] text-[#e6edf3] text-sm rounded px-2 py-1.5 outline-none focus:border-[#1f6feb] w-32 transition-colors"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="username"
            />
            <span className="text-[#7d8590] text-sm font-medium">@</span>
            <select 
              className="bg-[#0e1116] border border-[#30363d] text-[#e6edf3] text-sm rounded px-2 py-1.5 outline-none focus:border-[#1f6feb] transition-colors"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {availableDomains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="flex items-center gap-1 ml-2">
              <button type="submit" className="text-[11px] font-semibold bg-[#238636] hover:bg-[#2ea043] text-white px-2.5 py-1.5 rounded transition-colors shadow-sm">
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-[11px] font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[rgba(240,246,252,0.1)] px-2.5 py-1.5 rounded transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col text-right group relative cursor-pointer" onClick={() => setIsEditing(true)}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] flex items-center justify-end gap-1">
              Active Address
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-sm font-medium text-[#e6edf3]">{email}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 border-l border-[#30363d] pl-4">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#21262d] text-[#7d8590] hover:text-[#e6edf3] transition-colors"
            title="Copy to clipboard"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-[#3fb950]"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          <button 
            onClick={onRefreshInbox}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#21262d] text-[#7d8590] hover:text-[#e6edf3] transition-colors group"
            title="Refresh Inbox Now"
          >
            <RefreshCw className="w-4 h-4 group-active:rotate-180 transition-transform duration-300" />
          </button>

          <button 
            onClick={onNewAddress}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#21262d] text-[#7d8590] hover:text-[#e6edf3] transition-colors ml-1"
            title="Generate Random Address"
          >
             <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
