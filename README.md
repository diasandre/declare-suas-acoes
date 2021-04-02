<pre>
   _   _   _   _   _   _   _     _   _   _   _     _   _   _   _   _  
  / \ / \ / \ / \ / \ / \ / \   / \ / \ / \ / \   / \ / \ / \ / \ / \ 
 ( D ( E ( C ( L ( A ( R ( E ) ( S ( U ( A ( S ) ( A ( C ( O ( E ( S )
  \_/ \_/ \_/ \_/ \_/ \_/ \_/   \_/ \_/ \_/ \_/   \_/ \_/ \_/ \_/ \_/ 
</pre>  

#### Facilitando a declaração do imposto de renda para quem possui ações. 💲
                                                                                                                                                               
## Como funciona:
Utilizando o Puppeteer, o crawler acessa o CEI e busca todas as informações necessárias para realizar a declaração no imposto de renda incluindo o CNPJ da empresas.
O código retorna uma lista do objeto:
```
 {
    cnpj: 00.000.000/0000-00,
    discriminacao: 'X AÇÕES EMPRESA PELO VALOR TOTAL DE R$ 0.0, ONDE CADA AÇÃO CUSTOU O PREÇO MÉDIO DE R$ 0.0',
    valorNoFinalDoAnoPassado: 0.0,
    valorNoFinalDoAnoAtual: 0.0
  }
```
### Observações:
- O valor valorNoFinalDoAnoPassado pode vir `undefined` caso você só tenha comprado ações da empresa x no ano base atual.
- O valor cnpj pode vir nulo caso a ação seja um BDR

## Como rodar:
- Altere os valores das constantes `selectedYear`, `login` e `password` no arquivo `index.js`.
- É necessário alterar a data na linha 10 do arquivo `crawler.js`, o ano deve ser o mesmo presente na variavel `selectedYear`.
- Abra o terminal e digite: `yarn start`

## Melhorias futuras:
- Testes
- Tratamento de excessões
- Tratando para quando ação é vendida 100%

## Aviso
Código desenvolvido para uso pessoal e pode possuir bugs, não confie 100%. Caso você venda as suas ações é necessário realizar outras declarações que o código não contempla. 

### Declare, não seja trouxa de cair na malha fina, cuidado pois o leão vai te pegar 🦁
