import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [pollTitle, setPollTitle] = useState("");
  const [pollDesc, setPollDesc] = useState("");
  const [pollTag, setPollTag] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const adminUser = localStorage.getItem("admin_user");
  
  useEffect(() => {
    if (!adminUser) {
      navigate("/admin/login");
      return;
    }
    fetchPolls();
    fetchComplaints();
  }, []);

  const fetchPolls = async () => {
    const res = await fetch(`${API_URL}/polls/all`);
    const data = await res.json();
    setPolls(data);
  };

  const fetchComplaints = async () => {
    const res = await fetch(`${API_URL}/complaints/all`);
    const data = await res.json();
    setComplaints(data);
  };

  const handleCreatePoll = async () => {
    if (!pollTitle || options.filter(o => o.trim()).length < 2) {
      toast({
        title: "Error",
        description: "Title aur kam se kam 2 options chahiye!",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/polls/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pollTitle,
          description: pollDesc,
          tag: pollTag,
          options: options.filter(o => o.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Poll created!", description: "Naya poll ban gaya!" });
      setPollTitle("");
      setPollDesc("");
      setPollTag("");
      setOptions(["", ""]);
      fetchPolls();
    } catch (err) {
      toast({ title: "Error", description: "Poll create nahi hua!", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-8">

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{polls.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{complaints.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {complaints.filter(c => c.status === "pending").length}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Create Poll */}
        <section>
          <h2 className="text-base font-semibold mb-3">Create New Poll</h2>
          <Separator className="mb-4" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Poll Title *</Label>
                  <Input
                    value={pollTitle}
                    onChange={(e) => setPollTitle(e.target.value)}
                    placeholder="e.g. Road repair priority"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Input
                    value={pollTag}
                    onChange={(e) => setPollTag(e.target.value)}
                    placeholder="e.g. Roads, Water, Waste"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={pollDesc}
                  onChange={(e) => setPollDesc(e.target.value)}
                  placeholder="Poll ka description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Options *</Label>
                {options.map((opt, index) => (
                  <Input
                    key={index}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOptions([...options, ""])}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <Button
                onClick={handleCreatePoll}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Create Poll
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Existing Polls */}
        <section>
          <h2 className="text-base font-semibold mb-3">Existing Polls</h2>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {polls.map((poll) => (
              <Card key={poll.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{poll.title}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">#{poll.tag}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {poll.options?.length} options
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;