import { createContext, useContext, useState, ReactNode } from "react";
import type { Post } from "@/components/forum/PostCard";

type PostsContextType = {
  posts: Post[];
  createPost: (post: Post) => void;
  updatePost: (postId: string, changes: Partial<Post>) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: "1",
    title: "Water Supply Maintenance - Scheduled Downtime",
    content:
      "Dear residents, we will be conducting essential water supply maintenance in sectors 12-15 from 6 AM to 2 PM tomorrow. Please store adequate water for the day. We apologize for the inconvenience.",
    author: {
      name: "Municipal Corporation",
      avatar: "",
      verified: true,
    },
    category: "announcement",
    tags: ["WaterSupply", "Maintenance"],
    mentions: [],
    timestamp: "2 hours ago",
    isPinned: true,
    likes: 45,
    dislikes: 3,
    comments: 12,
    city: "mumbai",
    status: "open",
    confirmations: 0,
    solvedVotes: 0,
    notSolvedVotes: 0,
  },
  {
    id: "2",
    title: "Severe pothole on MG Road causing accidents",
    content:
      "There's a dangerous pothole near the bus stop on MG Road that has caused several bike accidents this week. The pothole is about 2 feet wide and very deep. Immediate attention needed!",
    author: {
      name: "Rajesh Kumar",
      avatar: "",
      verified: false,
    },
    category: "complaint",
    tags: ["Roads", "Safety", "PotholeIssue"],
    mentions: ["MunicipalCorp"],
    location: "MG Road, near Central Bus Stop",
    media: [{ type: "image", url: "/pothole.jpg" }],
    timestamp: "4 hours ago",
    likes: 28,
    dislikes: 1,
    comments: 8,
    city: "mumbai",
    status: "open",
    confirmations: 3,
    solvedVotes: 0,
    notSolvedVotes: 0,
  },
  {
    id: "3",
    title: "Community Cleanup Drive - This Weekend",
    content:
      "Let's come together to clean our neighborhood park! Bringing gloves, bags, and refreshments. Family-friendly event. Let's make our city cleaner and greener!",
    author: {
      name: "Green Warriors Group",
      avatar: "",
      verified: true,
    },
    category: "discussion",
    tags: ["Community", "Environment", "CleanupDrive"],
    mentions: ["EcoFriends", "CityCouncil"],
    location: "Central Park, Sector 8",
    timestamp: "6 hours ago",
    likes: 67,
    dislikes: 0,
    comments: 15,
    city: "mumbai",
    status: "open",
    confirmations: 0,
    solvedVotes: 0,
    notSolvedVotes: 0,
  },
  {
    id: "4",
    title: "Street lights not working in residential area",
    content:
      "Multiple street lights have been out for over a week in Residential Complex B. This is creating safety concerns for residents, especially women and elderly people walking at night.",
    author: {
      name: "Priya Sharma",
      avatar: "",
      verified: false,
    },
    category: "complaint",
    tags: ["StreetLights", "Safety", "Electricity"],
    mentions: ["ElectricityBoard"],
    location: "Residential Complex B, Phase 2",
    timestamp: "1 day ago",
    likes: 34,
    dislikes: 0,
    comments: 11,
    city: "mumbai",
    status: "open",
    confirmations: 0,
    solvedVotes: 0,
    notSolvedVotes: 0,
  },
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const createPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const updatePost = (postId: string, changes: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...changes } : post)),
    );
  };

  return (
    <PostsContext.Provider value={{ posts, createPost, updatePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return ctx;
}


