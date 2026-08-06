# CAPTCHA simples na segunda tela do presente

## O que muda

Hoje a segunda tela mostra "🎉 Parabéns, seu acesso foi desbloqueado!" com o botão **Acessar ✅**, que libera o perfil da Klara direto.

O botão sai e entra uma verificação visual bem fácil, no estilo "não sou um robô", que qualquer pessoa resolve em um toque.

## Como funciona a verificação

- Título: "Confirme que você não é um robô"
- Instrução: "Toque na imagem do 🍓 morango" (o alvo é sorteado a cada carregamento entre uma lista de ícones bem distintos: morango, coração, estrela, foguete, cachorro, pizza)
- Grade de 6 quadrados grandes (2 colunas x 3 linhas no celular), cada um com um ícone grande e bem visível
- Um único toque no ícone correto resolve
- Acertou: quadrado fica verde com ✅, aparece "Verificado!" e o perfil da Klara abre sozinho depois de ~600ms
- Errou: leve balanço no quadrado errado, mensagem "Ops, tente de novo" e a grade é re-embaralhada com um novo alvo (nunca trava o usuário, sempre dá para continuar)

Sem digitação, sem imagens borradas, sem contagem — só um toque.

## Detalhes técnicos

- Alterado apenas `src/components/GiftIntro.tsx`: o bloco `showAccess` passa a renderizar o CAPTCHA em vez do botão "Acessar ✅". `onOpen()` passa a ser chamado após o acerto.
- Estado local novo: alvo sorteado, ordem embaralhada dos ícones, e status (`idle` | `errado` | `ok`).
- Ícones são emojis (sem download de imagem, sem custo de carregamento) para não pesar na página, mantendo a otimização já feita.
- Estilos do CAPTCHA (grade, estado de acerto/erro, animação de shake) adicionados em `src/styles.css` usando os tokens existentes; a animação de acerto reaproveita `animate-gift-reveal`.
- Nenhuma mudança no fluxo do Pix, no perfil ou no restante da página.
