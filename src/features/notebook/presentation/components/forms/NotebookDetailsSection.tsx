"use client";
import { FieldGroup, Textarea } from "@/components/ui"; 
import { CreateNotebookFormValues } from "@/types/desk";
import { InputField } from "@/components/form";

export function NotebookDetailsSection() {
  
  return (
    <FieldGroup className="h-full flex-1 bg-popover">
            <InputField<CreateNotebookFormValues, "title">
              name="title" 
              label="Title" 
              placeholder="What should this notebook be called?" 
              required
            />
            <InputField<CreateNotebookFormValues, "description">
              name="description" 
              label="Description" 
              required={false}
              renderInput={({field}) => (
                <Textarea 
                  {...field}  
                  placeholder="Enter a description for this notebook" 
                  rows={4}
                  maxLength={400}
                />
              )}
            />
            
            
        </FieldGroup>
  );
}