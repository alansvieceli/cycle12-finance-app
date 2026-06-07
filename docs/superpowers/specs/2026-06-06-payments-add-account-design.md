# Design: Adicionar conta pela tela Pagamentos do Mês

**Data:** 2026-06-06
**Status:** Aprovado

## Contexto

A tela `Pagamentos do Mês` é uma view secundária aberta a partir do botão "Detalhes" em `Resumo`. Atualmente ela serve apenas para visualizar e marcar pagamentos do mês corrente. O objetivo desta feature é permitir que o usuário adicione uma nova conta diretamente dessa tela, sem precisar navegar para `Contas`.

## Problema

O usuário pode perceber que esqueceu de cadastrar uma conta enquanto está verificando pagamentos do mês. Hoje, para adicionar a conta ele precisa sair de Pagamentos, ir até a aba Contas, cadastrar a conta, voltar para Planejar para lançar o valor do mês, e só então voltar a Pagamentos. O fluxo é longo para algo pontual.

## Decisões de Design

### Header da tela

O header do `CurrentMonthPaymentChecklist` é substituído pelo novo layout:

```
PAGAMENTOS
Marque o que já foi pago.
Jun / 2026                    [Voltar]
[        Adicionar conta         ]
```

- Label `PAGAMENTOS` — texto muted, uppercase, pequeno
- Hint `Marque o que já foi pago.` — texto muted, logo abaixo do label (sem a palavra "manualmente")
- `Jun / 2026` — título grande à esquerda, com mês e ano do `projectionMonth` atual
- Botão `Voltar` — à direita na mesma linha do mês/ano, mesmo estilo do botão secundário existente
- Botão `Adicionar conta` — largura total, cor de destaque (laranja), abaixo da linha do mês

### Estado sem categorias

Se `categories` estiver vazia, o botão `Adicionar conta` aparece desabilitado com um hint abaixo: _"Crie uma categoria em Contas primeiro."_

### Modal de adição

Ao tocar em `Adicionar conta`, abre um `Modal` com overlay escurecido (mesmo padrão do ajuste de valores em `Planejar`).

Campos do modal:

| Campo             | Tipo                 | Padrão             | Regras                                       |
| ----------------- | -------------------- | ------------------ | -------------------------------------------- |
| Nome da conta     | texto livre          | vazio              | obrigatório, não pode ser vazio              |
| Categoria         | picker (lista todas) | primeira categoria | obrigatório                                  |
| Dia de vencimento | numérico             | dia atual          | 1–31, aceita dias anteriores e futuros       |
| Valor (mês atual) | moeda                | 0,00               | opcional (pode deixar zero e ajustar depois) |

Título do modal: `Nova conta — Jun / 2026`

Ações: `Cancelar` / `Salvar`

### Comportamento ao salvar

1. Cria um `AccountItem` com os dados do formulário (`name`, `categoryId`, `dueDay`, `sortOrder: 0`).
2. Se o valor informado for maior que zero, registra um `MonthlyValue` para o mês atual (`month`, `year`, `amount`).
3. O novo item aparece imediatamente na checklist de pagamentos, ordenado por dia de vencimento.
4. O modal fecha automaticamente.

### Propagação nos meses seguintes

O comportamento nos demais meses segue a **propagação da categoria selecionada**:

- `zero` — conta existe mas fica zerada nos outros meses (mais comum para contas pontuais)
- `fixed` — valor se propaga para todos os meses da janela ao avançar o período
- `installment` — segue a data de término configurada na categoria

O usuário é responsável por escolher a categoria adequada. Não há restrição de categoria no picker.

## O que não muda

- A checklist de pagamentos (toggle pago/pendente, filtros, totais) funciona exatamente como hoje.
- `Pagamentos` continua sendo view secundária aberta do `Resumo`, não uma tab de navegação.
- A gestão completa de contas (editar, excluir, reordenar) permanece em `Contas`.
- O planejamento de valores para outros meses permanece em `Planejar`.

## Escopo excluído

- Editar ou excluir contas por esta tela — fora de escopo, pertence a `Contas`.
- Definir valores para meses futuros no momento da criação — fora de escopo, pertence a `Planejar`.
- Criação de categorias por esta tela — fora de escopo, pertence a `Contas`.

## Componentes afetados

- `src/components/finance/CurrentMonthPaymentChecklist.tsx` — header redesenhado, botão de adição, modal de criação
- `src/hooks/useFinanceState.ts` — ação `createAccountItem` já existe; sem alteração necessária
- `src/FinanceApp.tsx` — passa `actions.createAccountItem` e `actions.updateMonthlyValue` para o checklist

## Implementação sugerida

A lógica de criação pode ser encapsulada diretamente em `CurrentMonthPaymentChecklist` com estado local para o formulário (nome, categoryId, dueDay, valor). As ações de persistência (`createAccountItem`, `updateMonthlyValue`) são recebidas via props.
