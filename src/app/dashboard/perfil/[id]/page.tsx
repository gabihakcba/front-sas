import { notFound } from 'next/navigation';
import { Card } from 'primereact/card';
import { MemberProfileView } from '@/components/perfil/MemberProfileView';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PerfilByIdPage({ params }: Props) {
  const { id } = await params;
  const memberId = Number(id);

  if (!Number.isInteger(memberId) || memberId <= 0) {
    notFound();
  }

  return (
    <Card title="Perfil">
      <MemberProfileView memberId={memberId} />
    </Card>
  );
}
