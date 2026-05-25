import { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { Column, ColumnProps } from "../columns/Column";
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";

type DeskMembersViewProps = ColumnProps & {
  desk: DeskForDetail;
}

export function DeskMembersView({ desk, ...props }: DeskMembersViewProps) {
  return (
      <Column title="Members" {...props}>
      <div className="flex flex-wrap gap-6 p-9">
        {desk.members.map((member) => (
          <div key={member.profile.userId} className="flex flex-col items-center gap-2">
            <ProfileAvatarWithStatus size="xl" profile={member.profile} />
            <span className="text-sm text-muted-foreground">
              {member.profile.displayName ?? member.profile.username}
            </span>
          </div>
        ))}
      </div>
    </Column>
  )
}
