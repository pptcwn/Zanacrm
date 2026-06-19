'use client';

import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useOrderStore } from '@/lib/store/orderStore';
import { useCustomerStore } from '@/lib/store/customerStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, MessageSquare, Send, User, Tag, ShoppingBag, 
  Plus, X, ChevronRight, Sparkles, Clock, AlertCircle, 
  Filter, CheckCircle2, RefreshCw, Paperclip
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/platform-badge';

const PREDEFINED_TAGS = [
  { id: '6a3a4115-46aa-4a5d-b2a6-0683648eb101', name: 'VIP', color: '#EAB308', category: 'customer' },
  { id: '6a3a4115-46aa-4a5d-b2a6-0683648eb102', name: 'Blacklist', color: '#EF4444', category: 'customer' },
  { id: '6a3a4115-46aa-4a5d-b2a6-0683648eb103', name: 'Bulk Buyer', color: '#3B82F6', category: 'customer' },
  { id: '6a3a4115-46aa-4a5d-b2a6-0683648eb104', name: 'Need Care', color: '#10B981', category: 'customer' },
  { id: '6a3a4115-46aa-4a5d-b2a6-0683648eb105', name: 'Cancel Prone', color: '#F97316', category: 'customer' },
];

export default function ChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    messages, 
    fetchConversations, 
    fetchMessages, 
    setActiveConversation, 
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    customerTags,
    fetchCustomerTags,
    addCustomerTag,
    removeCustomerTag
  } = useChatStore();
  
  const { user } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const [input, setInput] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'facebook' | 'tiktok' | 'shopee'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'resolved' | 'pending'>('active');
  
  // Tag Autocomplete Suggestion State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'agent' | 'order' | 'template' | null>(null);
  const [suggestionQuery, setSuggestionQuery] = useState('');
  
  // CRM Drawer & Modal State
  const [isCRMCollapsed, setIsCRMCollapsed] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showAddTagDropdown, setShowAddTagDropdown] = useState(false);
  const [hoveredOrderTag, setHoveredOrderTag] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Form State for Quick Order
  const [newOrderProduct, setNewOrderProduct] = useState('');
  const [newOrderPrice, setNewOrderPrice] = useState('590');
  const [newOrderQuantity, setNewOrderQuantity] = useState('1');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchOrders();
  }, [fetchConversations, fetchOrders]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      subscribeToMessages(activeConversationId);
      
      const conv = conversations.find(c => c.id === activeConversationId);
      if (conv?.customer_id) {
        fetchCustomerTags(conv.customer_id);
      }
      
      // Simulate typing indicator effect for 1.2s when switching chats
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1200);
      return () => {
        clearTimeout(timer);
        unsubscribeFromMessages();
      };
    }
  }, [activeConversationId, fetchMessages, subscribeToMessages, unsubscribeFromMessages, conversations, fetchCustomerTags]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Filters logic
  const filteredConversations = conversations.filter(conv => {
    const customerName = conv.customers?.name || '';
    const matchSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (conv.last_message || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlatform = selectedPlatform === 'all' || conv.channel === selectedPlatform;
    const matchStatus = conv.status === selectedStatus;
    return matchSearch && matchPlatform && matchStatus;
  });


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId) return;
    
    await sendMessage(activeConversationId, input.trim(), 'agent', user?.id);
    setInput('');
    setShowSuggestions(false);
    
    // Simulate short customer typing answer simulation in demo environment
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        // Add random reply template
        const replies = [
          "ได้รับข้อมูลแล้วครับผม",
          "จัดส่งวันไหนเหรอครับ?",
          "ขอบคุณสำหรับการบริการที่รวดเร็วครับ",
          "ตัวนี้มีสินค้าพร้อมส่งเลยไหม?",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        await sendMessage(activeConversationId, randomReply, 'customer');
      }, 2000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    const lastChar = val.substring(val.length - 1);
    if (lastChar === '@') {
      setSuggestionType('agent');
      setShowSuggestions(true);
      setSuggestionQuery('');
    } else if (lastChar === '#') {
      setSuggestionType('order');
      setShowSuggestions(true);
      setSuggestionQuery('');
    } else if (lastChar === '/') {
      setSuggestionType('template');
      setShowSuggestions(true);
      setSuggestionQuery('');
    } else if (showSuggestions) {
      const parts = val.split(/[@#/]/);
      const query = parts[parts.length - 1];
      setSuggestionQuery(query);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (value: string) => {
    const parts = input.split(/[@#/]/);
    parts.pop(); // Remove the typed query
    const prefix = parts.join(suggestionType === 'agent' ? '@' : suggestionType === 'order' ? '#' : '/');
    const symbol = suggestionType === 'agent' ? '@' : suggestionType === 'order' ? '#' : '';
    setInput(prefix + symbol + value + ' ');
    setShowSuggestions(false);
    setSuggestionType(null);
  };

  // Mock Quick Order Creation
  const handleCreateMockOrder = async () => {
    if (!activeConversation?.customer_id) return;
    
    const randomOrdNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const supabase = require('@/lib/supabase/client').createBrowserClient();
    
    const { error } = await supabase.from('orders').insert({
      order_number: randomOrdNum,
      channel: activeConversation.channel === 'facebook' ? 'facebook' : activeConversation.channel === 'tiktok' ? 'tiktok' : 'shopee',
      customer_id: activeConversation.customer_id,
      status: 'pending',
      subtotal: parseFloat(newOrderPrice) * parseInt(newOrderQuantity),
      shipping_cost: 50,
      discount: 0,
      total_amount: parseFloat(newOrderPrice) * parseInt(newOrderQuantity) + 50,
      notes: `Quick order created for ${newOrderProduct}`
    });

    if (!error) {
      fetchOrders();
      setShowCreateOrderModal(false);
      // Send a system message inside the chat thread
      await sendMessage(activeConversationId!, `System: Created order ${randomOrdNum} for ฿${parseFloat(newOrderPrice) * parseInt(newOrderQuantity) + 50}`, 'system');
    }
  };

  const activeCustomerTags = activeConversation?.customer_id 
    ? customerTags[activeConversation.customer_id] || [] 
    : [];

  const customerOrders = activeConversation?.customer_id
    ? orders.filter(o => o.customer_id === activeConversation.customer_id)
    : [];

  // Parse message body to highlight tags
  const renderMessageContent = (content: string) => {
    if (!content.includes('#') && !content.includes('@')) return content;
    
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#ORD-')) {
        return (
          <span 
            key={index} 
            className="underline decoration-dotted text-blue-200 cursor-pointer font-semibold relative group"
            onMouseEnter={() => setHoveredOrderTag(part)}
            onMouseLeave={() => setHoveredOrderTag(null)}
          >
            {part}
            {hoveredOrderTag === part && (
              <span className="absolute bottom-6 left-0 bg-zinc-900 border border-zinc-800 text-zinc-100 text-[10px] p-2.5 rounded-lg shadow-xl w-44 z-50 text-left font-normal animate-in fade-in slide-in-from-bottom-2 duration-200">
                <span className="font-bold text-white block mb-1">{part}</span>
                <span className="block text-zinc-400">Status: <span className="text-amber-400 font-semibold">Pending</span></span>
                <span className="block text-zinc-400">Total: ฿640</span>
                <span className="block text-zinc-500 mt-1 text-[9px]">Click to view details</span>
              </span>
            )}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span key={index} className="bg-blue-800/60 text-blue-200 px-1.5 py-0.5 rounded text-xs font-semibold cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden relative">
      {/* Column 1: Conversations List */}
      <Card className="w-1/4 flex flex-col border-zinc-800/50 bg-zinc-950/40 backdrop-blur-md overflow-hidden transition-all duration-300">
        {/* Header search & filters */}
        <div className="p-3 border-b border-zinc-800/50 space-y-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..." 
            icon={<Search className="h-4 w-4 text-zinc-500" />}
            className="bg-zinc-900/50 border-zinc-800"
          />
          
          {/* Status filter tabs */}
          <div className="flex bg-zinc-900/40 p-0.5 rounded-lg border border-zinc-800/50">
            <button 
              onClick={() => setSelectedStatus('active')}
              className={`flex-1 text-[10px] py-1 rounded font-medium transition-colors ${selectedStatus === 'active' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setSelectedStatus('pending')}
              className={`flex-1 text-[10px] py-1 rounded font-medium transition-colors ${selectedStatus === 'pending' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setSelectedStatus('resolved')}
              className={`flex-1 text-[10px] py-1 rounded font-medium transition-colors ${selectedStatus === 'resolved' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Resolved
            </button>
          </div>

          {/* Platform Filters */}
          <div className="flex gap-1">
            {['all', 'facebook', 'tiktok', 'shopee'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat as any)}
                className={`flex-1 text-[10px] py-1 px-1 rounded border capitalize transition-all duration-200 ${
                  selectedPlatform === plat 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold' 
                    : 'bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {plat === 'all' ? 'All' : plat === 'facebook' ? 'FB' : plat === 'tiktok' ? 'TT' : 'SP'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable chat cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-8 w-8 text-zinc-700 mb-2" />
              <span>No conversations found.</span>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const customerName = conv.customers?.name || 'Unknown Customer';
              const isActive = activeConversationId === conv.id;
              
              return (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all duration-300 relative group overflow-hidden ${
                    isActive 
                      ? 'bg-blue-500/5 border-blue-500/30' 
                      : 'bg-zinc-900/10 border-transparent hover:bg-zinc-900/40'
                  } ${
                    conv.channel === 'tiktok' ? 'hover:shadow-[0_0_8px_rgba(37,244,238,0.12)] hover:border-[var(--tiktok)]/20' :
                    conv.channel === 'shopee' ? 'hover:shadow-[0_0_8px_rgba(238,77,45,0.12)] hover:border-[var(--shopee)]/20' :
                    'hover:shadow-[0_0_8px_rgba(24,119,242,0.12)] hover:border-[var(--facebook)]/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 text-xs font-semibold relative">
                    <User className="h-4 w-4" />
                    <span className="absolute -bottom-1 -right-1">
                      <PlatformBadge platform={conv.channel} showLabel={false} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`font-medium truncate text-xs ${isActive ? 'text-blue-400' : 'text-zinc-200'}`}>
                        {customerName}
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {conv.updated_at ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(conv.updated_at)) : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] text-zinc-500 truncate max-w-[80%]">{conv.last_message || 'No messages yet'}</p>
                      {conv.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Column 2: Active Chat Area */}
      <Card className="flex-1 flex flex-col border-zinc-800/50 bg-zinc-950/40 backdrop-blur-md overflow-hidden relative">
        {activeConversationId ? (
          <>
            {/* Header info */}
            <div className="p-3 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/10">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-semibold text-xs">
                    {activeConversation?.customers?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs flex items-center gap-1.5">
                      {activeConversation?.customers?.name || 'Unknown Customer'}
                      <PlatformBadge platform={activeConversation?.channel || 'facebook'} showLabel={false} />
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        • Assigned to: {activeConversation?.assigned_to ? 'Sales Representative' : 'Unassigned'}
                      </span>
                    </div>
                  </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsCRMCollapsed(!isCRMCollapsed)}
                  className="bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Filter className="h-3 w-3" />
                  {isCRMCollapsed ? 'Show Details' : 'Hide Details'}
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
              {activeMessages.map((msg, idx) => {
                const isAgent = msg.sender_type === 'agent';
                const isSystem = msg.sender_type === 'system';
                
                if (isSystem) {
                  return (
                    <div key={msg.id || idx} className="flex justify-center my-1.5">
                      <span className="bg-zinc-900/80 border border-zinc-800/50 text-zinc-400 text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5 text-blue-400" />
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id || idx} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-xs transition-all duration-300 scale-in-bounce ${
                        isAgent 
                          ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                          : 'bg-zinc-900/90 text-zinc-200 rounded-tl-sm border border-zinc-800/80'
                      }`}
                    >
                      <div>{renderMessageContent(msg.content)}</div>
                      <div className={`text-[9px] mt-1 text-right ${isAgent ? 'text-blue-200' : 'text-zinc-500'}`}>
                        {msg.created_at ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(msg.created_at)) : 'Sending...'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing wave indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/60 border border-zinc-850 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center max-w-[60px]">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Popover Drawer */}
            {showSuggestions && (
              <div className="absolute bottom-16 left-4 bg-zinc-950 border border-zinc-800 rounded-xl p-2 w-64 shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-200">
                <div className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-wider font-semibold border-b border-zinc-900 pb-1.5 mb-1.5 flex justify-between">
                  <span>Insert {suggestionType} tag</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setShowSuggestions(false)} />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 p-0.5">
                  {suggestionType === 'agent' && (
                    ['Sales_Som', 'Sales_Oat', 'Manager_Joy'].map(agent => (
                      <div 
                        key={agent}
                        onClick={() => handleSelectSuggestion(agent)}
                        className="text-xs text-zinc-200 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer flex items-center gap-2"
                      >
                        <User className="h-3 w-3 text-zinc-500" />
                        <span>@{agent}</span>
                      </div>
                    ))
                  )}

                  {suggestionType === 'order' && (
                    customerOrders.length > 0 ? (
                      customerOrders.map(ord => (
                        <div 
                          key={ord.id}
                          onClick={() => handleSelectSuggestion(ord.order_number)}
                          className="text-xs text-zinc-200 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer flex justify-between"
                        >
                          <span className="font-semibold">#{ord.order_number}</span>
                          <span className="text-zinc-500">฿{ord.total_amount}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-zinc-500 p-2 text-center">No orders found</div>
                    )
                  )}

                  {suggestionType === 'template' && (
                    [
                      { title: 'Bank Account', text: 'PromptPay: 099-XXX-XXXX' },
                      { title: 'Promo Info', text: 'Buy 2 Get 1 Free Promo' },
                      { title: 'Shipping Policy', text: 'Shipment takes 2-3 business days' }
                    ].map(tpl => (
                      <div 
                        key={tpl.title}
                        onClick={() => handleSelectSuggestion(tpl.text)}
                        className="text-xs text-zinc-200 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer text-left"
                      >
                        <div className="font-bold text-zinc-100">{tpl.title}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{tpl.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Message input area */}
            <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/10">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <button
                  type="button"
                  className="bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 px-3 rounded-xl flex items-center justify-center transition-colors"
                  onClick={() => {
                    setSuggestionType('template');
                    setShowSuggestions(true);
                  }}
                >
                  <Tag className="h-4 w-4" />
                </button>
                
                <Input 
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type message... (use @ to assign, # for orders, / for templates)" 
                  className="flex-1 bg-zinc-900 border-zinc-800 text-xs focus:ring-1 focus:ring-blue-500"
                />

                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-550">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-zinc-700" />
            </div>
            <p className="font-medium text-zinc-400 text-xs">No conversation selected</p>
            <p className="text-[11px] text-zinc-550 mt-0.5">Select a customer card from the list to begin chatting.</p>
          </div>
        )}
      </Card>

      {/* Column 3: Customer Context & Insights */}
      {!isCRMCollapsed && activeConversationId && (
        <Card className="w-1/4 flex flex-col border-zinc-800/50 bg-zinc-950/40 backdrop-blur-md overflow-hidden animate-in slide-in-from-right duration-300">
          {activeConversation ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Customer Profile summary */}
              <div className="p-4 border-b border-zinc-800/50 flex flex-col items-center text-center bg-zinc-900/10">
                <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-lg font-bold mb-2">
                  {activeConversation.customers?.name?.charAt(0) || 'U'}
                </div>
                <h4 className="font-semibold text-white text-xs">{activeConversation.customers?.name || 'Unknown Customer'}</h4>
                <span className="text-[10px] text-zinc-500 mt-0.5">{activeConversation.customers?.phone || 'No phone number'}</span>
                
                <span className="mt-2 px-2 py-0.5 text-[9px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full uppercase">
                  {activeConversation.customers?.segment || 'NEW'}
                </span>
              </div>

              {/* LTV & Order Stats */}
              <div className="grid grid-cols-2 border-b border-zinc-800/50 bg-zinc-900/5 text-center p-2.5 text-[10px]">
                <div className="border-r border-zinc-800/50">
                  <span className="text-zinc-500 uppercase tracking-wider">Total Orders</span>
                  <p className="font-bold text-white mt-0.5">{activeConversation.customers?.total_orders || 0}</p>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider">Total Spent</span>
                  <p className="font-bold text-emerald-400 mt-0.5">฿{(activeConversation.customers?.total_spent || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Tagging System Section */}
              <div className="p-3.5 border-b border-zinc-800/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Active Tags</h5>
                  <button 
                    onClick={() => setShowAddTagDropdown(!showAddTagDropdown)}
                    className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-0.5 font-semibold"
                  >
                    <Plus className="h-3 w-3" /> Add Tag
                  </button>
                </div>

                {showAddTagDropdown && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 space-y-1.5 z-20 shadow-xl relative animate-in fade-in duration-200">
                    <div className="text-[9px] text-zinc-500 font-bold">Select Tag to Add:</div>
                    <div className="flex flex-wrap gap-1">
                      {PREDEFINED_TAGS.map(tag => {
                        const isAdded = activeCustomerTags.some(t => t.name === tag.name);
                        return (
                          <button
                            key={tag.id}
                            disabled={isAdded}
                            onClick={async () => {
                              // Ensure tag exists in public.tags first in database helper if needed, 
                              // then add link to customer
                              await addCustomerTag(activeConversation.customer_id, tag.id);
                              setShowAddTagDropdown(false);
                            }}
                            className={`text-[9px] px-2 py-0.5 rounded font-semibold transition-all ${
                              isAdded 
                                ? 'bg-zinc-850 text-zinc-600 cursor-not-allowed' 
                                : 'bg-blue-900/30 border border-blue-800/40 text-blue-300 hover:bg-blue-800/40'
                            }`}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {activeCustomerTags.length === 0 ? (
                    <span className="text-[10px] text-zinc-500 italic">No tags attached</span>
                  ) : (
                    activeCustomerTags.map((tag: any) => (
                      <span 
                        key={tag.id} 
                        className="inline-flex items-center gap-1 text-[9px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200 px-2 py-0.5 rounded-md hover:border-rose-500/30 hover:text-rose-400 transition-colors group"
                      >
                        {tag.name}
                        <X 
                          className="h-2 w-2 text-zinc-500 hover:text-rose-400 cursor-pointer" 
                          onClick={() => removeCustomerTag(activeConversation.customer_id, tag.id)}
                        />
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Order History list */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
                <h5 className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Order History</h5>
                {customerOrders.length === 0 ? (
                  <div className="text-zinc-500 text-[10px] italic p-4 text-center">No orders found</div>
                ) : (
                  customerOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-zinc-900/30 border border-zinc-900 p-2.5 rounded-lg flex flex-col gap-1 transition-all hover:bg-zinc-900/60"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-white">#{order.order_number}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          order.status === 'processing' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span>฿{order.total_amount}</span>
                        <span className="text-[9px] text-zinc-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Quick Order Trigger */}
              <div className="p-3 bg-zinc-900/20 border-t border-zinc-800/50 flex flex-col gap-2">
                <button 
                  onClick={() => setShowCreateOrderModal(true)}
                  className="w-full text-center text-xs py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md active:scale-95"
                >
                  Create Quick Order
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <p className="text-xs">No active conversation</p>
            </div>
          )}
        </Card>
      )}

      {/* Quick Order Modal */}
      {showCreateOrderModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 w-80 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5 mb-4 border-b border-zinc-800 pb-2">
              <ShoppingBag className="h-4 w-4 text-blue-400" />
              Create Quick Order
            </h4>
            <div className="space-y-3.5 text-left">
              <div>
                <label className="text-[10px] text-zinc-400 block font-bold mb-1">Product Description</label>
                <Input 
                  value={newOrderProduct}
                  onChange={(e) => setNewOrderProduct(e.target.value)}
                  placeholder="e.g. Premium Silk Scarf"
                  className="bg-zinc-900 border-zinc-800 text-xs w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 block font-bold mb-1">Unit Price (฿)</label>
                  <Input 
                    value={newOrderPrice}
                    onChange={(e) => setNewOrderPrice(e.target.value)}
                    type="number"
                    className="bg-zinc-900 border-zinc-800 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block font-bold mb-1">Quantity</label>
                  <Input 
                    value={newOrderQuantity}
                    onChange={(e) => setNewOrderQuantity(e.target.value)}
                    type="number"
                    className="bg-zinc-900 border-zinc-800 text-xs w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2.5 mt-5">
              <button 
                onClick={() => setShowCreateOrderModal(false)}
                className="flex-1 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 text-xs font-semibold hover:bg-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateMockOrder}
                className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

