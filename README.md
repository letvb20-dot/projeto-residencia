# MediConnect

MediConnect e um prototipo academico de front-end para gestao clinica, desenvolvido como parte de um trabalho de Residencia I. O projeto tem como foco demonstrar a estrutura navegavel de uma aplicacao medica, incluindo modulos de pacientes, agenda, prontuario, laudos, comunicacao, financeiro, relatorios e configuracoes.

O sistema ainda nao possui backend real. Todos os dados, fluxos de autenticacao, persistencia e integracoes externas estao simulados no proprio front-end. A implementacao atual prioriza organizacao de rotas, navegacao, estrutura visual e separacao inicial da camada de dados, preparando o projeto para uma futura integracao com APIs reais.

## Status do projeto

Este repositorio representa uma entrega parcial. A aplicacao esta funcional como prototipo navegavel, mas nao deve ser interpretada como sistema clinico pronto para uso em producao.

Principais caracteristicas do estado atual:

- front-end em React com Vite;
- interface navegavel com shell global, sidebar e header;
- paginas refinadas a partir de referencias do Figma e exports locais;
- dados mockados para simular uso real;
- repositories por dominio para desacoplar as paginas dos mocks;
- ausencia de backend, banco de dados, autenticacao real e chamadas HTTP;
- validacao local por lint, build e testes de navegacao com Playwright durante o desenvolvimento.

## Objetivo academico

O objetivo do projeto e apresentar uma solucao de apoio a operacao de uma clinica, contemplando:

- cadastro e acompanhamento de pacientes;
- organizacao de agenda e consultas;
- registro de prontuario medico;
- emissao e gestao de laudos;
- comunicacao com pacientes por canais simulados;
- acompanhamento financeiro;
- indicadores e relatorios de gestao;
- configuracoes gerais do sistema.

Como se trata de um prototipo parcial, algumas funcionalidades aparecem apenas como simulacao visual ou fluxo local, sem regra de negocio definitiva.

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS/Tailwind via configuracao do projeto
- ESLint
- Playwright para validacoes pontuais de navegacao

## Como executar

Instale as dependencias:

```bash
npm install
```

Execute em modo de desenvolvimento:

```bash
npm run dev
```

Gere a build de producao:

```bash
npm run build
```

Execute a verificacao de lint:

```bash
npm run lint
```

## Estrutura principal

```text
src/
  assets/          Imagens e recursos estaticos usados pela interface
  components/      Componentes compartilhados, incluindo o shell da aplicacao
  data/            Mocks brutos usados como fonte temporaria de dados
  pages/           Telas e rotas principais do prototipo
  repositories/    Camada de acesso a dados por dominio
  App.jsx          Resolucao manual de rotas e composicao do shell
```

## Camada de dados

O acesso aos dados foi centralizado em repositories por dominio. As paginas nao devem importar diretamente `src/data/mockData.js`. Essa separacao permite substituir os dados mockados por chamadas HTTP no futuro com menor impacto na camada de apresentacao.

Repositories existentes:

- `patientRepository`
- `appointmentRepository`
- `visitRepository`
- `professionalRepository`
- `homeRepository`
- `analyticsRepository`
- `financialRepository`
- `medicalRecordRepository`
- `communicationRepository`
- `profileRepository`
- `reportRepository`
- `settingsRepository`

No estado atual, esses repositories ainda retornam dados locais e sincronamente. Em uma evolucao futura, eles podem ser adaptados para consumir uma API real, tratar erros, estados de carregamento e autenticacao.

## Rotas principais

| Rota | Finalidade |
| --- | --- |
| `/login` | Tela de entrada mockada |
| `/cadastro` | Cadastro visual de usuario |
| `/recuperar-senha` | Recuperacao visual de senha |
| `/inicio` | Painel inicial da clinica |
| `/home` | Alias do painel inicial |
| `/dashboard` | Alias do painel inicial |
| `/agenda` | Agenda e criacao local de consultas |
| `/pacientes` | Listagem, filtros e acoes de pacientes |
| `/pacientes/:id` | Dados detalhados do paciente |
| `/prontuario` | Registros de consultas e evolucao medica |
| `/laudos` | Gestao de laudos, templates e versoes |
| `/camunicacao` | Comunicacao com pacientes |
| `/comunicacao` | Alias de comunicacao |
| `/mensagens` | Alias de comunicacao |
| `/consultas` | Fila e acompanhamento de consultas |
| `/profissionais` | Equipe e disponibilidade |
| `/financeiro` | Controle financeiro mockado |
| `/relatorios` | Indicadores e analytics |
| `/perfil` | Perfil local do usuario |
| `/configuracoes` | Configuracoes gerais |
| `/config` | Alias de configuracoes |

## Modulos implementados

### Pacientes

Inclui listagem, pesquisa, filtros, paginacao, acoes por paciente, formulario de cadastro/edicao e tela de detalhe. A rota `/pacientes/:id` e a tela canonica para visualizacao dos dados do paciente.

### Agenda e consultas

Inclui visualizacao de agenda, filtros por status, linha do tempo, resumo preditivo, criacao local de consulta e fila de atendimento.

### Prontuario

Inclui listagem de registros medicos, busca por paciente ou CID, filtro por tipo e modal de novo registro de consulta.

### Laudos

Inclui listagem de laudos, filtros, templates, editor local, historico de versoes, liberacao, envio, impressao e exclusao simulada.

### Comunicacao

Inclui historico de mensagens, filtros por canal, templates, campanhas e envio local de mensagens. Nao ha integracao real com WhatsApp, e-mail ou SMS.

### Financeiro

Inclui resumo financeiro, graficos mockados, formas de pagamento e tabela de lancamentos. Nao ha cobranca real nem integracao com gateway de pagamento.

### Relatorios e analytics

Inclui indicadores executivos, graficos de absenteismo, consultas por periodo, faturamento, convenios, top pacientes e performance por medico.

### Configuracoes e perfil

Inclui configuracoes visuais e operacionais simuladas, dados de perfil do usuario e secoes relacionadas a privacidade, integracoes e backup.

## O que permanece mockado

- autenticacao e autorizacao;
- dados de pacientes;
- agenda e fila de consultas;
- prontuarios;
- laudos e versoes;
- comunicacoes;
- financeiro;
- relatorios;
- configuracoes;
- perfil do usuario;
- persistencia de alteracoes;
- integracoes externas;
- envio de mensagens;
- emissao real de documentos;
- chamadas HTTP.

## Limitacoes atuais

- As alteracoes feitas na interface existem apenas em estado local durante a sessao.
- Nao existe banco de dados.
- Nao existe API.
- Nao existe controle real de permissao de usuario.
- O projeto ainda nao possui validacoes clinicas ou juridicas suficientes para uso real.
- Algumas telas foram refinadas por consistencia visual quando nao havia fonte especifica completa do Figma.
- O conteudo clinico e financeiro e ficticio, usado apenas para demonstracao.

## Proximos passos sugeridos

- Definir contrato de API por modulo.
- Transformar repositories sincronas em chamadas assincronas.
- Adicionar tratamento de loading, erro e estado vazio real.
- Implementar autenticacao e controle de permissoes.
- Persistir dados em backend.
- Criar testes automatizados permanentes para fluxos principais.
- Revisar textos, acessibilidade e responsividade final.
- Refinar visualmente as telas restantes com os frames definitivos do Figma.

## Observacao

Este README descreve o estado atual do prototipo. Como a documentacao academica ainda esta em andamento, o arquivo deve ser atualizado conforme os requisitos, escopo e decisoes tecnicas forem consolidados.
