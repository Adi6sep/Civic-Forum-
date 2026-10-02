
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Pin,
  MapPin,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  category: "announcement" | "complaint" | "discussion";
  tags: string[];
  mentions: string[];
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  media?: {
    type: "image" | "video";
    url: string;
  }[];
  timestamp: string;
  status?: "open" | "in_progress" | "resolved";
  confirmations?: number;
  solvedVotes?: number;
  notSolvedVotes?: number;
  isPinned?: boolean;
  likes: number;
  dislikes: number;
  comments: number;
  city: string;
  commentsList?: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onComment: (postId: string) => void;
  onReport: (postId: string) => void;
  onConfirmIssue?: (postId: string) => void;
  onSolvedFeedback?: (postId: string) => void;
  onNotSolvedFeedback?: (postId: string) => void;
  onAddComment?: (postId: string, text: string) => void;
}

export function PostCard({
  post,
  onLike,
  onDislike,
  onComment,
  onReport,
  onConfirmIssue,
  onSolvedFeedback,
  onNotSolvedFeedback,
  onAddComment,
}: PostCardProps) {
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const getCategoryColor = (category: Post["category"]) => {
    switch (category) {
      case "announcement":
        return "bg-announcement text-announcement-foreground";
      case "complaint":
        return "bg-complaint text-complaint-foreground";
      case "discussion":
        return "bg-discussion text-discussion-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: Post["category"]) => {
    switch (category) {
      case "announcement":
        return "📢";
      case "complaint":
        return "⚠️";
      case "discussion":
        return "💬";
      default:
        return "📝";
    }
  };

  const handleLike = () => {
    if (userDisliked) setUserDisliked(false);
    setUserLiked(!userLiked);
    onLike(post.id);
  };

  const handleDislike = () => {
    if (userLiked) setUserLiked(false);
    setUserDisliked(!userDisliked);
    onDislike(post.id);
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      post.isPinned && "ring-2 ring-primary/20 bg-primary/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{post.author.name}</span>
                {post.author.verified && <Badge variant="secondary" className="text-xs px-1.5 py-0.5">✓</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.timestamp}
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
            <Badge className={getCategoryColor(post.category)}>
              {getCategoryIcon(post.category)} {post.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
          {post.media && post.media.length > 0 && post.category === "complaint" && (
            <Badge variant="outline" className="text-[10px]">
              Photo verified
            </Badge>
          )}
        </div>
        {post.status && (
          <p className="text-xs mb-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 border text-[10px] uppercase tracking-wide",
                post.status === "open" && "bg-red-50 text-red-700 border-red-200",
                post.status === "in_progress" &&
                  "bg-amber-50 text-amber-700 border-amber-200",
                post.status === "resolved" &&
                  "bg-emerald-50 text-emerald-700 border-emerald-200",
              )}
            >
              {post.status === "open" && "Open"}
              {post.status === "in_progress" && "In progress"}
              {post.status === "resolved" && "Resolved"}
            </span>
          </p>
        )}
        <p className="text-muted-foreground mb-3 leading-relaxed">{post.content}</p>
        
        {post.media && post.media.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {post.media.map((media, index) =>
              media.type === "image" ? (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={media.url}
                    alt=""
                    className="h-24 w-32 object-cover"
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden bg-muted p-4 flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {media.type}
                  </span>
                </div>
              ),
            )}
          </div>
        )}

        {post.coordinates && (
          <p className="text-[11px] text-muted-foreground mb-1">
            Geotagged at ({post.coordinates.lat.toFixed(4)},{" "}
            {post.coordinates.lng.toFixed(4)})
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {post.mentions.map((mention) => (
            <Badge key={mention} variant="secondary" className="text-xs">
              @{mention}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "gap-2 text-muted-foreground hover:text-primary",
                  userLiked && "text-primary bg-primary/10",
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                {post.likes + (userLiked ? 1 : 0)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDislike}
                className={cn(
                  "gap-2 text-muted-foreground hover:text-destructive",
                  userDisliked && "text-destructive bg-destructive/10",
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                {post.dislikes + (userDisliked ? 1 : 0)}
              </Button>
              {post.category === "complaint" && onConfirmIssue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfirmIssue(post.id)}
                  className="gap-2 text-muted-foreground hover:text-primary"
                >
                  Confirm issue
                  <span className="text-xs">
                    {post.confirmations ?? 0}
                  </span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowComments((prev) => !prev);
                  onComment(post.id);
                }}
                className="gap-2 text-muted-foreground hover:text-secondary"
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {post.category === "complaint" &&
                post.status === "resolved" &&
                (onSolvedFeedback || onNotSolvedFeedback) && (
                  <>
                    {onSolvedFeedback && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSolvedFeedback(post.id)}
                        className="gap-1 text-emerald-700 hover:text-emerald-800"
                      >
                        👍
                        <span className="text-xs">
                          {post.solvedVotes ?? 0}
                        </span>
                      </Button>
                    )}
                    {onNotSolvedFeedback && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNotSolvedFeedback(post.id)}
                        className="gap-1 text-red-700 hover:text-red-800"
                      >
                        👎
                        <span className="text-xs">
                          {post.notSolvedVotes ?? 0}
                        </span>
                      </Button>
                    )}
                  </>
                )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReport(post.id)}
                className="gap-2 text-muted-foreground hover:text-warning"
              >
                <Flag className="h-4 w-4" />
                Report
              </Button>
            </div>
          </div>

          {showComments && (
            <div className="border-t pt-3 space-y-2">
              <div className="max-h-40 overflow-y-auto space-y-1">
                {(post.commentsList ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No comments yet. Be the first to respond.
                  </p>
                )}
                {(post.commentsList ?? []).map((c) => (
                  <div key={c.id} className="text-xs">
                    <span className="font-medium">{c.author}</span>{" "}
                    <span className="text-muted-foreground">· {c.timestamp}</span>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
              {onAddComment && (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = newComment.trim();
                    if (!value) return;
                    onAddComment(post.id, value);
                    setNewComment("");
                  }}
                >
                  <input
                    className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button size="sm" type="submit">
                    Send
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
