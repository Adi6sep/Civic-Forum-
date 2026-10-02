import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  tag: string;
  options: PollOption[];
};

const initialPolls: Poll[] = [
  {
    id: "poll-1",
    title: "Priority for road repairs in your ward",
    description:
      "Help the municipality decide which type of road issues to fix first this quarter.",
    tag: "Roads",
    options: [
      { id: "a", label: "Major potholes on main roads", votes: 24 },
      { id: "b", label: "Internal colony streets", votes: 15 },
      { id: "c", label: "Bus route-specific roads", votes: 9 },
    ],
  },
  {
    id: "poll-2",
    title: "Preferred time for weekly waste collection",
    description:
      "Choose the most convenient time for your area for regular waste collection.",
    tag: "Waste",
    options: [
      { id: "a", label: "6–8 AM", votes: 31 },
      { id: "b", label: "8–10 AM", votes: 18 },
      { id: "c", label: "After 7 PM", votes: 6 },
    ],
  },
];

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [voted, setVoted] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const handleVote = (pollId: string, optionId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to participate in official polls.",
        variant: "destructive",
      });
      return;
    }
    if (!user.addressVerified) {
      toast({
        title: "Address verification required",
        description:
          "Only verified local residents can participate in official civic polling.",
        variant: "destructive",
      });
      return;
    }
    if (voted[pollId]) {
      toast({
        title: "Vote recorded",
        description: "You have already voted in this poll.",
      });
      return;
    }
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt) =>
                opt.id === optionId
                  ? { ...opt, votes: opt.votes + 1 }
                  : opt,
              ),
            }
          : poll,
      ),
    );
    setVoted((prev) => ({ ...prev, [pollId]: optionId }));
    toast({
      title: "Vote submitted",
      description: "Thank you for participating in this decision.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Official Civic Polls
          </h1>
          <p className="text-sm text-muted-foreground">
            These polls help your local government prioritize projects. Only
            verified residents can vote.
          </p>
          {user && !user.addressVerified && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md">
              Your address is not verified yet. Verify from the main dashboard
              to participate in official polls.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, opt) => sum + opt.votes,
              0,
            );
            return (
              <Card key={poll.id} className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">
                      {poll.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      #{poll.tag}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {poll.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  {poll.options.map((option) => {
                    const percentage =
                      totalVotes === 0
                        ? 0
                        : Math.round((option.votes / totalVotes) * 100);
                    const isSelected = voted[poll.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleVote(poll.id, option.id)}
                        className={`w-full text-left border rounded-md px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {percentage}% ({option.votes})
                        </span>
                      </button>
                    );
                  })}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Total votes: {totalVotes}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Polls;


