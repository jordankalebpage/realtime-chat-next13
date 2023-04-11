import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface DashboardProps {}

export default async function Dashboard({}: DashboardProps) {
  const session = await getServerSession(authOptions);

  return <></>;
}
