'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getChampionships, getUserIdFromToken } from '@/services/championshipService'
import { Pencil, Trash, Calendar, Info, Trophy, MapPin, User, Lock } from 'lucide-react'

interface Campeonato {
  idCampeonato: number
  titulo: string
  descricao: string
  aposta: string
  dataInicio: string
  dataFim: string
  limiteTimes: number
  limiteParticipantes: number
  ativo: boolean
  endereco: {
    cep: string
    uf: string
    cidade: string
    bairro: string
    rua: string
    numero: string
    complemento: string | null
  }
  privacidadeCampeonato: string
  idAcademico: number
  idModalidadeEsportiva: number
  situacaoCampeonato: string
  senha?: string
}

export default function CampeonatoPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const currentUserId = getUserIdFromToken()
  const router = useRouter()

  useEffect(() => {
    const loadCampeonatos = async () => {
      try {
        const data = await getChampionships()
        setCampeonatos(data)
      } catch (error) {
        console.error('Erro ao carregar campeonatos:', error)
        toast.error('Erro ao carregar campeonatos.')
      } finally {
        setLoading(false)
      }
    }

    const userCheck = () => {
      const id = getUserIdFromToken()
      if (!id) {
        toast.error('Usuário não autenticado')
        router.push('/auth')
      }
    }

    userCheck()
    loadCampeonatos()
  }, [router])

  const filteredCampeonatos = campeonatos.filter((campeonato) =>
    campeonato.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderCampeonatos = () => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <Card key={`skeleton-${index}`} className="p-4 border border-blue-700">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-10 w-full bg-gray-300" />
        </Card>
      ))
    }

    if (filteredCampeonatos.length === 0) {
      return (
        <Card className="col-span-full p-4 border border-blue-700">
          <CardContent>
            <p className="text-center text-gray-500">
              Nenhum campeonato encontrado ou erro ao carregar dados.
            </p>
          </CardContent>
        </Card>
      )
    }

    return filteredCampeonatos.map((campeonato: Campeonato) => (
      <Card key={campeonato.idCampeonato} className="border border-blue-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {campeonato.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aposta e Descrição */}
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <Trophy className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Aposta:</p>
              </div>
              <p className="text-lg ml-6">{campeonato.aposta}</p>
              <div className="flex items-center mb-1">
                <Info className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Descrição:</p>
              </div>
              <p className="text-lg ml-6">{campeonato.descricao}</p>
            </div>

            {/* Datas */}
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <Calendar className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Início:</p>
                <p className="text-lg ml-2">{new Date(campeonato.dataInicio).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center mb-1">
                <Calendar className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Fim:</p>
                <p className="text-lg ml-2">{new Date(campeonato.dataFim).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Participantes e Times */}
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <User className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Participantes:</p>
                <p className="text-lg ml-2">{campeonato.limiteParticipantes}</p>
              </div>
              <div className="flex items-center mb-1">
                <User className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Times:</p>
                <p className="text-lg ml-2">{campeonato.limiteTimes}</p>
              </div>
            </div>

            {/* Privacidade e Criador */}
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <Lock className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Privacidade:</p>
                <p className="text-lg ml-2">
                  {campeonato.privacidadeCampeonato === 'PUBLICO' ? 'Público' : 'Privado'}
                </p>
              </div>
              <div className="flex items-center mb-1">
                <User className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Criador:</p>
                <p className="text-lg ml-2">{campeonato.usernameCriador}</p>
              </div>
            </div>

            {/* Endereço */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-1">
                <MapPin className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Endereço:</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${campeonato.endereco.rua}, ${campeonato.endereco.numero}, ${campeonato.endereco.bairro}, ${campeonato.endereco.cidade} - ${campeonato.endereco.uf}, CEP: ${campeonato.endereco.cep}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg ml-6 text-white underline"
              >
                {`${campeonato.endereco.rua}, ${campeonato.endereco.numero}, ${campeonato.endereco.bairro}, ${campeonato.endereco.cidade} - ${campeonato.endereco.uf}, CEP: ${campeonato.endereco.cep}`}
              </a>
            </div>

            {/* Código do Campeonato */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-1">
                <Info className="mr-2 text-blue-700" />
                <p className="text-lg font-semibold">Código do Campeonato:</p>
                <p className="text-lg ml-2 cursor-pointer" onClick={() => navigator.clipboard.writeText(campeonato.codigo)}>
                  {campeonato.codigo}
                </p>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="mt-4 flex space-x-2">
            {campeonato.idAcademico === currentUserId ? (
              <>
                <Button
                  onClick={() => setSelectedCampeonato(campeonato)}
                  className="flex items-center justify-center bg-white hover:bg-zinc-300"
                >
                  <Pencil className="mr-2" /> Atualizar
                </Button>
                <Button
                  onClick={() => handleDeleteCampeonato(campeonato.idCampeonato)}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600"
                >
                  <Trash className="mr-2" /> Excluir
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push(`/championships/${campeonato.idCampeonato}`)}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600"
              >
                Acessar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar className="h-full" />
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Campeonatos</h1>
            <div className="flex space-x-4">
              <Input
                placeholder="Buscar campeonato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button className="bg-blue-500 hover:bg-blue-600">
                Cadastrar Campeonato
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderCampeonatos()}
          </div>
        </div>
      </div>
    </>
  )
}