import { useUser } from "@/app/providers";
import { Header } from "./Header";

export function RootHeader() {
  const { profile } = useUser();
  return (
      <Header profile={profile} searchEnabled={true} />
  );
}