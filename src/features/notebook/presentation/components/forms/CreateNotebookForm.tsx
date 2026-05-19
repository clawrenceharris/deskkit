import { Form } from "@/components/form";
import { CreateNotebookFormValues } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { NotebookDetailsSection, MaterialUploadSection } from ".";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { CreateNotebookModalProps } from "@/lib/modals/types";
import { useCreateNotebookForm } from "../../hooks/useCreateNotebookForm";




const panelTransition = {
    type: "tween" as const,
    duration: 0.35,
    ease: [0.32, 0.72, 0, 1] as const,
};
export function CreateNotebookForm({ deskId, onSuccess, onError }: CreateNotebookModalProps) {
  const { user } = useAuth();
  const { form, createNotebook, isLoading } = useCreateNotebookForm({
    deskId,
    userId: user?.id ?? null,
    onSuccess,
    onError,
  });  
  const [showMaterialUploadSection, setShowMaterialUploadSection] = useState(false);    
    const handleContinue = () =>{
      setShowMaterialUploadSection(true);
    }
    const handleBack = () =>{
      setShowMaterialUploadSection(false);
    }

    return (
        <Form<CreateNotebookFormValues>
        form={form}
        cancelText="Back"
        showsCancelButton={showMaterialUploadSection}
        onSubmit={showMaterialUploadSection ? createNotebook : handleContinue}
        submitText={"Create Notebook"}
        isLoading={isLoading}
        enableBeforeUnloadProtection
        onCancel={showMaterialUploadSection ? handleBack : undefined}
      >
        <AnimatePresence mode="sync">
          <div className="h-full flex-1 bg-popover overflow-hidden p-2">
            {!showMaterialUploadSection && 
            <motion.div
                key={"create-notebook-form"}
                initial={"open"}
                className="h-full flex-1 bg-popover"
                exit={{ x: "-100%" }}
                variants={{ open: { x: "0%" }, closed: { x: "-100%" } }}
                animate={showMaterialUploadSection ? "closed" : "open"}
                transition={panelTransition} 
              >
              <NotebookDetailsSection />
            </motion.div>
            }
            {showMaterialUploadSection &&
              
            <motion.div key={"material-upload-section"}
              initial={ "closed" }
              exit={{ x: "100%" }}
              className="h-full flex-1 bg-popover"
              variants={{ open: { x: "0%" }, closed: { x: "100%" } }}
              animate={showMaterialUploadSection ? "open" : "closed"}
              transition={panelTransition}
            >
  
              <MaterialUploadSection
                existingMaterials={[]}
                removedMaterialIds={[]}
                onToggleExistingMaterial={undefined}
              />
            </motion.div>}
          </div>
        </AnimatePresence>
      </Form>
    )
}