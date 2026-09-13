import { PiArrowUpRightDuotone, PiEyeDuotone, PiLinkDuotone, PiMagicWandDuotone, PiSparkleDuotone } from 'react-icons/pi';
import { Link } from 'wouter';
import { HouseNav, NexetLogo } from '@/components/nexet-house';
import { nexetCategories, nexetUpcomingCategories } from '@/data/categories';

function PlatformDiagram() {
  return (
    <div className="relative mx-auto w-full max-w-[510px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-3 shadow-[0_0_60px_-15px_rgba(59,130,246,0.2)] sm:p-5">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
      <div className="relative grid h-full grid-cols-2 grid-rows-3 gap-2 sm:gap-3">
        <div className="col-span-2 flex min-h-[86px] items-center justify-between rounded-xl border border-[#3b82f6]/30 bg-gradient-to-br from-[#3b82f6]/15 to-transparent p-4 sm:min-h-[108px] sm:p-6">
          <p className="text-[2rem] font-semibold leading-[.9] text-white sm:text-[2.8rem]">Together</p>
          <span className="icon-chip h-11 w-11 animate-float-slow text-[#60a5fa] sm:h-14 sm:w-14">
            <PiLinkDuotone className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        </div>
        <div className="card-surface flex min-h-[70px] flex-col justify-center rounded-xl p-3 sm:min-h-[94px] sm:p-5">
          <span className="text-[1.75rem] font-semibold leading-[.9] text-zinc-100 sm:text-[2.3rem]">Write</span>
        </div>
        <div className="card-surface flex min-h-[70px] flex-col justify-center rounded-xl p-3 sm:min-h-[94px] sm:p-5">
          <span className="text-[1.75rem] font-semibold leading-[.9] text-zinc-100 sm:text-[2.3rem]">Create</span>
        </div>
        <div className="card-surface flex min-h-[70px] flex-col justify-center rounded-xl p-3 sm:min-h-[94px] sm:p-5">
          <span className="text-[1.75rem] font-semibold leading-[.9] text-zinc-100 sm:text-[2.3rem]">Match</span>
        </div>
        <div className="card-surface flex min-h-[70px] flex-col justify-center rounded-xl p-3 sm:min-h-[94px] sm:p-5">
          <span className="text-[1.75rem] font-semibold leading-[.9] text-zinc-100 sm:text-[2.3rem]">Approve</span>
        </div>
      </div>
    </div>
  );
}

/** The rooms that are actually open today — currently Authors & Writers and
 * Content Creators. Everything else is still on the blueprint and lives behind
 * the waitlist page, so it gets no card here. */
const openRooms = nexetCategories.filter((category) => category.status === 'Available');

/** Each open room shows the mark of the den it opens into — the Authors Den's
 * mark for writers, the Creators Den's mark for video — so the card wears the
 * same face as the room behind it. Rooms without a den keep their category
 * icon. */
const roomMarks: Record<string, string> = {
  authors: `${import.meta.env.BASE_URL}nexet-author-den-logo.png`,
  'content-creators': `${import.meta.env.BASE_URL}nexet-agent-logo.png`,
};

/** The rooms still being built. They used to sit among the open doors; they now
 * live in their own "Upcoming features" row so visitors can see the whole house
 * without being sold a room they cannot enter. */
