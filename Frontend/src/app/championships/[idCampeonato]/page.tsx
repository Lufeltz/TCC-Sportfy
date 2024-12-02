import Link from 'next/link';

async function getCampeonato(idCampeonato: string) {
  const res = await fetch(`http://localhost:8081/campeonatos/${idCampeonato}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao carregar o campeonato.');
  return res.json();
}

export default async function CampeonatoDetailsPage({ params }: { params: { idCampeonato: string } }) {
  const campeonato = await getCampeonato(params.idCampeonato);

  return (
    <div>
      <h1>{campeonato.titulo}</h1>
      <p>{campeonato.descricao}</p>
      <p>Privacidade: {campeonato.privacidadeCampeonato === 'PUBLICO' ? 'Público' : 'Privado'}</p>
      <p>Data de Início: {new Date(campeonato.dataInicio).toLocaleDateString()}</p>
      <p>Data de Fim: {new Date(campeonato.dataFim).toLocaleDateString()}</p>
      <Link href={`/time/criar?campeonato=${campeonato.id}`}>
        <button>Criar Time</button>
      </Link>
      <Link href={`/championships/${campeonato.id}/times`}>
        <button>Ver Times</button>
      </Link>
    </div>
  );
}
