import { Mail, Clock, Download, MoreHorizontal, UserCircle2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { getEmailDetail } from '../api';

interface EmailViewerProps {
  address: string;
  emailId: string | null;
}

export function EmailViewer({ address, emailId }: EmailViewerProps) {
  const [emailDetail, setEmailDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailId || !address) {
      setEmailDetail(null);
      return;
    }
    
    setLoading(true);
    getEmailDetail(address, emailId)
      .then(data => {
        setEmailDetail(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [emailId, address]);


  if (!emailId) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-[#7d8590] p-8 bg-[#0e1116]">
        <Mail className="w-12 h-12 text-[#30363d] mb-4 stroke-[1.5]" />
        <h3 className="text-lg font-medium text-[#7d8590] mb-1">No email selected</h3>
        <p className="text-sm text-center max-w-sm text-[#7d8590]">
          Select an email from the inbox list to read it here.
        </p>
      </div>
    );
  }

  if (loading || !emailDetail) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-[#7d8590] p-8 bg-[#0e1116]">
        <div className="animate-pulse flex flex-col items-center">
           <Mail className="w-10 h-10 text-[#30363d] mb-3 stroke-[2]" />
           <span className="text-sm">Fetching requested email...</span>
        </div>
      </div>
    );
  }

  const timeDate = new Date(emailDetail.created_at);
  const timeLabel = isNaN(timeDate.getTime()) ? emailDetail.created_at : timeDate.toLocaleString();

  // Securely sanitize the HTML
  const sanitizedHtml = DOMPurify.sanitize(emailDetail.body_html || "");

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[#0e1116]">
      {/* Email Header */}
      <div className="p-6 border-b border-[#30363d] shrink-0">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-[#e6edf3]">{emailDetail.subject}</h2>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] rounded hover:bg-[#21262d] transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] rounded hover:bg-[#21262d] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-10 h-10 text-[#7d8590] stroke-[1]" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[#e6edf3] text-sm">{emailDetail.sender}</span>
              </div>
              <div className="text-[12px] text-[#7d8590] mt-0.5">
                to {emailDetail.recipient}
              </div>
            </div>
          </div>
          <div className="text-[13px] text-[#7d8590] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {timeLabel}
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-8 text-[#e6edf3] leading-relaxed font-sans text-[14px]">
        {emailDetail.body_html ? (
          <div 
            className="my-email-container bg-white text-black p-8 rounded-lg shadow-sm"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
          />
        ) : (
          <div className="max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-lg p-8 whitespace-pre-wrap">
            {emailDetail.body_text || "This email has no body content."}
          </div>
        )}
      </div>
    </div>
  );
}
