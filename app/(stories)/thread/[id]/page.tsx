import { ThreadView as ThreadsComponent } from "@/components/thread";

export default async function Threads({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id) {
    return <p>Bad request</p>;
  }

  return <ThreadsComponent threadId={id} />;
}
