
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext.ts';

const WhatsAppButton: React.FC = () => {
  const { whatsappContact } = useUser();

  // Determine if it's a raw number or a full link
  const getFullLink = () => {
    if (!whatsappContact) return '#';
    if (whatsappContact.startsWith('http')) return whatsappContact;
    // Assume it's a number, clean it and format for wa.me
    const cleanNumber = whatsappContact.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end group">
      {/* Tooltip */}
      <div className="mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 pointer-events-none whitespace-nowrap">
        Any Problem? Contact Us!
      </div>
      
      {/* Pulse Rings */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25"></div>
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-20 scale-125"></div>
        
        <a
          href={getFullLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-emerald-500 text-white rounded-full shadow-2xl transform transition-transform hover:scale-110 active:scale-95 z-10 border-4 border-white"
        >
          <MessageCircle size={32} fill="currentColor" className="text-white" />
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
