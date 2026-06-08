# Design: Painel de ajuste inline no MonthlyValueEditor

**Data:** 2026-06-08  
**Status:** Aprovado

## Contexto

Na Terra de Planejar (`MonthlyValueEditor`), cada linha de mês exibe o nome do mês, um input de valor e dois botões inline `+` e `-`. Esses dois botões ocupam espaço horizontal desnecessário e o padrão já existe de forma mais compacta na tela de pagamentos (`CurrentMonthPaymentChecklist`).

## Objetivo

Substituir os dois botões `+` e `-` inline por um único botão `±` que expande um painel de ajuste abaixo da linha, idêntico ao padrão do `CurrentMonthPaymentChecklist`.

## Design

### Layout de cada linha de mês

**Antes:**

```
[Nome do mês]  [input: 1.200,00]  [+]  [−]
```

**Depois:**

```
[Nome do mês]  [input: 1.200,00]  [±]
```

### Painel expandido (ao clicar em `±`)

Aparece abaixo da linha, separado por `borderTopWidth: 1`. Estrutura:

1. **Linha de campo:** `[+ | 0,00 | −]`
   - Botão `+` à esquerda (ativa modo `add`, fica com fundo `accent` quando ativo)
   - `TextInput` central (valor do ajuste, `keyboardType="decimal-pad"`)
   - Botão `−` à direita (ativa modo `subtract`, fica com fundo `negative` quando ativo)
   - A borda da linha toda muda de cor conforme o modo ativo (`accent` ou `negative`)

2. **Linha de parcelas** (somente quando modo `add` está ativo):
   - Label "Parcelas" + `TextInput` numérico
   - Resumo de parcelas se parcelas > 1 (ex: `+ R$100 × 3 meses → Jun, Jul, Ago`)

3. **Linha de ações:** `[Cancelar]  [Novo total R$1.200,00]`
   - Botão Cancelar: `surfaceMuted`, fecha o painel
   - Botão confirmar: fundo da cor ativa (`accent` ou `negative`), mostra o novo valor calculado

### Comportamento

- Clicar no `±` de um mês já expandido **fecha** o painel (toggle).
- Clicar no `±` de outro mês fecha o anterior e abre o novo.
- Só um painel fica aberto por vez.
- Ao confirmar, o painel fecha e o input de valor da linha reflete o novo total.

## Componente afetado

- `src/components/finance/MonthlyValueEditor.tsx`
  - Remove: botões `+` e `-` inline, modal de ajuste, estado `activeAdjustment`
  - Adiciona: botão `±` por linha, estado `expandedMonthKey`, painel inline com o mesmo shape do `CurrentMonthPaymentChecklist`

## Referência de estilo

Reutilizar os mesmos nomes de estilo e tokens do `CurrentMonthPaymentChecklist`:

- `adjustToggleButton` / `adjustToggleButtonText`
- `adjustPanel`, `adjustFieldRow`, `adjustModeButton`, `adjustModeButtonInactive`, `adjustModeButtonText`
- `adjustInput`
- `adjustActions`, `adjustCancelButton`, `adjustCancelButtonText`, `adjustConfirmButton`, `adjustConfirmText`

A linha de parcelas é exclusiva do `MonthlyValueEditor` (não existe no checklist) e deve ser estilizada de forma consistente com o restante do painel.
