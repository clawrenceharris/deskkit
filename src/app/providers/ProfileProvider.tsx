"use client";
import { Drawer } from "@/components/ui/drawer";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries/profileQueries";
import { ProfileDrawer } from "@/features/profile/presentation/components/ui";
import { useProfileDetail } from "@/features/profile/presentation/hooks";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

type ProfileContextType = {
  openProfile: (userId: string) => void;
  isCurrentUser: boolean;
  profile: ProfileForDetail | null;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const {data: profile = null} = useProfileDetail(userId);
  const { user } = useAuth();
  const openProfile = useCallback((userId: string) => {
    setUserId(userId);
  }, []);

  const isCurrentUser = useMemo(() => {
    return profile?.userId === user?.id;
  }, [profile, user?.id]);
  
  return (
    <ProfileContext.Provider value={{ openProfile,isCurrentUser, profile }}>
      <Drawer  direction="left" open={!!profile} onOpenChange={(nextOpen) => {
        if(!nextOpen){
          setUserId(null);
        }
      }}>
      {children}

      
      {profile && (
    
      <ProfileDrawer 
        userId={profile.userId}
        
      />      
      )}
      </Drawer>
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if(!context){
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}