import {  Button   } from "@/components/ui";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { Profile } from "../../../infrastructure/queries";
import { Loader2, Pencil, Trash2} from "lucide-react";
import { ProfileAvatar } from "../ui";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/form";

const AVATAR_INPUT_ID = "avatar-image-upload";

type ProfileAvatarFieldProps<T extends FieldValues, U extends Path<T>> = {
    profile: Profile | null;
    control: Control<T>;
    showLabel?: boolean;
    showDescription?: boolean;
    className?: string;
    name: U;
    isLoading?: boolean;
    
  } & React.ComponentProps<typeof ProfileAvatar>;

export function ProfileAvatarField<T extends FieldValues, U extends Path<T>>({
  profile,
  control,
  showLabel = true, 
  showDescription = true,
  isLoading,
  className,
  name,
  ...props
}: ProfileAvatarFieldProps<T, U>) {
  const file = useWatch({ control, name });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  function isFile(value: unknown): value is File {
    return (
      typeof File !== "undefined" &&
      value instanceof File &&
      value.size > 0
    );
  }
  useEffect(() => {
    if (!isFile(file)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  return (
    <InputField<T, U>
      name={name}
      label="Profile photo"
      showsLabel={showLabel}
      showsDescription={showDescription}
      className={className}
      description={"JPG, PNG or GIF. Square images work best."}
      renderInput={({ field, fieldState }) => (
        
          <div className="relative w-full flex justify-center">
            <label
              htmlFor={AVATAR_INPUT_ID}
              className="group relative flex max-w-24 h-24 w-full cursor-pointer justify-center rounded-full transition-all duration-300 hover:shadow-lg shadow-secondary/50"
            >
              <ProfileAvatar 
                profile={profile} 
                previewUrl={previewUrl ?? profile?.avatarUrl} 
                {...props}
              />
              <div
                  className={cn("pointer-events-none absolute inset-0 flex items-center justify-center rounded-full",
                    "bg-secondary/80 opacity-0 transition-opacity group-hover:opacity-100",
                    isLoading && "opacity-100 bg-black/50 pointer-events-none")}
              >
                {isLoading ? <Loader2 strokeWidth={3} className="animate-spin size-8 text-white" /> : <Pencil className="size-8 text-white hidden group-hover:block" />}
              </div>
              <input
                ref={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                id={AVATAR_INPUT_ID}
                type="file"
                accept="image/*"
                aria-invalid={fieldState.invalid}
                aria-required={false}
                className="sr-only"
                onChange={(e) => {
                  const next = e.target.files?.[0] ?? null;
                  field.onChange(next);
                }}
              />
            </label>
            {/* Absolute destructive shadcn button with trash icon in the top-right */}
            {previewUrl && <Button
            type="button"
            className="absolute -top-2 right-0 z-10 shadow-md bg-destructive/20 hover:bg-destructive/35 text-destructive backdrop-blur-xs"
            variant="destructive"
            size="icon"
            onClick={() => field.onChange(null)}
            >
              <Trash2 className="size-4" />
            </Button>}
          </div>
      )}
    />
  );
}
