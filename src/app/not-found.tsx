import NotAllowed from '@/components/common/NotAllowed';

export default function GlobalNotFound() {
  return (
    <NotAllowed
      title="Página no encontrada"
      message="La ruta que intentaste abrir no existe o ya no está disponible."
    />
  );
}
