import { format } from "date-fns";
import { redirect } from "next/navigation";

export default function Page() {
  const today = new Date();
  redirect(`/${format(today, "yyyy-MM-dd")}`);

  return null;
}
