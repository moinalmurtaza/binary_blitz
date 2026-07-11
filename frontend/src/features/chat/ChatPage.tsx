import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Send, Hash, Users, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface Message {
  senderName: string;
  message: string;
  createdAt: string;
}

const CHANNELS = [
  { id: 'general', name: 'general', desc: 'NWU Comptron general discussion' },
  { id: 'contests', name: 'contest-chat', desc: 'Live contest discussion & clarifications' },
  { id: 'algorithms', name: 'algorithms-study', desc: 'Discuss DP, Graphs, and Math templates' },
  { id: 'random', name: 'random', desc: 'Casual off-topic chats' },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    general: [
      { senderName: 'Dr. John Doe', message: 'Welcome to the NWU PS Chat! Use channels on the left to discuss algorithms.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    ],
    contests: [],
    algorithms: [],
    random: [],
  });
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Chat Web Socket');
      newSocket.emit('join_room', activeRoom);
    });

    newSocket.on('receive_message', (data: Message & { roomId: string }) => {
      const room = data.roomId || activeRoom;
      setMessages((prev) => ({
        ...prev,
        [room]: [...(prev[room] || []), data],
      }));
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Room switching logic
  useEffect(() => {
    if (socket) {
      // Leave old room, join new room
      socket.emit('leave_room', activeRoom);
      socket.emit('join_room', activeRoom);
    }
  }, [activeRoom, socket]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages[activeRoom]]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !user) return;

    const messageData = {
      roomId: activeRoom,
      senderName: user.name,
      message: inputValue,
    };

    socket.emit('send_message', messageData);

    // Optimistically update local message log
    setMessages((prev) => ({
      ...prev,
      [activeRoom]: [
        ...(prev[activeRoom] || []),
        { senderName: user.name, message: inputValue, createdAt: new Date().toISOString() },
      ],
    }));

    setInputValue('');
  };

  const activeChannelDesc = CHANNELS.find(c => c.id === activeRoom)?.desc || '';

  return (
    <div className="glass rounded-2xl border border-border h-[calc(100vh-10rem)] flex overflow-hidden">
      {/* Sidebar - Channels */}
      <div className="w-64 border-r border-border bg-zinc-900/10 flex flex-col hidden sm:flex">
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <MessageSquare size={13} /> Chat Channels
          </h3>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {CHANNELS.map((chan) => (
            <button
              key={chan.id}
              onClick={() => setActiveRoom(chan.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeRoom === chan.id
                  ? 'bg-[rgba(164,16,52,0.10)] text-[#A41034] border border-[#A41034]/20'
                  : 'text-zinc-400 hover:bg-[#26292D]/60 hover:text-zinc-200'
              }`}
            >
              <Hash size={14} />
              {chan.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950/10 justify-between">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-zinc-900/10">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-[#A41034]" />
            <div>
              <h2 className="text-sm font-bold text-zinc-200 capitalize">{activeRoom}</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">{activeChannelDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Users size={12} /> Active</span>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(164,16,52,0.08)] border border-[#A41034]/10">
            <Info size={16} className="text-[#A41034] shrink-0 mt-0.5" />
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="font-semibold text-zinc-300">Welcome to NWU CP Community Chat!</span> Discuss algorithm patterns, share contest links, or ask help on editorials. Keep discussions productive and respectful.
            </div>
          </div>

          {(messages[activeRoom] || []).map((msg, i) => {
            const isMe = user && msg.senderName === user.name;
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-500">{msg.senderName}</span>
                  <span className="text-[8px] text-zinc-600">{time}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-md ${
                  isMe 
                    ? 'bg-[#7A0C24] text-white rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-border'
                }`}>
                  {msg.message}
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-zinc-900/15 flex gap-2">
          <input
            id="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${activeRoom}`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#33363B]/60 border border-border text-zinc-200 placeholder-zinc-600 text-xs focus:outline-none focus:ring-2 focus:ring-[#A41034]/30 transition-all"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#7A0C24] text-white hover:bg-[#C4122F] transition-colors shadow-lg shadow-[rgba(164,16,52,0.10)] flex items-center justify-center shrink-0"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
