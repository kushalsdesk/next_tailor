"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, ShieldCheck, LogOut, LayoutDashboard, MessageSquare, Image as ImageIcon, Users, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminChatbox from "@/components/admin/AdminChatbox";
import AdminApplications from "@/components/admin/AdminApplications";
import AdminUsers from "@/components/admin/AdminUsers";
import { FileText } from "lucide-react";
import useSWR from "swr";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
  const { user, isAuthLoading, signInWithEmail, logout } = useAuthStore();
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "messages" | "applications" | "gallery" | "users">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { data: statsData } = useSWR<{ stats: { pendingApplications: number, unreadQueries: number, totalUsers: number }, graphData: { name: string; users: number; applications: number }[] }>("/api/admin/stats", fetcher);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password is required.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await signInWithEmail("admin@ashaafoundation.com", password);
      toast.success("Welcome back, Admin!");
    } catch (error) {
      toast.error("Invalid credentials.");
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is authenticated but NOT an admin
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You are currently signed in as <strong>{user.email}</strong>, which does not have administrative privileges.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} variant="outline">Return Home</Button>
          <Button onClick={logout} variant="destructive">Sign Out</Button>
        </div>
      </div>
    );
  }

  // If user is NOT authenticated at all, show the login form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Secure access for ASHAA Foundation administrators only.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value="admin@ashaafoundation.com" 
                  disabled 
                  className="bg-secondary/50 border-border text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border text-foreground focus:border-primary focus:ring-primary"
                  autoFocus
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoggingIn || !password}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl mt-4 shadow-md transition-all"
              >
                {isLoggingIn ? "Verifying..." : "Secure Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "messages", label: "User Inquiries", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "applications", label: "Application Management", icon: <FileText className="w-4 h-4" /> },
    { id: "gallery", label: "Manage Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "users", label: "Registered Users", icon: <Users className="w-4 h-4" /> },
  ] as const;

  // If authenticated AND is admin -> Show Dashboard
  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-card border-b border-border p-4 md:p-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 text-primary font-bold font-serif text-xl">
            <button 
              className="md:hidden p-1 mr-1 text-foreground" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <ShieldCheck className="w-6 h-6" />
            <span className="hidden sm:block">Admin Panel</span>
          </div>

          {/* Desktop Topbar Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "messages" | "applications" | "gallery" | "users")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            A
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 flex items-center shrink-0"
          >
            <LogOut className="w-4 h-4 sm:mr-2" /> 
            <span className="hidden sm:block">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <aside className="relative w-64 bg-card border-r border-border h-full flex flex-col shadow-xl animate-in slide-in-from-left-4 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-3 text-primary font-bold font-serif text-xl">
                <ShieldCheck className="w-6 h-6" />
                Admin
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as "overview" | "messages" | "applications" | "gallery" | "users");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          <div className="mb-6 hidden md:block">
            <h1 className="text-2xl font-serif font-bold text-foreground capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          
          {/* Tab Rendering */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-muted-foreground text-sm font-semibold mb-2">Pending Applications</h3>
                  <p className="text-3xl font-bold">{statsData?.stats?.pendingApplications || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-muted-foreground text-sm font-semibold mb-2">Unread Queries</h3>
                  <p className="text-3xl font-bold">{statsData?.stats?.unreadQueries || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-muted-foreground text-sm font-semibold mb-2">Total Users</h3>
                  <p className="text-3xl font-bold">{statsData?.stats?.totalUsers || 0}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Growth Overview (Last 6 Months)</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData?.graphData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#4c1d95" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" opacity={0.2} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e2f', borderColor: '#333333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Area type="monotone" dataKey="users" name="New Users" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      <Area type="monotone" dataKey="applications" name="New Applications" stroke="#4c1d95" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <AdminChatbox />
          )}

          {activeTab === "applications" && (
            <AdminApplications />
          )}

          {activeTab === "gallery" && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-bold text-foreground mb-2">Manage Gallery</h2>
              <p>Firestore Storage integration pending for image uploads.</p>
            </div>
          )}

          {activeTab === "users" && (
            <AdminUsers />
          )}

        </div>
      </main>
    </div>
  );
}