const upcomingRooms = nexetUpcomingCategories;

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-x-clip bg-[#0a0a0a]">
      <div className="hero-glow absolute inset-x-0 top-0 h-[600px]" />
      <HouseNav />
      <section className="relative mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-5 sm:pt-20 lg:px-6 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.22fr_.78fr] lg:gap-10">
          <div className="reveal">
            <h1 className="mt-7 font-brand text-[clamp(2rem,8.5vw,4.2rem)] font-bold leading-[.96] tracking-[-0.05em] text-white lg:text-[clamp(3rem,5.9vw,5.5rem)]">
              What if the
              <br />
              missing piece is
              <br />
              <span className="text-gradient-accent">the one you bring?</span>
            </h1>
            <div className="reveal reveal-1 mt-8 max-w-[31rem] text-base leading-[1.7] text-zinc-400 sm:text-lg">
              <p>Nexet is a creative collaboration platform where unfinished ideas find their missing half.</p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                  <span>Add your part without seeing theirs.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                  <span>Get matched with the right collaborator.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                  <span>Come away with something neither of you could have made alone.</span>
                </li>
              </ul>
            </div>
            <div className="reveal reveal-2 mt-9 flex flex-wrap items-center gap-4">
              <Link href="/sign-up" className="group inline-flex items-center gap-3 rounded-full bg-[#3b82f6] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]" data-testid="link-home-signup">
                Get started
                <PiArrowUpRightDuotone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white" data-testid="link-see-method">
                See how it works
              </a>
            </div>
          </div>
          <div className="reveal reveal-2">
            <PlatformDiagram />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-white/5 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 sm:px-5 lg:grid-cols-[.7fr_1.3fr] lg:px-6 lg:py-28">
          <div>
            <h2 className="mt-5 font-brand text-5xl font-bold leading-[.92] tracking-[-0.04em] text-white sm:text-6xl">A little less knowing,<br />A lot more discovering.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="reveal group card-surface card-surface-hover overflow-hidden rounded-2xl p-7">
              <span className="card-spot" />
              <span className="icon-chip h-14 w-14 text-[#60a5fa]">
                <PiEyeDuotone className="h-6 w-6" />
              </span>
              <h3 className="mt-14 text-xl font-bold tracking-[-0.03em] text-zinc-100">Bring your half</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">You make without seeing the other person's work. No adapting. No performing for a brief.</p>
            </div>
            <div className="reveal reveal-1 group card-surface card-surface-hover overflow-hidden rounded-2xl p-7">
              <span className="card-spot" />
              <span className="icon-chip h-14 w-14 text-[#a78bfa]">
                <PiMagicWandDuotone className="h-6 w-6" />
              </span>
              <h3 className="mt-14 text-xl font-bold tracking-[-0.03em] text-zinc-100">AI as bridge</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">The system holds context, finds the join, and protects the provenance of every contribution.</p>
            </div>
            <div className="reveal reveal-2 group card-surface card-surface-hover overflow-hidden rounded-2xl p-7">
              <span className="card-spot" />
              <span className="icon-chip h-14 w-14 text-[#fbbf24]">
                <PiSparkleDuotone className="h-6 w-6" />
              </span>
              <h3 className="mt-14 text-xl font-bold tracking-[-0.03em] text-zinc-100">The reveal ceremony</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">Two paths become one visible thing. The moment of recognition is part of the work.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-5 lg:px-6 lg:py-32">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <h2 className="mt-5 font-brand text-6xl font-bold leading-[.9] tracking-[-0.05em] text-white sm:text-7xl">Every room starts with two.</h2>
          </div>
          <p className="max-w-[20rem] text-sm leading-relaxed text-zinc-400">Two doors are open today — one for writers, one for video. The rest of the house is still on the blueprint.</p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {openRooms.map((room) => {
            const Icon = room.icon;
            return (
              <Link
                key={room.slug}
                href={`/categories/${room.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-[#3b82f6]/30 card-surface card-surface-hover p-7 transition-all hover:-translate-y-1 hover:border-[#3b82f6]/50 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)] sm:p-10"
                data-testid={`link-room-${room.slug}`}
              >
                <span className="card-spot" />
                <span className="card-shine" />
                <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/5 opacity-20 transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    {roomMarks[room.slug] ? (
                      // The den's own mark, shown whole — no chip, ring or frame.
                      <img src={roomMarks[room.slug]} alt="" className="h-14 w-14 object-contain" />
                    ) : (
                      <span className="icon-chip h-14 w-14 text-[#60a5fa]">
                        <Icon className="h-7 w-7" />
                      </span>
                    )}
                  </div>
                  <div className="mt-12">
                    <h3 className="max-w-[13ch] text-4xl font-bold leading-[.98] tracking-[-0.04em] text-white sm:text-5xl">{room.name}</h3>
                    <p className="mt-4 max-w-[24rem] text-sm leading-relaxed text-zinc-400">{room.description}</p>
                  </div>
                  <span className="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-[#60a5fa]">
                    Open the room
                    <PiArrowUpRightDuotone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="upcoming" className="border-t border-white/5 bg-[#0d0d0d]">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-5 lg:px-6 lg:py-28">
          <div className="flex flex-col gap-4">
            <h2 className="mt-5 font-brand text-[clamp(1.7rem,3.9vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:whitespace-nowrap">The rest of the house is still being built.</h2>
            <p className="max-w-[22rem] text-sm leading-relaxed text-zinc-400">Upcoming features, already on the blueprint. Leave your email on any room and we&apos;ll light it up the day it opens.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingRooms.map((room) => {
              const Icon = room.icon;
              return (
                <Link
                  key={room.slug}
                  href={`/categories/${room.slug}`}
                  className="focus-house group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 card-surface card-surface-hover p-6 transition-all hover:-translate-y-1 hover:border-white/20"
                  data-testid={`link-upcoming-${room.slug}`}
                >
                  <span className="card-spot" />
                  <span className="card-shine" />
                  <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/5 opacity-20 transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex items-center justify-between">
                    <span className="icon-chip h-12 w-12 text-zinc-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono-ui text-[9px] uppercase tracking-[0.13em] text-zinc-400">
                      Coming soon
                    </span>
                  </div>
                  <div className="relative mt-10">
                    <h3 className="max-w-[14ch] text-xl font-bold leading-[1.05] tracking-[-0.03em] text-zinc-100">{room.name}</h3>
                    <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-zinc-500">{room.description}</p>
                  </div>
                  <span className="relative mt-7 inline-flex items-center gap-2 text-xs font-semibold text-zinc-400">
                    Join the waitlist
                    <PiArrowUpRightDuotone className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-5 lg:grid-cols-[1fr_.8fr] lg:items-end lg:px-6 lg:py-28">
          <div>
            <blockquote className="font-brand text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">Bring your half.<br />Leave with something whole.</blockquote>
          </div>
          <div className="border-l border-white/10 pl-6 sm:pl-8">
            <p className="text-sm leading-[1.8] text-zinc-400">Nexet keeps a clear line back to every hand in the room. No synthetic substitute for a person. No erasing the strange, specific route an idea took to arrive.</p>
            <Link href="/room/engine" className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#3b82f6]" data-testid="link-footer-engine">
              Visit the foundation
              <PiArrowUpRightDuotone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <footer className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-white/5 px-4 py-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
          <NexetLogo />
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em]">A platform for creative connection / 2025</span>
        </footer>
      </section>
    </main>
  );
}
