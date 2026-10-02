import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const GovernmentDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints/all`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_URL}/complaints/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const openCount = complaints.filter((c) => c.status === "pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "in_progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">CivicForum – Government Desk</h1>
              <p className="text-xs text-muted-foreground">
                View and resolve citizen complaints across the city.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Pending Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{openCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inProgressCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resolvedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Total Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{complaints.length}</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Complaints Queue</h2>
            <span className="text-xs text-muted-foreground">
              Update status as you work on each issue.
            </span>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {complaints.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No complaints found.
              </p>
            )}
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="border border-border/70">
                <CardContent className="py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{complaint.title}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        📍 {complaint.pincode || "N/A"}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {complaint.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">
                      {complaint.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      🕐 {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[180px]">
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => updateStatus(complaint.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[180px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs"
                        onClick={() => updateStatus(complaint.id, "in_progress")}
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateStatus(complaint.id, "resolved")}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GovernmentDashboard;


