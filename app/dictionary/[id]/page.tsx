import DictionaryEntryClient from "./DictionaryEntryClient";

export default async function DictionaryEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lemma = decodeURIComponent(id);
  return <DictionaryEntryClient lemma={lemma} />;
}