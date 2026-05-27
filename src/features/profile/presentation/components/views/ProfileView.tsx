import { ProfileTab, SettingsAction, SettingsRoute } from "@/types";
import { ProfileNotebooksView } from ".";
import { ProfileSettingsStack } from "../settings";
import { MinimalDeskListItem } from "@/features/desk/presentation/components/ui/MinimalDeskListItem";
import { GraduationCap, Pencil } from "lucide-react";
import { Button } from "@/components/ui";
import { ProfileHeader, ProfileNavbar } from "../ui";
import { useState } from "react";
import { useAuth, useProfileContext } from "@/app/providers";
import { useUserNotebooks } from "@/features/notebook/presentation/hooks";
import { useModals } from "@/hooks/useModals";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { useUserSettings } from "../../providers";
import { EmptyState } from "@/components/states";
import { ActivityStatusPicker } from "@/features/presence/presentation/components";

type ProfileViewProps = {
  profile: ProfileForDetail;
}
export function ProfileView({ profile }: ProfileViewProps){
  const {data: notebooks = []} = useUserNotebooks(profile.userId);
  const { modals: { "confirmation": confirmationModal }} = useModals();
  
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.PROFILE);
  const { isCurrentUser } = useProfileContext();
  
  const settings = useUserSettings();

  function handleAction(action: SettingsAction) {
    switch(action){
      case "sign-out": {
        confirmationModal.open({
          title: "Sign Out", 
          description: "Are you sure you want to sign out?", 
          onConfirm: () => {
          signOut();
        }});
      }
    }
  }
  const handleTabClick = (tab: ProfileTab) => {
    setActiveTab(tab);
    if (tab !== ProfileTab.SETTINGS) {
      settings.pop();
    }
  };
  function handleSettingsRouteClick(route: Exclude<SettingsRoute, "menu">) {
    setActiveTab(ProfileTab.SETTINGS);
    settings.push(route);
  }

 
  return (
    <>
      <ProfileNavbar onTabClick={handleTabClick} currentTab={activeTab} profile={profile}/>

      <div className="flex min-h-0 flex-1 py-4 flex-col  overflow-hidden">

        {activeTab === ProfileTab.PROFILE && (
          <div className="flex flex-col min-h-0 flex-1 px-5 py-3">
            
            <ProfileHeader
              profile={profile} />
            {isCurrentUser && (
              <div className="w-full max-w-[190px] mt-4 flex flex-col gap-2">
                <Button onClick={() => handleSettingsRouteClick("edit-profile")} variant="secondary" className="w-full rounded-xl">
                  Edit Profile
                </Button>
                <ActivityStatusPicker />
                
              </div>
            )}
            <div className="flex flex-col gap-3 mt-4">
            
              
                  {profile.school ? (
                    <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                      <GraduationCap className="size-5" />
                      {profile.school.name}
                      
                      {isCurrentUser && (
                          <Button
                          onClick={()  => handleSettingsRouteClick("manage-school")}
                          size="icon-sm"
                          variant="ghost"
                          className="text-muted-foreground"
                        >
                          <Pencil className="size-3" strokeWidth={3} />
                        </Button>
                      )}
                    </span>
                  ) : null}
            </div>
          </div>    
        )}
        
    
        {activeTab === ProfileTab.DESKS && ( 
          <div className="flex min-h-0 flex-1 flex-col px-5">
            <h3 className="mb-3 text-lg font-bold">Desks</h3>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-4">
              {profile.memberships.length > 0 ? profile.memberships.map((m) => (
                  <MinimalDeskListItem desk={m.desk} key={m.desk.id}/>
                )) : (
                  <div className="flex flex-col gap-2">
                    <EmptyState
                      itemVariant="outline"
                      message={isCurrentUser ? "You are not a member of any desks" : `${profile.displayName ?? profile.username} is not a member of any desks`}
                      variant="item"  
                    
                    />
                  </div>
                )
              }
            </div>
          </div>
        )}
        {activeTab === ProfileTab.NOTEBOOKS && (
          <div className="flex min-h-0 flex-1 flex-col px-5">
            <h3 className="mb-3 text-lg font-bold">Notebooks</h3>
            <ProfileNotebooksView profile={profile} notebooks={notebooks}/>
          </div>
        )}
        {activeTab === ProfileTab.SETTINGS && (

            
              <ProfileSettingsStack
                profile={profile}
                onNavigate={settings.push}
                onBack={settings.pop}
                onAction={handleAction}
              />
            
        )}
      </div>
    </>
  )
}