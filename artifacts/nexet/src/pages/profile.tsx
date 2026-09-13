import { PiEnvelopeDuotone, PiGearSixDuotone, PiSignOutDuotone, PiPencil, PiUserCircleDuotone } from 'react-icons/pi';
import { Loader2Icon } from 'lucide-react';
import { useClerk, useUser } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getGetUserProfileQueryKey,
  getListWaitlistEntriesQueryKey,
  getUserProfile,
  useListWaitlistEntries,
} from '@workspace/api-client-react';
import { PageHeader } from '@/components/protected-shell';
import { nexetCategories } from '@/data/categories';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [uploading, setUploading] = useState(false);
  const name = user?.fullName || user?.username || 'Nexet member';
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}` || name.slice(0, 2);
  const email = user?.primaryEmailAddress?.emailAddress || 'No email on file';
  const { data: waitlistEntries, isLoading: isLoadingWaitlist } = useListWaitlistEntries({
    query: {
      enabled: isLoaded && !!user,
      queryKey: getListWaitlistEntriesQueryKey(),
    },
  });
  const joinedCategories = nexetCategories.filter((category) =>
    waitlistEntries?.some((entry) => entry.categorySlug === category.slug),
  );

  if (!isLoaded) {
    return <div className="h-56 animate-pulse rounded-2xl bg-white/5" aria-label="Loading profile" />;
  }

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Your place in"
        accent="the house."
      />
      <div className="reveal reveal-1 card-surface mt-12 overflow-hidden rounded-2xl">
        <div className="relative border-b border-white/5 bg-gradient-to-br from-[#3b82f6]/10 to-transparent p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="profile-avatar-wrap">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] font-mono-ui text-xl uppercase text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)]" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] font-mono-ui text-xl uppercase text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)]">
                  {initials}
                </div>
              )}
              {uploading ? (
                <span className="avatar-edit-btn" title="Uploading…" aria-label="Uploading profile photo">
                  <Loader2Icon className="h-3.5 w-3.5 text-white drop-shadow spin" />
                </span>
              ) : (
                <label className="avatar-edit-btn" title="Update profile photo">
                  <PiPencil className="h-3.5 w-3.5 text-white drop-shadow" />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        await clerk.user?.setProfileImage({ file });
                        // Propagate the new avatar across the app family so nexet,
                        // authors-den, creators-den and any other viewer sees it.
                        if (user?.id) {
                          void getUserProfile(user.id);
                          void queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey(user.id) });
                        }
                      } catch {
                        // Upload failed — Clerk-side image stays.
                      }
                      setUploading(false);
                      event.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="font-brand text-3xl font-bold tracking-[-0.03em] text-white">{name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400"><PiEnvelopeDuotone className="h-4 w-4 text-zinc-500" />{email}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  <PiUserCircleDuotone className="h-3.5 w-3.5 text-[#3b82f6]" /> Nexet member
                </span>
                {joinedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3.5 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#60a5fa]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6] glow-dot" />
                    Waiting on {joinedCategories.length} {joinedCategories.length === 1 ? 'room' : 'rooms'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          <div className="card-surface rounded-2xl p-6 sm:col-span-2">
            <h3 className="font-brand text-2xl font-bold tracking-[-0.03em] text-zinc-100">Rooms you're waiting for</h3>
            {isLoadingWaitlist ? (
              <p className="mt-4 text-sm text-zinc-500">Checking the house plan...</p>
            ) : joinedCategories.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {joinedCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.slug} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4" data-testid={`waitlist-${category.slug}`}>
                      <span className="icon-chip h-11 w-11 shrink-0 text-[#60a5fa]"><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-100">{category.shortName}</span>
                        <span className="mt-0.5 block font-mono-ui text-[9px] uppercase tracking-[0.14em] text-zinc-500">On the launch list</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 max-w-xl text-sm leading-[1.8] text-zinc-500">You haven't joined a launch list yet. Leave a light on when a room calls to you.</p>
            )}
          </div>
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6">
            <span className="icon-chip h-11 w-11 text-[#3b82f6]"><PiGearSixDuotone className="h-5 w-5" /></span>
            <p className="mt-6 font-brand text-lg font-bold tracking-[-0.03em] text-zinc-100">Settings are being set.</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">Notification controls and account preferences arrive with the next room.</p>
          </div>
          <button type="button" onClick={() => clerk.signOut({ redirectUrl: '/' })} className="focus-house group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left transition-colors hover:border-red-500/30 hover:bg-red-500/5" data-testid="button-profile-logout">
            <PiSignOutDuotone className="mt-0.5 h-5 w-5 shrink-0 text-red-400 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
            <span>
              <span className="block font-brand text-lg font-bold tracking-[-0.03em] text-zinc-100">Sign out</span>
              <span className="mt-2 block text-sm leading-relaxed text-zinc-500">Sign out of this Nexet session.</span>
            </span>
          </button>
        </div>
      </div>
      <div className="reveal reveal-2 mt-8 flex items-center gap-3 border-t border-white/5 pt-7 text-xs text-zinc-500">
        <PiUserCircleDuotone className="h-4 w-4 shrink-0 text-[#3b82f6]" />
        <span>Your identity is managed securely by Nexet authentication.</span>
      </div>
    </div>
  );
}
