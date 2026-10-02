import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const departments = [
  {
    id: "roads",
    name: "Roads & Transport Department",
    email: "roads@civic.gov",
    phone: "+91-22-1234-5678",
    wardSupport: "All wards, priority for accident-prone zones",
  },
  {
    id: "sanitation",
    name: "Sanitation & Solid Waste",
    email: "sanitation@civic.gov",
    phone: "+91-22-8765-4321",
    wardSupport: "Door-to-door collection & public bins",
  },
  {
    id: "lighting",
    name: "Street Lighting Cell",
    email: "lighting@civic.gov",
    phone: "+91-22-9988-7766",
    wardSupport: "Street lights, dark spots & energy saving",
  },
];

const OfficialChannels = () => {
  const { toast } = useToast();

  const handleMessage = (dept: string) => {
    toast({
      title: "Channel opened",
      description: `Your message composer for ${dept} would open here in the full app.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Official Communication Channels</h1>
            <p className="text-sm text-muted-foreground">
              Contact verified municipal departments directly for specific issues.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{dept.wardSupport}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{dept.phone}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Verified municipal channel
                </Badge>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleMessage(dept.name)}
                >
                  Send message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OfficialChannels;


