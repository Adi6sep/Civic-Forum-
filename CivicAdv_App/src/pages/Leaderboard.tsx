import { usePosts } from "@/context/PostsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Leader = {
  name: string;
  points: number;
  complaints: number;
  announcements: number;
  discussions: number;
};

function getLevel(points: number) {
  if (points >= 80) return "Leader";
  if (points >= 40) return "Helper";
  return "Beginner";
}

const Leaderboard = () => {
  const { posts } = usePosts();

  const byAuthor = new Map<string, Leader>();

  for (const post of posts) {
    const current = byAuthor.get(post.author.name) ?? {
      name: post.author.name,
      points: 0,
      complaints: 0,
      announcements: 0,
      discussions: 0,
    };
    let extra = 0;
    if (post.category === "complaint") {
      current.complaints += 1;
      extra += 10;
    } else if (post.category === "announcement") {
      current.announcements += 1;
      extra += 6;
    } else if (post.category === "discussion") {
      current.discussions += 1;
      extra += 4;
    }
    extra += post.likes * 1;
    extra += (post.confirmations ?? 0) * 2;
    if (post.status === "resolved") extra += 5;
    current.points += extra;
    byAuthor.set(post.author.name, current);
  }

  const leaders = Array.from(byAuthor.values())
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Citizen Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top contributors this week based on complaints, posts, likes and confirmations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top contributors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaders.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No activity yet. Start posting to appear on the leaderboard.
              </p>
            )}
            {leaders.map((leader, index) => (
              <div
                key={leader.name}
                className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-muted-foreground">#{index + 1}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{leader.name}</span>
                    <div className="flex gap-2 text-[11px] text-muted-foreground">
                      <span>C: {leader.complaints}</span>
                      <span>A: {leader.announcements}</span>
                      <span>D: {leader.discussions}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{leader.points} pts</span>
                  <Badge variant="outline" className="text-[10px]">
                    {getLevel(leader.points)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;


