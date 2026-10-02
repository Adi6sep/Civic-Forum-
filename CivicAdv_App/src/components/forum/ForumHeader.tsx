
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MapPin, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ForumHeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onCreatePost: () => void;
}

export function ForumHeader({ selectedCity, onCityChange, onCreatePost }: ForumHeaderProps) {
  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"];
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CivicForum</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="font-medium">
              #{selectedCity}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/leaderboard")}
          >
            Leaderboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/local-news")}
          >
            Local news
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/polls")}
          >
            Polls
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/official-channels")}
          >
            Channels
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/resources")}
          >
            Resources
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/government")}
          >
            Gov dashboard
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button onClick={onCreatePost} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
          {user ? (
            <div className="flex items-center gap-2 border-l pl-3 ml-1">
              <span className="text-sm text-muted-foreground max-w-[120px] truncate">
                {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
