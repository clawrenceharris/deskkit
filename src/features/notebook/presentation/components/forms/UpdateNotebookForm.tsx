import { Form } from "@/components/form";
import { UpdateNotebookFormValues } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { NotebookDetailsSection, MaterialUploadSection } from ".";
import { useState } from "react";
import { useUpdateNotebookForm } from "../../hooks/useUpdateNotebookForm";
import { UpdateNotebookModalProps } from "@/lib/modals/types";


const panelTransition = {
    type: "tween" as const,
    duration: 0.35,
    ease: [0.32, 0.72, 0, 1] as const,
};
export function UpdateNotebookForm({
    notebookId,
    onSuccess,
    onError
  }: UpdateNotebookModalProps) {
   
    const [showMaterialUploadSection, setShowMaterialUploadSection] = useState(false);    
    const {form, isLoading, updateNotebook, existingMaterials, removedMaterialIds, toggleRemovedMaterialId } = useUpdateNotebookForm({
        notebookId,
        onSuccess,
        onError,
    });
    const handleContinue = () =>{
      setShowMaterialUploadSection(true);
    }
    const handleBack = () =>{
      setShowMaterialUploadSection(false);
    }

    return (
        <Form<UpdateNotebookFormValues>
        form={form}
        cancelText="Back"
        showsCancelButton={showMaterialUploadSection}
        onSubmit={showMaterialUploadSection ? updateNotebook : handleContinue}
        submitText={"Update Notebook"}
        isLoading={isLoading}
        enableBeforeUnloadProtection
        onCancel={showMaterialUploadSection ? handleBack : undefined}
      >
        <AnimatePresence mode="sync">
          <div className="h-full flex-1 bg-popover overflow-hidden p-2">
            {!showMaterialUploadSection && 
            <motion.div
                key={"update-notebook-form"}
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
                existingMaterials={existingMaterials}
                removedMaterialIds={removedMaterialIds}
                onToggleExistingMaterial={toggleRemovedMaterialId}
              />
            </motion.div>}
          </div>
        </AnimatePresence>
      </Form>
    )
}