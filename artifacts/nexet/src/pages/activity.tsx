import {
  PiBookOpenDuotone,
  PiChartLineUpDuotone,
  PiChatCircleDotsDuotone,
  PiCheckCircleDuotone,
  PiClockCountdownDuotone,
  PiClockDuotone,
  PiFileTextDuotone,
  PiLockKeyDuotone,
  PiMegaphoneDuotone,
  PiNotePencilDuotone,
  PiPaperPlaneTiltDuotone,
  PiSealCheckDuotone,
  PiSparkleDuotone,
  PiUserCheckDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
} from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { EmptyPanel, PageHeader, PrimaryLink } from '@/components/protected-shell';
import { useListAccountActivity } from '@workspace/api-client-react';

// Entrance stagger for the day panels, capped so a long trail doesn't leave the
// last entry waiting on the page load.
const stagger = ['reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5'];

// Each entry in the record gets its own mark and its own colour, so a glance
// at the trail tells you what kind of event it was before you read a word.
const eventAccent: Record<string, string> = {
  seed_published: 'text-[#60a5fa]',
  continuation_submitted: 'text-[#34d399]',
  continuation_annotated: 'text-[#34d399]',
  message_sent: 'text-[#a78bfa]',
  continuation_declined: 'text-red-400',
  respondent_selected: 'text-[#34d399]',
  contract_approved: 'text-[#3b82f6]',
  contract_locked: 'text-[#fbbf24]',
  block_submitted: 'text-[#34d399]',
  block_approved: 'text-[#34d399]',
  story_bible_updated: 'text-[#3b82f6]',
};

const eventIcon: Record<string, IconType> = {
  seed_published: PiMegaphoneDuotone,
  continuation_submitted: PiPaperPlaneTiltDuotone,
  continuation_annotated: PiNotePencilDuotone,
  message_sent: PiChatCircleDotsDuotone,
  continuation_declined: PiXCircleDuotone,
  respondent_selected: PiUserCheckDuotone,
  contract_approved: PiSealCheckDuotone,
  contract_locked: PiLockKeyDuotone,
  block_submitted: PiFileTextDuotone,
  block_approved: PiCheckCircleDuotone,
  story_bible_updated: PiBookOpenDuotone,
};

export default function ActivityPage() {
  const q = useListAccountActivity();
  const events: any[] = q.data || [];

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        icon={PiChartLineUpDuotone}
        kicker="Your record"
        title="A clear record."
        aside={
          <p className="max-w-sm border-l border-white/10 pl-5 text-sm leading-[1.8] text-zinc-400">
            Every room you are part of — seeds you published, continuations you received or sent, contracts locked, passes approved. Summaries only; hidden prose never enters this log.
          </p>
        }
      />

      <div className="mt-12">
        {q.isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : q.isError ? (
          <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 p-8 sm:p-10">
            <span className="icon-chip h-16 w-16 text-red-400">
              <PiWarningCircleDuotone className="h-7 w-7" />
            </span>
            <p className="mt-8 font-brand text-4xl font-bold leading-[.95] tracking-[-0.04em] text-zinc-100">The record could not be opened.</p>
            <p className="mt-4 max-w-xl text-sm leading-[1.8] text-zinc-500">Your work is safe. Try again in a moment.</p>
            <button onClick={() => q.refetch()} className="focus-house mt-8 inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
              Try again
            </button>
          </div>
        ) : events.length ? (
          (() => {
            const groups = new Map<string, any[]>();
            for (const event of events) {
              const day = new Date(event.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
              const list = groups.get(day) ?? [];
              list.push(event);
              groups.set(day, list);
            }
            // One panel per day, the way the front page bands its sections: the
            // day is the panel's own header, and the entries inside are rows.
            return <div className="space-y-6">{[...groups.entries()].map(([day, dayEvents], groupIndex) => (
              <section
                key={day}
                aria-label={day}
                className={`reveal ${stagger[Math.min(groupIndex, stagger.length - 1)]} card-surface relative overflow-hidden rounded-2xl`}
              >
                <div className="flex items-center gap-4 border-b border-white/5 px-6 py-5">
                  <h2 className="font-brand text-2xl font-bold tracking-[-0.03em] text-zinc-100">{day}</h2>
                  <span className="h-px flex-1 bg-white/5" />
                  <span className="shrink-0 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {dayEvents.length} {dayEvents.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <ul className="divide-y divide-white/5">{dayEvents.map((event) => {
                  const accent = eventAccent[event.eventType] ?? 'text-zinc-300';
                  const EventIcon = eventIcon[event.eventType] ?? PiClockCountdownDuotone;
                  return (
                    <li
                      key={event.id}
                      data-testid={`account-activity-${event.id}`}
                      className="flex items-start gap-5 px-6 py-5 transition-colors hover:bg-white/[0.025]"
                    >
                      <span className={`icon-chip h-11 w-11 shrink-0 ${accent}`}>
                        <EventIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-relaxed text-zinc-100">{event.summary}</p>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono-ui text-[9px] uppercase tracking-[.12em] text-zinc-500">
                          <span>{event.eventType.replaceAll('_', ' ')}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <PiClockDuotone className="h-3 w-3 text-zinc-600" />
                            {new Date(event.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}</ul>
              </section>
            ))}</div>;
          })()
        ) : (
          <EmptyPanel
            icon={PiChartLineUpDuotone}
            kicker="Nothing logged yet"
            title="Nothing has moved yet."
            body="Publish a seed, answer a seed, or open a room and your trail will gather here — every publish, submission, selection, contract lock, and approved pass."
            action={
              <PrimaryLink href="/authors/pitch-board" testId="link-activity-dashboard">
                Visit the pitch board
              </PrimaryLink>
            }
          />
        )}
      </div>
      <div className="reveal reveal-2 mt-8 flex items-center gap-3 border-t border-white/5 pt-7 text-xs text-zinc-500">
        <PiSparkleDuotone className="h-4 w-4 shrink-0 animate-pulse-soft text-[#3b82f6]" />
        <span>Activity reflects your rooms only — private by design.</span>
      </div>
    </div>
  );
}
