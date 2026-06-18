"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Send, User as UserIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ConversationType = {
  _id: string;
  userInfo?: { photoURL?: string; displayName?: string; email?: string };
  context?: string;
  lastMessage?: string;
  updatedAt?: string;
  from?: string;
};

type MessageType = {
  _id: string;
  sender: string;
  text: string;
  createdAt: string;
};

export default function AdminChatbox() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch all general conversations
  const { data: conversations = [], mutate: mutateConvos } = useSWR(
    `/api/conversations?type=general`,
    fetcher,
    { refreshInterval: 30000 } // Poll every 30s
  );

  // 2. Fetch messages for selected conversation
  const { data: messages = [], mutate: mutateMessages } = useSWR(
    selectedConversation ? `/api/messages?conversationId=${selectedConversation._id}` : null,
    fetcher,
    { refreshInterval: 30000 } // Poll every 30s
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          sender: "admin",
          text: replyText,
        }),
      });
      setReplyText("");
      mutateMessages(); // instantly update UI
      mutateConvos(); // update last message in sidebar
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[600px]">
      <div className="flex-1 flex bg-card border border-border rounded-2xl overflow-hidden shadow-sm min-h-0">
      
      {/* LEFT SIDEBAR: User List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-border bg-secondary/10 overflow-y-auto flex-col shrink-0`}>
        <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
          <h2 className="font-bold text-foreground">User Inquiries</h2>
        </div>
        
        <div className="flex-1 divide-y divide-border">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No conversations found.</div>
          ) : (
            conversations.map((conv: ConversationType) => (
              <button
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                  selectedConversation?._id === conv._id ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  {conv.userInfo?.photoURL ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <Image src={conv.userInfo.photoURL} alt="User" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm truncate ${conv.from === "user" ? "font-bold text-foreground" : "font-semibold text-muted-foreground"}`}>
                        {conv.userInfo?.displayName || "Unknown User"}
                      </p>
                      {conv.from === "user" && (
                        <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 shrink-0 ml-2">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-primary font-medium truncate mb-1">
                      {conv.context}
                    </p>
                    <p className={`text-xs truncate ${conv.from === "user" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: Chat Area */}
      <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-background relative min-w-0`}>
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a conversation from the left to start chatting.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3 shrink-0">
              {selectedConversation.userInfo?.photoURL && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border">
                  <Image src={selectedConversation.userInfo.photoURL} alt="User" fill className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-foreground truncate">
                  {selectedConversation.userInfo?.displayName || "Unknown User"}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedConversation.userInfo?.email}
                    {(messages.length > 0 || selectedConversation.updatedAt) && 
                      ` • Last updated: ${new Date(
                        messages.length > 0 ? messages[messages.length - 1].createdAt : selectedConversation.updatedAt
                      ).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                    }
                  </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/5">
              {messages.map((msg: MessageType) => (
                <div key={msg._id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'admin' ? 'self-end ml-auto justify-end' : ''}`}>
                  <div className={`${msg.sender === 'admin' ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' : 'bg-card border border-border rounded-2xl rounded-tl-sm'} p-4 shadow-sm`}>
                    <p className={`text-sm ${msg.sender === 'admin' ? '' : 'text-foreground'} whitespace-pre-wrap`}>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Controls */}
            <div className="p-4 bg-card border-t border-border flex gap-3 items-end">
              <Textarea 
                placeholder="Type your reply to the user..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={500}
                className="min-h-[60px] max-h-[150px] resize-none bg-background rounded-xl focus-visible:ring-primary text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              />
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="shrink-0 h-12 w-12 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Send className="w-5 h-5 -ml-0.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
      {/* Mobile Back Button (Outside chatbox container, bottom center) */}
      {selectedConversation && (
        <Button 
          onClick={() => setSelectedConversation(null)}
          className="md:hidden self-center rounded-full bg-primary text-primary-foreground flex items-center shadow-md hover:bg-primary/90 pl-3 pr-4 h-10 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      )}
    </div>
  );
}
