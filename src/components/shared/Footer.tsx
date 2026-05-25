import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { ProfileButton } from "./ProfileButton";
import { Icon } from "./Icon";
import desk from "@/assets/desk.png";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";
type FooterProps = {
  profile: ProfileForDetail;
}
export function Footer({profile}: FooterProps) {
  return (
    <footer className="absolute bottom-0 left-1/2 -translate-x-1/2 w-70 p-6 flex items-center justify-center">
     
    </footer>
  )
}