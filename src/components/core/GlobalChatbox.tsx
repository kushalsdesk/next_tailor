"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import useSWR from "swr";
import { MessageCircle, X, Send, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type MessageType = {
  _id: string;
  sender: string;
  text: string;
  createdAt: string;
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

export default function GlobalChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, signInWithGoogle } = useAuthStore();

  // Fetch Conversation
  useEffect(() => {
    if (user && isAuthenticated && isOpen) {
      fetch(`/api/conversations?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data && data._id) setConversationId(data._id);
        })
        .catch(err => console.error("Failed to init conversation", err));
    } else {
      // Don't clear on just close, but clear if logged out
      if (!isAuthenticated) setConversationId(null);
    }
  }, [user, isAuthenticated, isOpen]);

  // Cooldown Timer & Persistence
  useEffect(() => {
    const savedTime = localStorage.getItem("chatCooldownTime");
    if (savedTime) {
      const diff = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      if (diff < 30) {
        setCooldown(30 - diff);
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Poll messages every 30 seconds ONLY if authenticated AND open
  const { data: messages = [], mutate } = useSWR(
    (user && isAuthenticated && conversationId && isOpen) ? `/api/messages?conversationId=${conversationId}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll on new messages or open
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!message.trim() || !user || cooldown > 0) return;
    setIsSending(true);

    try {
      let activeConvoId = conversationId;
      if (!activeConvoId) {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid
          })
        });
        const data = await res.json();
        activeConvoId = data._id;
        setConversationId(activeConvoId);
      }

      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvoId,
          sender: "user",
          text: message
        })
      });
      setMessage("");
      mutate();
      setCooldown(30); // Start 30s cooldown
      localStorage.setItem("chatCooldownTime", Date.now().toString());

    } catch (error) {
      console.error("Failed to send", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[380px] sm:h-[600px] bg-card sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-border animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                <Image src="/asha_logo.jpg" alt="Ashaa" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="font-bold font-serif text-lg leading-tight">Ashaa Helpdesk</h3>
                <p className="text-xs text-primary-foreground/80 font-medium">
                  {messages.length > 0 
                    ? `Last updated: ${new Date(messages[messages.length - 1].createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                    : "Typically replies in minutes"}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 bg-secondary/10 flex flex-col overflow-hidden">
            {!isAuthenticated ? (
              // Login State
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-foreground mb-2 text-lg">Sign in to Chat</h4>
                <p className="text-muted-foreground text-sm mb-6">
                  Please sign in with your Google account to speak with our counselors.
                </p>
                <Button 
                  onClick={() => signInWithGoogle()} 
                  className="w-full bg-white text-black hover:bg-gray-50 border border-gray-200 shadow-sm rounded-xl py-6"
                >
                  <GoogleIcon />
                  <span className="ml-2 font-medium">Sign in with Google</span>
                </Button>
              </div>
            ) : (
              // Chat State
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center mt-10">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm overflow-hidden border border-border">
                        {user?.photoURL ? (
                          <Image src={user.photoURL} alt="User" width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          <Image src="/asha_logo.jpg" alt="Ashaa" width={64} height={64} className="object-cover w-full h-full opacity-50" />
                        )}
                      </div>
                      <p className="font-bold text-foreground mb-1">Send a message to start chatting.</p>
                      <p className="text-muted-foreground text-xs px-4">Note: A 30s timer is applied between messages to prevent spams.</p>
                    </div>
                  )}

                  {messages.map((msg: MessageType) => (
                    <div key={msg._id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end ml-auto justify-end' : ''}`}>
                      <div className={`${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' : 'bg-white border border-border rounded-2xl rounded-tl-sm'} p-3 shadow-sm`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input box */}
                <div className="p-3 bg-card border-t border-border flex items-end gap-2 shrink-0">
                  <Textarea 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    className="min-h-[50px] max-h-[120px] resize-none bg-secondary/30 border-transparent focus-visible:ring-primary rounded-xl text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="relative shrink-0">
                    <Button 
                      onClick={handleSend}
                      disabled={isSending || (!message.trim() && cooldown === 0) || cooldown > 0}
                      className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-colors"
                    >
                      {cooldown > 0 ? (
                        <span className="font-bold text-sm text-white">{cooldown}s</span>
                      ) : (
                        <Send className="w-5 h-5 -ml-0.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
