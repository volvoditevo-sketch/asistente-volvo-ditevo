
import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAI = message.sender === Sender.AI;

  return (
    <div className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
        isAI 
          ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' 
          : 'bg-[#003057] text-white rounded-tr-none'
      }`}>
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>
        
        {isAI && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Fuentes verificadas:</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#003057] hover:underline bg-blue-50 px-2 py-1 rounded"
                >
                  {source.title || 'Ver en la web'}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className={`text-[10px] mt-2 ${isAI ? 'text-gray-400' : 'text-blue-200'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
