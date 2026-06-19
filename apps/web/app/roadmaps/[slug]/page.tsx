import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getRoadmap, safe, type Roadmap } from "@/lib/api";
import RoadmapDetailClient from "./RoadmapDetailClient";

export const dynamic = "force-dynamic";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await safe<Roadmap | null>(getRoadmap(slug), null);
  if (!r) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <RoadmapDetailClient roadmap={r} />
    </div>
  );
}
