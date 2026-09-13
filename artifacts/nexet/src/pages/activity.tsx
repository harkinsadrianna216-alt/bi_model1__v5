import {
  PiArrowRightDuotone,
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
import { Link } from 'wouter';
import { PageHeader } from '@/components/protected-shell';
import { useListAccountActivity } from '@workspace/api-client-react';

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
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
            <PiWarningCircleDuotone className="h-6 w-6 text-red-400" />
            <p className="mt-4 font-brand text-3xl font-bold tracking-[-0.03em] text-zinc-100">The record could not be opened.</p>
            <p className="mt-2 text-sm text-zinc-500">Your work is safe. Try again in a moment.</p>
            <button onClick={() => q.refetch()} className="focus-house mt-5 rounded-full bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white">
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
            return <div className="space-y-10">{[...groups.entries()].map(([day, dayEvents]) => (
              <section key={day} aria-label={day}>
                <div className="flex items-center gap-4"><h2 className="font-brand text-2xl font-bold tracking-[-0.03em] text-zinc-100">{day}</h2><span className="h-px flex-1 bg-white/5" /></div>
                <div className="mt-5 space-y-3">{dayEvents.map((event) => {
                  const accent = eventAccent[event.eventType] ?? 'text-zinc-300';
                  const EventIcon = eventIcon[event.eventType] ?? PiClockCountdownDuotone;
                  return (
                    <div key={event.id} data-testid={`account-activity-${event.id}`} className="soft-lift card-surface flex items-start gap-4 rounded-2xl p-5 sm:p-6">
                      <span className={`icon-chip mt-0.5 h-11 w-11 shrink-0 ${accent}`}>
                        <EventIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-relaxed text-zinc-100">{event.summary}</p>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-ui text-[9px] uppercase tracking-[.12em] text-zinc-500">
                          <span>{event.eventType.replaceAll('_', ' ')}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <PiClockDuotone className="h-3 w-3 text-zinc-600" />
                            {new Date(event.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}</div>
              </section>
            ))}</div>;
          })()
        ) : (
          <div className="card-surface overflow-hidden rounded-2xl p-8 sm:p-10">
            <div className="icon-chip h-16 w-16 text-[#3b82f6]">
              <PiChartLineUpDuotone className="h-7 w-7" />
            </div>
            <p className="mt-9 font-brand text-4xl font-bold tracking-[-0.04em] text-zinc-100">Nothing has moved yet.</p>
            <p className="mt-4 max-w-xl text-sm leading-[1.8] text-zinc-500">
              Publish a seed, answer a seed, or open a room and your trail will gather here — every publish, submission, selection, contract lock, and approved pass.
            </p>
            <Link href="/authors/pitch-board" className="focus-house group mt-8 inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]" data-testid="link-activity-dashboard">
              Visit the pitch board
              <PiArrowRightDuotone className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center gap-3 text-xs text-zinc-500">
        <PiSparkleDuotone className="h-4 w-4 animate-pulse-soft text-[#3b82f6]" />
        <span>Activity reflects your rooms only — private by design.</span>
      </div>
    </div>
  );
}
