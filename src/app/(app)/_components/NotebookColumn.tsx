"use client";
import { useDeskContext, useUser } from "@/app/providers";
import { Column, type ColumnProps } from "@/features/desk/presentation/components/columns";
import { NotebookView } from "@/features/notebook/presentation/components/views";
import { X } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useNotebook, useNotebookPolicy } from "@/features/notebook/presentation/hooks";

type RightColumnProps = ColumnProps & {
  materialIndex: number;
  onMaterialIndexChange: (index: number) => void;
};

export function NotebookColumn({
  materialIndex,
  onMaterialIndexChange,
  ...props
}: RightColumnProps) {
  const { currentNotebookId } = useDeskContext();
  const { user } = useUser();
  const { data: currentNotebook = null, error, isLoading: notebookLoading } = useNotebook(currentNotebookId ?? null);
  const { data: policy } = useNotebookPolicy({notebookId: currentNotebookId, userId: user.id, deskId: currentNotebook?.deskId});
  if(notebookLoading) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if(error) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <ErrorState message={error.message} />
        </div>
      </Column>
    );
  }
  if(!currentNotebook) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <EmptyState variant="page" title="Not Found" message="This Notebook does not exist or has been deleted." />
        </div>
      </Column>
    );
  }
  if(!policy || !policy.canView || !policy.canPreview){
    return (
      <Column
      {...props}
      showsHeader={false}
      toggleIcon={ <X strokeWidth={3} /> }
    >
        <div className="centered">
          <EmptyState 
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            variant="card" 
            message="You do not have permission to view this notebook." />
        </div>
      </Column>
    );
  }
  return (
    <Column
      {...props}
      title={currentNotebook.title}
      toggleIcon={ <X strokeWidth={3} /> }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
       
          <NotebookView
            notebook={currentNotebook}
            onProfileClick={() => {}}
            materialIndex={materialIndex}
            onMaterialIndexChange={onMaterialIndexChange}
          />
        
      </div>
    </Column>
  );
}
