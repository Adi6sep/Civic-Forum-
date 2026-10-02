import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const resources = [
  {
    id: "waste-policy",
    title: "Solid Waste Management Policy 2024",
    type: "Policy Document",
    department: "Sanitation",
  },
  {
    id: "road-maint",
    title: "Standard Road Maintenance SLA",
    type: "Service Level Agreement",
    department: "Roads & Transport",
  },
  {
    id: "citizen-charter",
    title: "Citizen Charter – Rights & Responsibilities",
    type: "Citizen Charter",
    department: "Civic Administration",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Resource Library</h1>
          <p className="text-sm text-muted-foreground">
            Official documents and guides published by your local authority.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Badge variant="outline" className="text-[10px]">
                  {doc.type}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Department: {doc.department}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  In a full deployment, this would open the PDF or detailed page.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Resources;


