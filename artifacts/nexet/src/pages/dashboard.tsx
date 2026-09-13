import { PiArrowUpRightDuotone, PiCompassRoseDuotone } from 'react-icons/pi';
import { useUser } from '@clerk/react';
import { Link } from 'wouter';
import { CardDecor, PageHeader } from '@/components/protected-shell';
import { nexetDashboardCategories, nexetRoomMarks } from '@/data/categories';

// Premium dark theme — Resend/Framer inspired. The open rooms are told apart by
// a lit border, a rail and a live dot — not by a glow, which pooled into a haze
// over half the grid and made the cards look out of focus.
const openDoorClass = 'card-surface border-[#3b82f6]/40';
const doorClass: Record<string, string> = {
  teal: 'card-surface border-teal-400/20',
  gold: 'card-surface border-amber-400/25',
  ink: 'card-surface',
  plum: 'card-surface border-purple-400/20',
  blue: 'card-surface border-sky-400/25',
  coral: 'card-surface border-rose-400/30',
};
const doorIconTone: Record<string, string> = {
  teal: 'text-teal-300',
  gold: 'text-amber-300',
  ink: 'text-zinc-300',
  plum: 'text-purple-300',
  blue: 'text-sky-300',
  coral: 'text-rose-300',
};
// Each room's hue, as a crisp rail along the card's top edge — a stripe that
// stops, so a card carries its own temperature without bleeding into the next
// one. An open room's rail sits at full strength; a planned room's is dimmed
// until you reach for it.
const doorRail: Record<string, string> = {
  teal: 'bg-gradient-to-r from-teal-400/90 via-teal-400/30 to-transparent',
  gold: 'bg-gradient-to-r from-amber-400/90 via-amber-400/30 to-transparent',
  ink: 'bg-gradient-to-r from-white/40 via-white/10 to-transparent',
  plum: 'bg-gradient-to-r from-purple-400/90 via-purple-400/30 to-transparent',
  blue: 'bg-gradient-to-r from-sky-400/90 via-sky-400/30 to-transparent',
  coral: 'bg-gradient-to-r from-rose-400/90 via-rose-400/30 to-transparent',
};
const doorCardTitleClass = 'max-w-[13ch] font-brand text-3xl font-bold leading-[.98] tracking-[-0.04em] text-zinc-100';

export default function Dashboard() {
  const { user } = useUser();
  const name = user?.firstName || user?.username || 'maker';

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader title="Welcome," accent={`${name}.`} />

      {/* The doors, in the front page's room-card anatomy: numbered, marked,
          and closed with the one line that says whether you can walk in. */}
      <div className="reveal reveal-1 mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {nexetDashboardCategories.map((category, index) => {
          const Icon = category.icon;
          const available = category.status === 'Available';
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={`soft-lift focus-house group relative flex min-h-[336px] flex-col overflow-hidden rounded-2xl border p-7 ${available ? openDoorClass : doorClass[category.accent] ?? doorClass.ink}`}
              data-testid={`card-category-${category.slug}`}
            >
              <CardDecor />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] transition-opacity duration-300 ${doorRail[category.accent] ?? doorRail.ink} ${available ? '' : 'opacity-45 group-hover:opacity-80'}`}
              />
              <div className="relative flex items-start justify-between gap-4">
                {nexetRoomMarks[category.slug] ? (
                  // The den's own mark, shown whole — no chip, ring or frame, the
                  // same way the front page's room cards wear it.
                  <img src={nexetRoomMarks[category.slug]} alt="" className="h-14 w-14 object-contain" />
                ) : (
                  <span className={`icon-chip h-14 w-14 ${available ? 'text-[#60a5fa]' : doorIconTone[category.accent] ?? 'text-zinc-300'}`}>
                    <Icon className="h-7 w-7" />
                  </span>
                )}
                <span className="pt-1 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  {String(index + 1).padStart(2, '0')} / {String(nexetDashboardCategories.length).padStart(2, '0')}
                </span>
              </div>
              <div className="relative mt-10">
                <h2 className={doorCardTitleClass}>{category.name}</h2>
                <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-zinc-400">{category.description}</p>
              </div>
              {/* Whether you can walk in, on its own shelf — with the handle
                  beside it instead of an arrow lost in the line. */}
              <div className="relative mt-auto pt-9">
                <div className="card-divider mb-5" />
                <div className="flex items-center justify-between gap-4">
                  <span className={`inline-flex items-center gap-2.5 text-sm font-semibold ${available ? 'text-[#60a5fa]' : 'text-zinc-500'}`}>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${available ? 'bg-[#3b82f6] shadow-[0_0_8px_1px_rgba(59,130,246,0.55)]' : 'bg-zinc-700'}`}
                    />
                    {available ? 'Open the room' : 'Coming soon'}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      available
                        ? 'border-[#3b82f6]/40 text-[#60a5fa] group-hover:rotate-45 group-hover:border-[#60a5fa]/70 group-hover:bg-[#3b82f6]/15'
                        : 'border-white/10 text-zinc-600'
                    }`}
                  >
                    <PiArrowUpRightDuotone className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer card — a quiet closing note with the way into the foundation. */}
      <div className="reveal reveal-2 group card-surface relative mt-16 overflow-hidden rounded-2xl border border-[#3b82f6]/25 p-7 sm:p-9">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6]/40 to-transparent"
        />
        <span className="card-spot card-spot-visible" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-5">
            <span className="icon-chip h-12 w-12 shrink-0 text-[#60a5fa]">
              <PiCompassRoseDuotone className="h-6 w-6 animate-spin-slow" />
            </span>
            <div>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                The Engine is being built first — the other doors are already on the blueprint, waiting for their first lights. Every room starts with two.
              </p>
            </div>
          </div>
          <Link
            href="/room/engine"
            className="focus-house group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]"
            data-testid="link-dashboard-footer-engine"
          >
            Visit the foundation
            <PiArrowUpRightDuotone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
