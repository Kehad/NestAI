"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SidebarAiChatProps {
  listings: any[];
}

export default function SidebarAiChat({ listings }: SidebarAiChatProps) {
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "assistant", content: "Hi! I'm NestAI House Agent. Ask me anything about these properties!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsTyping(true);

    console.log("Sending to API:", { messages: newMessages, listings });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, listings })
      });
      const data = await res.json();
      console.log("API Response:", data);
      setChatMessages([...newMessages, data]);
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border-t border-[#1f1f1f] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
       <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#C1F32A] animate-pulse"></div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">NestAI House Agent</span>
       </div>
       
       <div className="max-h-48 overflow-y-auto mb-4 flex flex-col gap-3 custom-scrollbar pr-1">
          {chatMessages.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] shadow-sm ${
              m.role === 'user' 
              ? 'bg-[#C1F32A]/10 text-zinc-100 self-end border border-[#C1F32A]/20 rounded-tr-none' 
              : 'bg-[#1a1a1a] text-zinc-400 self-start border border-[#2a2a2a] rounded-tl-none'
            }`}>
              {m.content}
            </div>
          ))}
          {isTyping && <div className="text-[10px] text-zinc-600 animate-pulse ml-1">Agent is analyzing...</div>}
       </div>

       <form onSubmit={sendMessage} className="relative">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask for recommendations..."
            className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl py-3 pl-4 pr-12 text-[11px] text-white focus:outline-none focus:border-[#C1F32A]/50 transition-all placeholder:text-zinc-600"
          />
          <button type="submit" className="absolute right-2 top-2 p-1.5 text-[#C1F32A] hover:bg-[#C1F32A]/10 rounded-lg transition-all">
             <Search className="w-4 h-4" />
          </button>
       </form>
    </div>
  );
}
