import { Button, Card, PageHeader } from '../components/ui.jsx'

export function NotFoundPage({ navigate }) {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="A rota acessada nao faz parte do shell navegavel deste prototipo."
        eyebrow="404"
        title="Tela nao encontrada"
      />
      <Card className="p-6">
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Volte para o dashboard ou escolha uma area na navegacao lateral. Esta tela tambem ajuda a validar links
          quebrados durante a evolucao do app.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => navigate('/dashboard')}>Ir para dashboard</Button>
          <Button onClick={() => navigate('/login')} variant="secondary">
            Voltar ao login
          </Button>
        </div>
      </Card>
    </div>
  )
}
