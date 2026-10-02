import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  area: string;
  tag: string;
  time: string;
};

const sampleNews: Record<string, NewsItem[]> = {
  mumbai: [
    {
      id: "m1",
      title: "Water supply maintenance scheduled for Ward 21",
      summary:
        "Municipal Corporation has announced a 6-hour water cut in parts of Wagholi and nearby areas for pipeline repairs.",
      area: "Wagholi",
      tag: "Water",
      time: "2h ago",
    },
    {
      id: "m2",
      title: "New bus route connecting Wagholi to city center",
      summary:
        "A new AC bus route will operate during peak hours to reduce congestion on existing lines.",
      area: "Wagholi",
      tag: "Transport",
      time: "5h ago",
    },
  ],
  delhi: [
    {
      id: "d1",
      title: "Fog affects early morning metro services",
      summary:
        "Dense fog has led to delays on several metro lines; commuters advised to plan extra time.",
      area: "Central Delhi",
      tag: "Transport",
      time: "1h ago",
    },
  ],
};

const LocalNews = () => {
  const { user } = useAuth();
  const [city, setCity] = useState<string>("mumbai");

  const items = useMemo(() => sampleNews[city] ?? [], [city]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Local civic news</h1>
            <p className="text-sm text-muted-foreground">
              Area-specific governance updates, planned works, and alerts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">City</span>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {user?.area && (
          <p className="text-xs text-muted-foreground">
            Showing sample news for your city. In production, this would be fetched from a real API based on your ward/area (&quot;{user.area}&quot;).
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No news items available for this city in the demo.
            </p>
          )}
          {items.map((n) => (
            <Card key={n.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span>{n.title}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {n.tag}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">{n.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Area: {n.area}</span>
                  <span>{n.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground">
          This page currently uses mocked data. To show real local news, connect this
          view to a backend that proxies trusted civic news APIs.
        </p>
      </main>
    </div>
  );
};

export default LocalNews;


