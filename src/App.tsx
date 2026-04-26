import { useState, useEffect, type FormEvent } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EmailList } from './components/EmailList';
import { EmailViewer } from './components/EmailViewer';

const AVAILABLE_DOMAINS = ["leyon.my.id", "temp.leyon.my.id", "yourdomain.com"];
const EXPECTED_TOKEN = import.meta.env.VITE_APP_GUARD_TOKEN || "admin123";

function generatePronounceableWord(length: number) {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  let word = '';
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      word += consonants.charAt(Math.floor(Math.random() * consonants.length));
    } else {
      word += vowels.charAt(Math.floor(Math.random() * vowels.length));
    }
  }
  return word;
}

function generateRandomEmail() {
  const word1 = generatePronounceableWord(5);
  const number = Math.floor(Math.random() * 100);
  return `${word1}${number}@${AVAILABLE_DOMAINS[0]}`;
}

export default function App() {
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);
  const [currentEmailAddress, setCurrentEmailAddress] = useState<string>('');
  const [emailCount, setEmailCount] = useState<number>(0);

  // Auth state
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('temp_mail_token'));
  const [inputToken, setInputToken] = useState("");
  const [authError, setAuthError] = useState("");

  // Refresh trigger to force fetch in EmailList component
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem('temp_email_address');
    if (savedEmail) {
      setCurrentEmailAddress(savedEmail);
    } else {
      const newEmail = generateRandomEmail();
      setCurrentEmailAddress(newEmail);
      localStorage.setItem('temp_email_address', newEmail);
    }
  }, []);

  const handleTokenSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputToken === EXPECTED_TOKEN) {
      setAuthToken(inputToken);
      localStorage.setItem('temp_mail_token', inputToken);
      setAuthError("");
    } else {
      setAuthError("Invalid access token.");
    }
  };

  const handleRefreshAddress = () => {
    const newEmail = generateRandomEmail();
    setCurrentEmailAddress(newEmail);
    localStorage.setItem('temp_email_address', newEmail);
    setActiveEmailId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCustomAddressSubmit = (address: string) => {
    setCurrentEmailAddress(address);
    localStorage.setItem('temp_email_address', address);
    setActiveEmailId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const manuallyRefreshInbox = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (authToken !== EXPECTED_TOKEN) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0e1116] text-[#e6edf3] font-sans">
        <form onSubmit={handleTokenSubmit} className="bg-[#0d1117] border border-[#30363d] p-8 rounded-xl shadow-2xl w-96 flex flex-col gap-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-[#1f6feb] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4 tracking-tight">Backend Access restricted</h2>
          <input
            type="password"
            autoFocus
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            className="bg-[#0e1116] border border-[#30363d] text-white px-3 py-2.5 rounded-md outline-none focus:border-[#1f6feb] transition-colors"
            placeholder="Enter secure token"
          />
          {authError && <span className="text-red-400 text-sm text-center">{authError}</span>}
          <button type="submit" className="mt-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 rounded-md transition-colors shadow-sm">
            Unlock Interface
          </button>
        </form>
      </div>
    );
  }

  if (!currentEmailAddress) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#0e1116] text-[#7d8590]">Loading interface...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-[#0e1116] text-[#e6edf3] overflow-hidden font-sans">
      <Sidebar emailCount={emailCount} />
      <main className="flex-1 flex flex-col relative z-0 overflow-hidden">
        <Header
          email={currentEmailAddress}
          availableDomains={AVAILABLE_DOMAINS}
          onNewAddress={handleRefreshAddress}
          onRefreshInbox={manuallyRefreshInbox}
          onCustomAddressSubmit={handleCustomAddressSubmit}
        />
        <div className="flex-1 flex overflow-hidden z-10">
          <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-[#30363d] flex flex-col bg-[#0d1117] border-y-0 border-l-0">
            <EmailList
              address={currentEmailAddress}
              activeEmailId={activeEmailId}
              onSelectEmail={setActiveEmailId}
              refreshTrigger={refreshTrigger}
              onCountChange={setEmailCount}
            />
          </div>
          <div className="flex-1 relative bg-[#0e1116]">
            <EmailViewer address={currentEmailAddress} emailId={activeEmailId} />
          </div>
        </div>
      </main>
    </div>
  );
}
