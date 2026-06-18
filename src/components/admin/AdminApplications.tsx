"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, GraduationCap, Briefcase } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course?: string;
  path?: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  // Inquiry specific
  subscribe?: boolean;
  getTips?: boolean;
  sellCreation?: boolean;
  loanFacility?: boolean;
}

export default function AdminApplications() {
  const [activeTab, setActiveTab] = useState<"admissions" | "inquiries">("admissions");
  
  const { data: admissionsData, error: admissionsError, isLoading: admissionsLoading, mutate: mutateAdmissions } = useSWR<{ applications: Application[] }>("/api/admissions", fetcher);
  const { data: inquiriesData, error: inquiriesError, isLoading: inquiriesLoading, mutate: mutateInquiries } = useSWR<{ applications: Application[] }>("/api/inquiries", fetcher);
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const endpoint = activeTab === "admissions" ? `/api/admissions/${id}` : `/api/inquiries/${id}`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update status");
      
      toast.success("Status updated successfully!");
      if (activeTab === "admissions") mutateAdmissions();
      else mutateInquiries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  const isLoading = activeTab === "admissions" ? admissionsLoading : inquiriesLoading;
  const error = activeTab === "admissions" ? admissionsError : inquiriesError;
  const data = activeTab === "admissions" ? admissionsData?.applications : inquiriesData?.applications;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Application Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and manage all user applications.</p>
        </div>
        
        {/* Custom Tabs */}
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50 self-start">
          <button
            onClick={() => setActiveTab("admissions")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "admissions" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Admissions
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "inquiries" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Career Inquiries
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error || !data ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Could not fetch data.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>{activeTab === "admissions" ? "Course" : "Career Path"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No {activeTab} found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{app.email}</div>
                      <div className="text-xs text-muted-foreground">{app.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex flex-col gap-1">
                        <span className="font-semibold">
                          {activeTab === "admissions" ? app.course : app.path}
                        </span>
                        {activeTab === "inquiries" && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.subscribe && <Badge variant="outline" className="text-[10px] h-4 px-1">Sub</Badge>}
                            {app.getTips && <Badge variant="outline" className="text-[10px] h-4 px-1">Tips</Badge>}
                            {app.sellCreation && <Badge variant="outline" className="text-[10px] h-4 px-1">Sell</Badge>}
                            {app.loanFacility && <Badge variant="outline" className="text-[10px] h-4 px-1">Loan</Badge>}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${
                        app.status === "accepted" ? "text-green-500 border-green-500" :
                        app.status === "rejected" ? "text-red-500 border-red-500" :
                        app.status === "reviewed" ? "text-blue-500 border-blue-500" : ""
                      }`}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={updatingId === app._id}
                        value={app.status}
                        onValueChange={(val) => handleStatusChange(app._id, val)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
