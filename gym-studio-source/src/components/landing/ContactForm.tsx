import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { readError } from "@/lib/studio";
import { useMutation } from "convex/react";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const INTENTS = [
  "Book a studio tour",
  "Membership & pricing",
  "Personal coaching",
  "Corporate & teams",
  "Something else",
] as const;

export function ContactForm() {
  const submitLead = useMutation(api.studio.submitLead);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState<string>(INTENTS[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    try {
      await submitLead({ name, email, focus, message });
      toast.success("Enquiry received", {
        description: "A coach will reply within one working day.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setFocus(INTENTS[0]);
    } catch (error) {
      toast.error("Enquiry not sent", { description: readError(error) });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-1">
        <span className="studio-label">Enquiry</span>
        <p className="studio-serif text-2xl">Tell us what you're after.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="lead-name"
            className="text-[0.68rem] font-normal uppercase tracking-[0.2em] text-muted-foreground"
          >
            Name
          </Label>
          <Input
            id="lead-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Elena Marchetti"
            autoComplete="name"
            className="rounded-sm border-[var(--line)] bg-background"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="lead-email"
            className="text-[0.68rem] font-normal uppercase tracking-[0.2em] text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="lead-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="rounded-sm border-[var(--line)] bg-background"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-[0.68rem] font-normal uppercase tracking-[0.2em] text-muted-foreground">
          What brings you in?
        </Label>
        <Select value={focus} onValueChange={setFocus}>
          <SelectTrigger className="w-full rounded-sm border-[var(--line)] bg-background">
            <SelectValue placeholder="Choose an enquiry type" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
            {INTENTS.map((intent) => (
              <SelectItem key={intent} value={intent} className="cursor-pointer">
                {intent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="lead-message"
          className="text-[0.68rem] font-normal uppercase tracking-[0.2em] text-muted-foreground"
        >
          Notes
        </Label>
        <Textarea
          id="lead-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Goals, injuries, preferred training times…"
          rows={4}
          className="min-h-28 resize-none rounded-sm border-[var(--line)] bg-background"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={sending}
        className="w-full rounded-sm tracking-[0.02em]"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending enquiry
          </>
        ) : (
          <>
            Send enquiry
            <Send className="ml-2 size-4" />
          </>
        )}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        We reply personally — no newsletters, no drip campaigns.
      </p>
    </form>
  );
}
