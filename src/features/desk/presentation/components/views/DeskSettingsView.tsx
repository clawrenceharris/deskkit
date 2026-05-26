import { Column, ColumnProps } from "@/components/shared";
import { Button } from "@/components/ui";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";

type DeskSettingsViewProps = ColumnProps & {
  desk: DeskForDetail;
}

export function DeskSettingsView({desk, ...props }: DeskSettingsViewProps) {
  return (
    <Column {...props}>
     <div className="flex flex-col flex-1 rounded-xl w-60 shadow-sm">
        <Button>
          {desk.name} Settings
        </Button>     
      </div>

    </Column>
  )
}