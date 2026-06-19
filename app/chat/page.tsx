'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlatformBadge } from '@/components/ui/platform-badge';

interface Conversation {
  id: number;
  customer: string;
  channel: string;
  lastMessage: string;
  unread: number;
}

const conversations: Conversation[] = [
  { id: 1, customer: "น้องมิ้น", channel: "TikTok", lastMessage: "ส่งของเมื่อไหร่ครับ?", unread: 3 },
  { id: 2, customer: "คุณสมชาย", channel: "Shopee", lastMessage: "ขอบคุณครับ", unread: 0 },
  { id: 3, customer: "คุณจันทร์", channel: "Facebook", lastMessage: "มีสีอื่นไหมคะ?", unread: 1 },
];

export default function UnifiedChatPage() {
  const [selectedChat, setSelectedChat] = useState(0);
  const currentChat = conversations[selectedChat];

  return (
    <div className="flex h-[calc(100vh-120px)] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="font-semibold text-lg">Unified Inbox</h2>
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="mt-3 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat, index) => (
            <button
              key={index}
              onClick={() => setSelectedChat(index)}
              aria-current={selectedChat === index ? "page" : undefined}
              className={`w-full text-left p-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500 ${
                selectedChat === index ? 'bg-zinc-800' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={chat.channel.toLowerCase() as "tiktok" | "shopee" | "facebook" | "lazada"} showLabel={false} />
                  <div>
                    <div className="font-medium">{chat.customer}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{chat.channel}</div>
                  </div>
                </div>
                {chat.unread > 0 && (
                  <Badge variant="info" size="sm" aria-label={`${chat.unread} unread messages`}>
                    {chat.unread}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-zinc-400 mt-1.5 truncate pr-4">{chat.lastMessage}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">{currentChat.customer}</div>
            <div className="text-xs text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Online • {currentChat.channel}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Tag Order</Button>
            <Button variant="secondary" size="sm">Assign Sales</Button>
            <Button variant="secondary" size="sm">Create Task</Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-950">
          <div className="max-w-[75%] bg-zinc-800 p-4 rounded-2xl rounded-bl-none text-sm">
            สวัสดีครับ สั่งของเมื่อวานยังไม่ได้รับเลยครับ
          </div>
          <div className="max-w-[75%] ml-auto bg-blue-600 p-4 rounded-2xl rounded-br-none text-sm">
            ขออภัยครับ กำลังจัดส่งให้ครับ Tracking จะส่งให้ภายใน 10 นาทีนี้
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Type a message... (use #ORDER or @sales)" 
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <Button>Send</Button>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 px-1">Tip: Type # to tag order, @ to mention sales</p>
        </div>
      </div>

      {/* Customer Sidebar */}
      <div className="w-72 border-l border-zinc-800 p-5 space-y-6 overflow-y-auto">
        <div>
          <div className="text-xs text-zinc-500">CUSTOMER</div>
          <div className="font-semibold text-xl mt-1">{currentChat.customer}</div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-2">LINKED ORDERS</div>
          <div className="bg-zinc-800 p-3 rounded-xl text-sm font-mono text-blue-400">TK-1001 • ฿2,450</div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-2">QUICK ACTIONS</div>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">View Full Profile</Button>
            <Button variant="secondary" className="w-full justify-start">Create Refund</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
