import TemplateEditorClient from '@/components/TemplateEditorClient';

// Server Component
export default function TemplateEditorPage({
  params,
  searchParams,
}: {
  params: { templateId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <TemplateEditorClient templateId={params.templateId} searchParams={searchParams} />;
}