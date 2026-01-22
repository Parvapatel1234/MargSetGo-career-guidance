"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChatWindowProps {
    otherUser: {
        _id: string;
        name: string;
        role?: string;
    };
    onClose: () => void;
}

interface Message {
    _id?: string;
    sender: { _id: string } | string;
    content: string;
    createdAt: string;
}

export default function ChatWindow({ otherUser, onClose }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        // Set up polling for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [otherUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${otherUser._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ recipientId: otherUser._id, content: newMessage }),
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(); // Refresh immediately
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const getSenderId = (sender: { _id: string } | string): string => {
        if (typeof sender === 'string') return sender;
        return sender._id;
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden h-[500px]">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center font-bold text-sm">
                        {otherUser.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{otherUser.name}</h3>
                        <p className="text-xs text-blue-100 italic">{otherUser.role}</p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-10">Say hi to start the conversation!</p>
                ) : (
                    messages.map((msg, index) => {
                        const senderId = getSenderId(msg.sender);
                        const isMe = senderId === user?._id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}>
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
