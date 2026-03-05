import DictionaryEntryClient from "./DictionaryEntryClient";

export default function DictionaryEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const lemma = decodeURIComponent(params.id);
  return <DictionaryEntryClient lemma={lemma} />;
}