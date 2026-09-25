# Confirmação automática do Pix e área de membros

## O que o cliente vai ver
1. Clica em "Assinar" e o código Pix aparece, como hoje.
2. Enquanto a janela fica aberta, o site confere o pagamento a cada 3 segundos.
3. Quando o pagamento é aprovado, aparece um aviso verde "Pagamento confirmado!". Depois de 1 segundo, o cliente vai para a página **/area-membros**.
4. Na área de membros aparece uma mensagem de boas-vindas no topo e, abaixo, a galeria de vídeos e fotos.
5. Se o cliente atualizar a página ou voltar depois no mesmo aparelho, o acesso continua liberado.

## Botão de teste
- A tela do Pix ganha o botão "Simular Pagamento Aprovado", que mostra o aviso verde e leva para /area-membros.
- Esse botão aparece só na pré-visualização do Lovable. Ele não aparece no site publicado, porque lá qualquer visitante conseguiria liberar o conteúdo sem pagar.

## Conteúdo da galeria
- Por enquanto, a galeria usa quadros de exemplo. Depois você me envia as fotos e os vídeos reais para eu colocar no lugar.

## Detalhes técnicos
- **Consulta de status:** uma nova função no servidor, `getPixStatus(transactionId)`, consulta a OmegaPay usando as chaves já salvas. As chaves nunca vão para o navegador. O primeiro passo é confirmar na documentação (app.omegapayments.com.br/docs/v1) qual é o endereço de consulta de transação e quais nomes de status ela usa. O site vai aceitar como aprovado: `PAID`, `APPROVED`, `COMPLETED` e `CONFIRMED`, sem diferenciar maiúsculas de minúsculas.
- **CheckoutModal:** guarda o `transactionId` que já volta de `createPixCharge`, verifica o status a cada 3 segundos com `setInterval` e para a verificação quando o pagamento é aprovado ou quando a janela fecha. Em seguida mostra o aviso verde e chama `navigate({ to: "/area-membros" })` depois de 1 segundo.
- **Estado salvo:** `localStorage["carmen_access"] = { transactionId, paidAt }`.
- **Nova página `src/routes/area-membros.tsx`:** confere o `localStorage` depois que a página carrega. Sem acesso salvo, manda o visitante de volta para `/`. Tem título e descrição próprios na aba do navegador.
- **Botão de teste:** aparece somente quando `import.meta.env.DEV` é verdadeiro.
- **Limitação:** o `localStorage` só controla o que aparece na tela. Quem souber o endereço dos arquivos consegue abri-los direto. Para proteger os arquivos de verdade, o próximo passo seria criar login e armazenamento privado no Lovable Cloud, com a liberação feita pelo aviso de pagamento da OmegaPay (`callbackUrl`). Isso não entra nesta etapa, mas posso fazer depois.
