// src/app/championships/[idCampeonato]/times/page.tsx
async function getTimes(idCampeonato: string) {
    const res = await fetch(`http://localhost:8081/campeonatos/${idCampeonato}/times`, {
      cache: 'no-store',
    });
    return res.json();
  }
  
  export default async function TimesPage({ params }: { params: { idCampeonato: string } }) {
    const times = await getTimes(params.idCampeonato);
  
    return (
      <div>
        <h1>Times do Campeonato</h1>
        <ul>
          {times.map((time: any) => (
            <li key={time.id}>{time.nome}</li>
          ))}
        </ul>
      </div>
    );
  }
  