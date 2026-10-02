import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Message = {
  from: "user" | "bot";
  text: string;
};

const cannedAnswers: { match: RegExp; answer: string }[] = [
  {
    match: /pothole|road/i,
    answer:
      "To report a pothole, create a complaint post with a photo and exact location. The Roads department will see it in their queue.",
  },
  {
    match: /street.?light|light not working/i,
    answer:
      "For street lights, choose the 'complaint' category and add 'StreetLights' tag. The Street Lighting cell tracks these issues.",
  },
  {
    match: /contact|ward|officer/i,
    answer:
      "Use the Official Channels page to find contact details for your ward officers and departments.",
  },
];

function getBotReply(input: string): string {
  for (const rule of cannedAnswers) {
    if (rule.match.test(input)) return rule.answer;
  }
  return "I’m CivicBot. I can guide you on how to use this app to report issues, contact departments, or participate in polls. Try asking about potholes, street lights, or ward officers.";
}

export function CivicBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi! I’m CivicBot. Ask me how to report an issue or contact your local departments.",
    },
  ]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const reply = getBotReply(text);
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: reply },
    ]);
    setInput("");
  };

  if (!open) {
    return (
      <button
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary text-primary-foreground px-4 py-2 shadow-lg text-sm"
        onClick={() => setOpen(true)}
      >
        Ask CivicBot
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl">
        <CardHeader className="py-2 px-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">CivicBot</CardTitle>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            ×
          </Button>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-1">
          <div className="h-48 overflow-y-auto border rounded-md p-2 mb-2 bg-muted/40 text-xs space-y-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.from === "user"
                    ? "text-right"
                    : "text-left text-muted-foreground"
                }
              >
                <span
                  className={
                    m.from === "user"
                      ? "inline-block bg-primary text-primary-foreground rounded-md px-2 py-1"
                      : "inline-block bg-background rounded-md px-2 py-1"
                  }
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs"
              placeholder="Ask how to report or contact..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size="sm" onClick={handleSend}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


