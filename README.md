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
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# ledger_blockchain
# ledger_blockchain
# ledger_blockchain
# ledger_blockchain
# ledger_blockchain
