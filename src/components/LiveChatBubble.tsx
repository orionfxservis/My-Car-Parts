import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUp, Headphones, MessageCircle, MessageSquare, Send, X } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

interface LiveChatBubbleProps {
  externalPrompt: string | null;
  onConsumeExternalPrompt: () => void;
  cookieBannerVisible?: boolean;
}

type SupportDepartment = 'Automotive' | 'Generators' | 'Heavy Machinery';

const QUICK_TOPICS: Record<SupportDepartment, string[]> = {
  Automotive: [
    'Check VK-AT-420 torque wrench stock',
    'OBD-II scanner J2534 compatibility',
  ],
  Generators: [
    '50 kW load bank lead time',
    '1000V switchgear calibration cert',
  ],
  'Heavy Machinery': [
    '50-Ton hydraulic puller jaw spread',
    '4200 Nm torque multiplier shipping',
  ],
};

function getServiceReply(text: string, dept: SupportDepartment): string {
  const lower = text.toLowerCase();
  if (lower.includes('stock') || lower.includes('lead') || lower.includes('shipping')) {
    return `Current ${dept} inventory ships within 24–48 hours from our Detroit and Rotterdam depots. Share your destination city or SKU if you need air-freight rates.`;
  }
  if (lower.includes('calibrat') || lower.includes('cert') || lower.includes('nist')) {
    return 'All torque wrenches, gauges, and load analyzers include a serialized ISO/IEC 17025 NIST-traceable certificate valid for 12 months. Recalibration turnaround is 3 business days.';
  }
  if (lower.includes('j2534') || lower.includes('scanner') || lower.includes('can')) {
    return 'The VK-AT-905 telemetry tablet supports CAN-FD, DoIP, and J2534 pass-through flashing for passenger vehicles and light commercial trucks.';
  }
  if (lower.includes('jaw') || lower.includes('spread') || lower.includes('puller') || lower.includes('ton')) {
    return 'The VK-HM-50T 50-Ton Hydraulic Puller provides a 520 mm max jaw spread, 150 mm spring-return stroke, and operates at 700 Bar (10,000 PSI).';
  }
  if (lower.includes('load') || lower.includes('avr') || lower.includes('generator')) {
    return 'Our LB-5000 50 kW Load Bank handles 208V, 400V, and 480V 3-phase generators at 50/60 Hz with 1 kW step resolution for AVR and wet-stacking tests.';
  }
  return `Thanks for reaching My Car Parts ${dept} Customer Service. An engineering specialist has logged your note—please drop your email or SKU here if you would like a direct spec sheet or formal quote sent over.`;
}

function formatNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function LiveChatBubble({
  externalPrompt,
  onConsumeExternalPrompt,
  cookieBannerVisible = false,
}: LiveChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [department, setDepartment] = useState<SupportDepartment>('Automotive');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: 'Welcome to My Car Parts Customer Service. Select a division below or ask about tool specs, stock availability, and calibration.',
      timestamp: formatNow(),
    },
  ]);

  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: externalPrompt,
        timestamp: formatNow(),
      };
      const agentMsg: ChatMessage = {
        id: `a-${Date.now() + 1}`,
        sender: 'agent',
        text: getServiceReply(externalPrompt, department),
        timestamp: formatNow(),
      };
      setMessages((prev) => [...prev, userMsg, agentMsg]);
      onConsumeExternalPrompt();
    }
  }, [externalPrompt, department, onConsumeExternalPrompt]);

  useEffect(() => {
    if (isOpen) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: formatNow(),
    };
    const replyText = getServiceReply(trimmed, department);
    const agentMsg: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      sender: 'agent',
      text: replyText,
      timestamp: formatNow(),
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInputValue('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 z-40 transition-all duration-200 ${
        cookieBannerVisible ? 'bottom-44 sm:bottom-36 lg:bottom-28' : 'bottom-4 sm:bottom-6'
      }`}
    >
      {isOpen && (
        <div
          role="dialog"
          aria-label="Customer Service Live Chat"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[376px] max-h-[75vh] bg-[#161B24] border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#1C2330] border-b border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  Customer Service Desk
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Parts, Calibration &amp; Technical Support
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize customer service chat"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Department Selector */}
          <div className="px-3 py-2 bg-[#12161E] border-b border-slate-800 flex items-center gap-1">
            {(['Automotive', 'Generators', 'Heavy Machinery'] as SupportDepartment[]).map(
              (dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap truncate ${
                    department === dept
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {dept}
                </button>
              ),
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[320px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-[#202734] text-slate-200 border border-slate-700/70'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[10px] font-mono tabular-nums text-slate-500">
                  {msg.sender === 'user' ? 'You' : `${department} Desk`} · {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={listEndRef} />
          </div>

          {/* Quick Topic Buttons */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {QUICK_TOPICS[department].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => sendMessage(topic)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#1D2430] hover:bg-[#263040] text-slate-300 border border-slate-700/80 transition-colors cursor-pointer text-left"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-slate-800 bg-[#12161E] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask ${department} support...`}
              aria-label="Type your customer service message"
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#1A202B] border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Bar: WhatsApp & Go to Top before Live Support */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <a
          href="https://wa.me/923002183149"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="inline-flex items-center gap-1.5 h-[35px] sm:h-[39px] px-3 sm:px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-black/40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Go to top of page"
          className="inline-flex items-center gap-1.5 h-[35px] sm:h-[39px] px-3 sm:px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-black/40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
          <span>Go to Top</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close live customer support chat' : 'Open live customer support chat'}
          className="inline-flex items-center gap-1.5 h-[35px] sm:h-[39px] px-3 sm:px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-black/40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isOpen ? (
            <>
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span>Close Chat</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span>Live Support</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
