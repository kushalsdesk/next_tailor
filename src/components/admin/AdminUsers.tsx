"use client";

import { useState } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Clock, Filter, AlertTriangle, Ban, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  _id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  lastSeen: string;
  createdAt: string;
  isAdmitted?: boolean;
  isBlocked?: boolean;
}

export default function AdminUsers() {
  const { data, error, isLoading, mutate } = useSWR<{ users: User[] }>("/api/users", fetcher);
  const [filter, setFilter] = useState<"all" | "admitted" | "recent" | "old" | "blocked">("all");
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data?.users) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Users</h2>
        <p>Could not fetch users from the database.</p>
      </div>
    );
  }

  let displayedUsers = [...data.users];

  if (filter === "admitted") {
    displayedUsers = displayedUsers.filter(u => u.isAdmitted && !u.isBlocked);
  } else if (filter === "blocked") {
    displayedUsers = displayedUsers.filter(u => u.isBlocked);
  } else if (filter === "old") {
    displayedUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    // "all" or "recent"
    displayedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const handleBlockAction = async (user: User, action: "block" | "unblock") => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/users/${user.uid}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      
      if (res.ok) {
        toast.success(`User ${action === 'block' ? 'blocked and conversations deleted' : 'unblocked'} successfully.`);
        mutate();
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setIsProcessing(false);
      setBlockingUser(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col relative">
      
      {/* Block Confirmation Modal */}
      {blockingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border shadow-2xl rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="font-bold text-xl">Block User?</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              You are about to block <strong className="text-foreground">{blockingUser.displayName || blockingUser.email}</strong>. 
              This will <strong>permanently delete</strong> their entire chat history (all messages) to save storage, and restrict them from accessing the platform. 
              Are you absolutely sure you want to proceed?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setBlockingUser(null)} disabled={isProcessing}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleBlockAction(blockingUser, "block")} disabled={isProcessing}>
                {isProcessing ? "Blocking..." : "Yes, Block & Wipe Chat"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Review all active users registered on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "admitted" | "recent" | "old" | "blocked")}
              className="appearance-none bg-background border border-border text-sm font-medium rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            >
              <option value="all">All Users</option>
              <option value="recent">Latest Users</option>
              <option value="old">Oldest Users</option>
              <option value="admitted">Admitted Only</option>
              <option value="blocked">Blocked Users</option>
            </select>
          </div>
          <div className="bg-secondary/50 text-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shrink-0">
            <Users className="w-4 h-4" />
            Total: {displayedUsers.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No users found matching the filter.
                </TableCell>
              </TableRow>
            ) : (
              displayedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border">
                          <Image src={user.photoURL} alt={user.displayName || "User"} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 text-primary font-bold flex items-center justify-center rounded-full">
                          {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="font-medium text-sm">{user.displayName || "Unknown"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : user.isAdmitted ? (
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Admitted</Badge>
                    ) : (
                      <Badge variant="secondary">Registered</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" /> 
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.isBlocked ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleBlockAction(user, "unblock")}
                        disabled={isProcessing}
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Unblock
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setBlockingUser(user)}
                        disabled={isProcessing}
                        className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Ban className="w-4 h-4 mr-2" /> Block
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
