import { ThreadView } from "@/app/(stories)/thread/[id]/thread";

export default async function Threads({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id) {
    return <p>Bad request</p>;
  }

  return (
    <div className="flex animate-in slide-in-from-right-2 fade-in-0 duration-150">
      <ThreadView threadId={id} />
    </div>
  );
}
