import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FlowDiagram, PageLink } from "../ArticlePage";
import { Ticket, RotateCcw, Loader, CheckCircle2, Archive } from "lucide-react";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "viewing",     label: "Viewing Your Tickets",  level: 2 as const },
  { id: "lifecycle",   label: "Ticket Lifecycle",      level: 2 as const },
  { id: "detail",      label: "Ticket Detail",         level: 2 as const },
  { id: "feedback",    label: "When a Ticket Is Closed" },
  { id: "next-steps",  label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function MyTicketsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">My Tickets</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
      </div>

      <P>
        Every ticket you raise — however you raised it — lands on one screen under the <strong>Help</strong> tab, along
        with its status, priority, and full conversation with the support team.
      </P>

      {/* ── Viewing tickets ── */}
      <H2 id="viewing">Viewing Your Tickets</H2>
      <P>
        The Help page opens with three quick counts — Open Tickets, High Priority, and Closed/Resolved — and your
        dedicated Account Manager's contact details, before listing every ticket below.
      </P>
      <P>
        Use the <strong>All / Open / Closed-Resolved</strong> tabs to filter the list, or search directly by
        <strong> Ticket ID</strong>. Each row shows the Ticket ID, Service Details, Issue Type, Issue Subcategory,
        Priority, Description, when it was created, and its current Status — Issue Type, Subcategory, Priority, and
        Status are all filterable from their column headers, and the list sorts by Created Date &amp; time.
      </P>
      <DocImage src="/screenshots/tickets-all-view.png" alt="All Tickets list view" caption="The full ticket list, filterable by status and searchable by Ticket ID." />

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">Ticket Lifecycle</H2>
      <P>Every ticket's detail view shows exactly where it stands on a five-stage tracker:</P>

      <FlowDiagram
        stages={[
          { title: "Open",        items: [{ icon: <Ticket size={16} />, label: "Ticket raised" }] },
          { title: "Reopen",      items: [{ icon: <RotateCcw size={16} />, label: "Only if sent back" }] },
          { title: "In Progress", items: [{ icon: <Loader size={16} />, label: "Team working on it" }] },
          { title: "Resolved",    items: [{ icon: <CheckCircle2 size={16} />, label: "Fix applied" }] },
          { title: "Closed",      items: [{ icon: <Archive size={16} />, label: "Confirmed done" }] },
        ]}
      />
      <P>
        <strong>Reopen</strong> only becomes relevant if a closed ticket needs to go back into the queue — see
        below for exactly how that works.
      </P>

      {/* ── Detail view ── */}
      <H2 id="detail">Ticket Detail</H2>
      <P>
        Click any ticket to open its full detail: the Ticket ID, its priority and status, the five-stage tracker
        with a timestamp for each stage, the most recent comment, and every reply exchanged so far.
      </P>
      <P>
        To reply, type into the message box and attach a file if needed (one file per message, up to 10 MB
        total), then send. New replies from the support team are flagged so you don't miss them.
      </P>
      <DocImage src="/screenshots/ticket-detail-view.png" alt="Ticket detail view showing the lifecycle tracker and conversation" caption="The tracker at the top shows every stage the ticket has moved through, with timestamps." />

      {/* ── Feedback on closed tickets ── */}
      <H2 id="feedback">When a Ticket Is Closed</H2>
      <P>
        Once your ticket is marked <strong>Closed</strong>, you're asked to rate the experience — 1 to 5 stars, with an
        optional comment — before you submit feedback.
      </P>
      <DocImage src="/screenshots/ticket-feedback-submitted.png" alt="Support feedback panel on a closed ticket" caption="Rate your experience from 1 to 5 stars; a high rating gets an acknowledgment and a direct support email." />

      <Callout variant="important">
        If the issue actually isn't fixed, click <strong>Raise an Issue</strong> in the banner above the feedback
        panel. Despite the label, this <strong>reopens the same ticket</strong> — same Ticket ID, same conversation
        thread — rather than starting a new one. It moves back through <strong>Reopen → In Progress</strong>, picked
        up by the same team.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Something new come up? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
        <LI>Need a direct line instead? <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
