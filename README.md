# 📒 Sistema de Contabilidade em Blockchain (Ledger Imutável)

Este é um projeto de aplicação descentralizada (DApp) que implementa um **Livro Razão Contábil (Ledger)** utilizando a Blockchain Ethereum. O sistema garante a imutabilidade dos registros financeiros e calcula saldos em tempo real através de Contratos Inteligentes.

A interface (Frontend) utiliza uma abordagem de **Assinatura Direta via Chave Privada**, eliminando a necessidade de extensões de navegador (como MetaMask) para interagir com a blockchain, simulando uma arquitetura de servidor/bot ou carteira custodial.

## 🚀 Funcionalidades

- **Registro Imutável:** Transações gravadas na blockchain não podem ser alteradas ou excluídas.
- **Validação de Saldo:** O Smart Contract impede débitos se não houver saldo suficiente (`revert`).
- **Precisão Financeira:** Tratamento de valores decimais utilizando padrões EVM (Wei/BigInt) para evitar erros de arredondamento.
- **Login via Private Key:** Autenticação e assinatura de transações feitas via software (Ethers.js Wallet).
- **Infraestrutura como Código:** Script de deploy automatizado que configura o Frontend com o endereço do contrato atual.

## 🛠️ Tecnologias Utilizadas

- **Solidity (v0.8.x):** Linguagem do Contrato Inteligente.
- **Hardhat:** Ambiente de desenvolvimento, testes e nó local Ethereum.
- **React.js:** Biblioteca para a interface de usuário.
- **Ethers.js (v6):** Biblioteca para interação com a Blockchain e gerenciamento de carteiras.

## 📂 Estrutura do Projeto

```bash
├── contracts/
│   └── AccountingLedger.sol   # O Contrato Inteligente (Lógica de Negócio)
├── scripts/
│   └── deploy.js              # Script de Deploy (Gera o JSON para o frontend)
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── App.js             # Lógica principal e Interface
│   │   ├── contractData.json  # Gerado automaticamente (Endereço do contrato)
│   │   └── ...
├── hardhat.config.js          # Configuração da Blockchain Local
└── start_dev.sh               # Script de automação do ciclo de desenvolvimento
```
## ⚙️ Pré-requisitos

* Node.js (Versão 16 ou superior)
* NPM ou Yarn

## 📦 Instalação

1) Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repo.git](https://github.com seu-usuario/seu-repo.git)
    cd seu-repo
    ```

2. Instale as dependências do Backend (Hardhat):
    ```bash
    npm install
    ```
3. Instale as dependências do Frontend (React):
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## ▶️ Como Rodar o Projeto

Para rodar este projeto localmente, você precisará de três terminais (ou abas).

**Passo 1:** Iniciar a Blockchain Local (Terminal 1)

Este comando inicia um nó Ethereum local e gera 20 contas de teste com saldo fictício.

```bash
npx hardhat node
```    

**⚠️ IMPORTANTE:** Não feche este terminal. Se fechar, a blockchain "reseta".

**Passo 2:** Fazer o Deploy do Contrato (Terminal 2)

Em vez de rodar o deploy manualmente, use o script de automação que criamos. Ele compila o contrato, faz o deploy e atualiza automaticamente o arquivo de configuração do React.

```bash
# No Linux/Mac/Git Bash
./start_dev.sh

# Ou manualmente via Hardhat:
# npx hardhat run ignition/modules/deploy.js --network localhost
```

**Passo 3:** Iniciar o Frontend (Terminal 3)
```bash
cd frontend
npm start
```
O projeto abrirá em http://localhost:3000.

## 🧪 Como Usar (Guia de Teste)

1. Vá ao Terminal 1 (onde o npx hardhat node está rodando).

2. Copie a Private Key de uma das contas listadas (ex: Account #0).

* Exemplo de chave:
``` 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80```

3. No navegador, cole a chave no campo de login e clique em Acessar Painel.

4. Realize lançamentos:

* Tente fazer um Crédito (ex: 100).

* Tente fazer um Débito (ex: 50.50).

* Tente fazer um Débito maior que o saldo (o sistema deve exibir erro).

## 🔄 Reiniciando o Desenvolvimento

Sempre que você reiniciar o npx hardhat node (Terminal 1), a blockchain é apagada. Para conectar o Frontend novamente, basta ir ao Terminal 2 e rodar:
```bash
./start_dev.sh
```
Isso publicará uma nova cópia do contrato e atualizará o React sem que você precise editar código.
