import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { getEmails } from '../api';

interface EmailListProps {
  address: string;
  activeEmailId: string | null;
  onSelectEmail: (id: string) => void;
  refreshTrigger: number;
  onCountChange?: (count: number) => void;
}

export function EmailList({ address, activeEmailId, onSelectEmail, refreshTrigger, onCountChange }: EmailListProps) {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEmails(address);
      const newEmails = data || [];
      setEmails(newEmails);
      if (onCountChange) onCountChange(newEmails.length);
    } catch (e) {
      console.error(e);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Auto refresh every 7 seconds
    const interval = setInterval(() => {
      fetchInbox();
    }, 7000); 
    return () => clearInterval(interval);
  }, [address, refreshTrigger]);

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-[#e6edf3]">Inbox</h3>
        <span className="text-xs text-[#7d8590] font-medium">
           {loading && emails.length > 0 ? "Refreshing..." : `${emails.length} messages`}
        </span>
      </div>
      
      <div className="flex flex-col bg-[#0d1117]">
        {error && (
          <div className="p-4 text-center text-red-400 text-xs">{error}</div>
        )}
        {emails.length === 0 && !loading && !error && (
          <div className="p-8 text-center text-sm text-[#7d8590]">Waiting for incoming emails...</div>
        )}
        {emails.length === 0 && loading && !error && (
          <div className="p-8 text-center text-sm text-[#7d8590]">Connecting to inbox...</div>
        )}
        
        {emails.map((email, idx) => {
          const isActive = activeEmailId === email.id;
          const timeDate = new Date(email.time);
          const timeLabel = isNaN(timeDate.getTime()) ? email.time : timeDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

          return (
            <motion.button
              key={email.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onSelectEmail(email.id)}
              className={clsx(
                "w-full text-left p-4 border-b border-[#30363d] transition-colors relative",
                isActive 
                  ? "bg-[#161b22]" 
                  : "bg-[#0d1117] hover:bg-[#161b22]/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1f6feb]" />
              )}
              
              <div className="flex justify-between items-baseline mb-1">
                <span className={clsx(
                  "font-medium text-sm truncate pr-2 text-[#e6edf3]"
                )}>
                  {email.sender}
                </span>
                <span className="text-[11px] whitespace-nowrap text-[#7d8590]">
                  {timeLabel}
                </span>
              </div>
              <h4 className="text-[13px] mb-1 truncate text-[#e6edf3] font-medium">
                {email.subject}
              </h4>
              <p className="text-[13px] text-[#7d8590] truncate">{email.preview || 'No preview text...'}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
