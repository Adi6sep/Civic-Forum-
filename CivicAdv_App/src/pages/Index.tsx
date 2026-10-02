import { useState } from "react";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { PostCard } from "@/components/forum/PostCard";
import { PostCreator } from "@/components/forum/PostCreator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/context/PostsContext";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("mumbai");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  const { posts, createPost, updatePost } = usePosts();

  const filteredPosts = posts
    .filter(post => post.city === selectedCity)
    .filter(post => selectedCategory === "all" || post.category === selectedCategory)
    .filter(post => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleCreatePost = (newPost: any) => {
    createPost(newPost);
    toast({
      title: "Post created successfully!",
      description: "Your post has been published to the community.",
    });
  };

  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    updatePost(postId, { likes: post.likes + 1 });
  };

  const handleDislike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    updatePost(postId, { dislikes: post.dislikes + 1 });
  };

  const handleConfirmIssue = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    updatePost(postId, { confirmations: (post.confirmations ?? 0) + 1 });
  };

  const handleSolvedFeedback = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    updatePost(postId, { solvedVotes: (post.solvedVotes ?? 0) + 1 });
  };

  const handleNotSolvedFeedback = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    updatePost(postId, { notSolvedVotes: (post.notSolvedVotes ?? 0) + 1 });
  };

  const handleComment = (_postId: string) => {
    // kept for compatibility; real commenting handled by handleAddComment
  };

  const handleAddComment = (postId: string, text: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const existing = post.commentsList ?? [];
    const newComment = {
      id: Date.now().toString(),
      author: "Citizen",
      text,
      timestamp: "Just now",
    };
    updatePost(postId, {
      commentsList: [newComment, ...existing],
      comments: post.comments + 1,
    });
  };

  const handleReport = (postId: string) => {
    toast({
      title: "Post reported",
      description: "Thank you for reporting. We'll review this post.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onCreatePost={() => setShowCreatePost(true)}
      />

      <main className="container py-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Posts", icon: "📋" },
                { key: "announcement", label: "Announcements", icon: "📢" },
                { key: "complaint", label: "Complaints", icon: "⚠️" },
                { key: "discussion", label: "Discussions", icon: "💬" }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedCategory === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(filter.key)}
                  className="gap-1"
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end md:gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{filteredPosts.length} posts in #{selectedCity}</span>
            </div>
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search by title, content or tags..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏙️</div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion in #{selectedCity}
              </p>
              <Button onClick={() => setShowCreatePost(true)}>
                Create First Post
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onDislike={handleDislike}
                onComment={handleComment}
                onReport={handleReport}
                onConfirmIssue={handleConfirmIssue}
                onSolvedFeedback={handleSolvedFeedback}
                onNotSolvedFeedback={handleNotSolvedFeedback}
                onAddComment={handleAddComment}
              />
            ))
          )}
        </div>

        {/* Trending Tags */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending in #{selectedCity}
          </h3>
          <div className="flex flex-wrap gap-2">
            {["WaterSupply", "Roads", "Safety", "Environment", "Community", "StreetLights"].map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </main>

      <PostCreator
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default Index;