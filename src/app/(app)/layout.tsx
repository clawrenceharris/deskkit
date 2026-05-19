import { LayoutProvider, DeskProvider, SchoolProvider, HomeNavigationProvider, ModalProvider } from "../providers";
import { ProfileProvider } from "../providers";
import { HomePageClient } from "./HomePageClient";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutProvider>
            <SchoolProvider>
                <DeskProvider>
                    <HomeNavigationProvider>
                        <ModalProvider>   
                            <ProfileProvider>
            
                                <HomePageClient />
                                <div hidden>{children}</div>
                            </ProfileProvider>
                        </ModalProvider>
                        
                    </HomeNavigationProvider>
                    
                </DeskProvider>
            </SchoolProvider>
        </LayoutProvider>   
    );
}