"use client";
import { Button, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui";
import { X } from "lucide-react";
import { useNotebooksByUserId } from "@/features/notebook/presentation/hooks";

import { useProfileDetail } from "../../hooks";

import { ProfileButton } from "@/components/shared";

import { ProfileView } from "../views";
import { UserSettingsProvider } from "../../providers";

type ProfileDrawerProps = {
  userId: string;
  
}
export function ProfileDrawer({userId}: ProfileDrawerProps) {
    const { data: profile } = useProfileDetail(userId);
    const {data: notebooks = []} = useNotebooksByUserId(userId);
    


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stats = {
      notebooks: profile?.notebooks.length || 0,
      votes: notebooks.reduce(
        (acc, item) =>
          acc +
          item.votes.reduce((voteAcc, v) => voteAcc + (v.isUpvote ? 1 : -1), 0),
        0
      ),
      desks:  profile?.createdDesks?.length || 0,
    };
  if(!profile) return null;
  return (
    <DrawerContent aria-describedby={undefined} className="w-full p-4 before:bg-transparent border-none">   
      <div className="flex bg-popover shadow-lg border relative rounded-2xl flex-col h-full min-h-0 overflow-hidden">
        <DrawerHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <ProfileButton profile={profile} showsName nameClassName="text-lg font-bold" />
            <DrawerClose asChild className="absolute top-3 right-3">
              <Button variant="ghost" size="icon">
                <X strokeWidth={3} />
              </Button>
            </DrawerClose>

          </div>
          <DrawerTitle className="sr-only">
            Profile
          </DrawerTitle>


        </DrawerHeader>
        <UserSettingsProvider>
          <ProfileView profile={profile} />

        </UserSettingsProvider>

      </div>
    </DrawerContent>
   
  );
}