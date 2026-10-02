import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import Polls from "./pages/Polls";
import OfficialChannels from "./pages/OfficialChannels";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import LocalNews from "./pages/LocalNews";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { PostsProvider } from "./context/PostsContext";
import { CivicBot } from "./components/chat/CivicBot";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PostsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={(
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                )}
              />
              <Route
                path="/government"
                element={(
                  <RequireAuth>
                    <GovernmentDashboard />
                  </RequireAuth>
                )}
              />
              <Route
                path="/polls"
                element={(
                  <RequireAuth>
                    <Polls />
                  </RequireAuth>
                )}
              />
              <Route
                path="/official-channels"
                element={(
                  <RequireAuth>
                    <OfficialChannels />
                  </RequireAuth>
                )}
              />
              <Route
                path="/resources"
                element={(
                  <RequireAuth>
                    <Resources />
                  </RequireAuth>
                )}
              />
              <Route
                path="/profile"
                element={(
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                )}
              />
              <Route
                path="/leaderboard"
                element={(
                  <RequireAuth>
                    <Leaderboard />
                  </RequireAuth>
                )}
              />
              <Route
                path="/local-news"
                element={(
                  <RequireAuth>
                    <LocalNews />
                  </RequireAuth>
                )}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CivicBot />
          </BrowserRouter>
        </TooltipProvider>
      </PostsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
