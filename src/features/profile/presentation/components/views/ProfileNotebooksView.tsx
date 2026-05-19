import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { useState } from "react";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { APP_ROUTES } from "@/app/providers";
import { EmptyState } from "@/components/states";
import { FilePreviewer } from "@/components/shared";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";


type ProfileNotebooksViewProps = {
  profile: ProfileForDetail;
  notebooks: NotebookForDetail[];
}
 
export function ProfileNotebooksView({profile, notebooks}: ProfileNotebooksViewProps){
    const [activeTab, setActiveTab] = useState<"mine" | "others">("mine");   
   
    return (
      <div className="flex min-h-0 flex-col gap-2 items-center justify-around border rounded-xl">
     
       
     <div className="flex w-full border-b">
  
    
     <button className={cn(`flex-1 flex justify-center py-3 text-muted-foreground hover:text-foreground transition-colors`, activeTab === "mine" && "border-b-2 border-primary text-primary")} onClick={() => setActiveTab("mine")}>
       Mine
     </button>
     <button className={cn(`flex-1 flex justify-center py-3 text-muted-foreground hover:text-foreground transition-colors`, activeTab === "others" && "border-b-2 border-primary text-primary")} onClick={() => setActiveTab("others")}>
       Others&apos;
     </button>
     
     </div>
      {/* Grid Section */}
      {activeTab === "mine" && <ProfileNotebookGrid  notebooks={notebooks} emptyText="You haven't posted any materials yet." /> }
     {activeTab === "others" && <ProfileNotebookGrid  notebooks={notebooks.filter(d => d.creatorId !== profile.userId)} emptyText="You haven't saved anyone else's notebooks yet." />}
    
   </div>
    );
  }


  type ProfileNotebookGridProps = {
    notebooks: NotebookForDetail[];
    emptyText: string;
  }
  
  function ProfileNotebookGrid({notebooks, emptyText}: ProfileNotebookGridProps) {
    if (notebooks.length === 0) {
      return <EmptyState variant="item" message={emptyText} />
    }
  console.log(notebooks);
    return (
        
      
      <div className="relative flex min-h-0 flex-1 w-full flex-col overflow-y-auto p-3">
        <div className="grid grid-cols-3 w-full  gap-1 ">
        {notebooks.map((n) => (
            <Link 
              key={n.id}
              href={APP_ROUTES.notebook(n.deskId, n.id)} 
              className="overflow-hidden rounded-lg aspect-square flex items-center justify-center relative group cursor-pointer hover:opacity-90 transition-opacity"
            >
              {/* Placeholder for actual item image/preview */}
              <FilePreviewer
                enableExpand={false}
                className="size-full flex-1 absolute"
                materials={[n.materials?.[0]]}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <ChevronUp strokeWidth={3} className="size-4 text-white" />
                  <span className="text-xs font-bold">
                    {
                      n.votes.filter(v => v.isUpvote).length ?? 0
                    }
                  </span>
                </div>
              </div>
            </Link>
   
        ))}
       
      </div>
      {notebooks.length >= 3 && (
            <div className="p-4 flex justify-center pb-8">
              <Button variant="outline" className="w-full max-w-xs rounded-full font-semibold">
                View all items
              </Button>
            </div>
          )}
    </div>
    
    )
  }