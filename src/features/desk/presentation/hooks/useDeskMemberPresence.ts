/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { MemberForDetail } from "../../infrastructure/queries";

interface PresenceState {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  online_at: string;
}

/**
 * Hook to track active members in a desk using Supabase Presence
 */
export function useDeskMemberPresence(
  deskId: string,
  currentUserId: string,
  members: MemberForDetail[]
) {
  const [activeMembers, setActiveMembers] = useState<
    MemberForDetail[]
  >([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!deskId || !currentUserId) return;

    // Clean up existing channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    // Find current user's profile info
    const currentUserParticipant = members.find(
      (p) => p.profile.userId === currentUserId
    );
    const currentUserProfile = currentUserParticipant?.profile;

    // Create presence channel
    const channel = supabase.channel(`desk-presence:${deskId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    // Track presence state
    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();

        // Convert presence state to active participants
        const activeUserIds = new Set<string>();
        Object.values(presenceState).forEach((presences: any) => {
          presences.forEach((presence: PresenceState) => {
            activeUserIds.add(presence.user_id);
          });
        });

        // Filter members to only include active ones
        const activeMembers = members.filter((m) =>
          activeUserIds.has(m.profile.userId)
        );

        setActiveMembers(activeMembers);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }: { key: string; newPresences: PresenceState[] }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }: { key: string; leftPresences: PresenceState[] }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          // Track current user's presence
          await channel.track({
            user_id: currentUserId,
            display_name:
              currentUserProfile?.displayName ||
              `User ${currentUserId.slice(0, 8)}`,
            avatar_url: currentUserProfile?.avatarUrl,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    // Cleanup on unmount or dependency change
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [deskId, currentUserId, members]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    activeMembers,
    totalActiveCount: activeMembers.length,
  };
}