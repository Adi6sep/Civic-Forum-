import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, verifyAddress, verifyAadhaar } = useAuth();
  const { toast } = useToast();
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleAadhaarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyAadhaar(aadhaarLast4, otp);
      toast({
        title: "Aadhaar verification successful",
        description: "Your identity is now verified for high-trust features.",
      });
    } catch {
      toast({
        title: "Verification failed",
        description: "Please check last 4 digits and OTP (hint: 123456 in demo).",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <h1 className="text-2xl font-bold">Your profile & verification</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {user.area && (
              <p>
                <span className="font-medium">Area / Ward:</span> {user.area}
              </p>
            )}
            {user.pincode && (
              <p>
                <span className="font-medium">Pincode:</span> {user.pincode}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant={user.addressVerified ? "default" : "outline"}>
                Address {user.addressVerified ? "verified" : "unverified"}
              </Badge>
              <Badge variant={user.aadhaarVerified ? "default" : "outline"}>
                Aadhaar {user.aadhaarVerified ? "verified" : "unverified"}
              </Badge>
            </div>
            {!user.addressVerified && (
              <Button
                size="sm"
                className="mt-3"
                variant="outline"
                onClick={() => {
                  verifyAddress();
                  toast({
                    title: "Address marked as verified (demo only)",
                    description:
                      "In production this would be done via official address proof.",
                  });
                }}
              >
                Mark address as verified (demo)
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aadhaar verification (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleAadhaarSubmit}>
              <div className="space-y-1">
                <Label htmlFor="aadhaarLast4">Aadhaar last 4 digits</Label>
                <Input
                  id="aadhaarLast4"
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value)}
                  maxLength={4}
                  placeholder="1234"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="otp">OTP (demo: 123456)</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? "Verifying..." : "Verify Aadhaar"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                This is a demo-only flow. Real Aadhaar verification must be implemented
                via secure, government-approved APIs on the backend.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;


