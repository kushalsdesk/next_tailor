"use client";

import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Clock } from "lucide-react";

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
}

export default function AdminUsers() {
  const { data, error, isLoading } = useSWR<{ users: User[] }>("/api/users", fetcher);

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

  const users = data.users;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Registered Users</h2>
          <p className="text-sm text-muted-foreground mt-1">Review all active users registered on the platform.</p>
        </div>
        <div className="bg-secondary/50 text-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          Total: {users.length}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border border-border" />
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
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" /> 
                      {user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : "Never"}
                    </div>
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
