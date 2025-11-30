import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AccountingLedgerArtifact from "./AccountingLedger.json";
// MUDANÇA 1: Importamos o ficheiro gerado automaticamente pelo deploy
// Se der erro "Module not found", execute o script de deploy primeiro!
import contractData from "./contractData.json"; 
import "./App.css";

// URL da Blockchain Local (Hardhat)
const RPC_URL = "http://127.0.0.1:8545";

function App() {
  // MUDANÇA 2: O endereço vem do JSON, não precisamos mais editar aqui
  const CONTRACT_ADDRESS = contractData.address;

  // Estados da Aplicação
  const [privateKey, setPrivateKey] = useState("");
  const [wallet, setWallet] = useState(null); 
  const [contract, setContract] = useState(null); 
  
  const [balance, setBalance] = useState("0");
  const [ledgerCount, setLedgerCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- FUNÇÃO DE LOGIN ---
  const handleLogin = async () => {
    try {
      setError("");
      
      // Validação de segurança
      if (!CONTRACT_ADDRESS) {
        throw new Error("Endereço do contrato não encontrado. Execute o script de deploy.");
      }

      // Conexão direta via RPC (sem Metamask)
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const _wallet = new ethers.Wallet(privateKey, provider);
      
      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        AccountingLedgerArtifact.abi,
        _wallet 
      );

      setWallet(_wallet);
      setContract(_contract);
      
      // Carrega os dados iniciais
      await refreshData(_contract, _wallet.address);

    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Verifique se a chave privada está correta e o 'npx hardhat node' está a correr.");
    }
  };

  // --- FUNÇÃO DE LEITURA (REFRESH) ---
  const refreshData = async (_contract, _address) => {
    try {
      // Pega saldo e converte de Wei para ETH
      const bal = await _contract.balances(_address);
      setBalance(ethers.formatEther(bal)); 

      // Pega total de transações
      const count = await _contract.getTransactionCount();
      setLedgerCount(count.toString());

      let history = [];
      // Loop reverso para mostrar as últimas 10
      for (let i = Number(count) - 1; i >= 0 && i >= Number(count) - 10; i--) {
        const tx = await _contract.getTransaction(i);
        history.push({
            id: i,
            description: tx.description,
            amountFormatted: ethers.formatEther(tx.amount), 
            isCredit: tx.isCredit,
            user: tx.user
        });
      }
      setTransactions(history);
    } catch (err) {
      console.error("Erro ao ler dados:", err);
      setError("Erro ao ler dados. O contrato pode ter sido reiniciado. Faça login novamente.");
    }
  };

  // --- FUNÇÃO DE ESCRITA (TRANSAÇÃO) ---
  const handleTransaction = async (isCredit) => {
    if (!contract) return;
    if (!formDesc || !formAmount) return alert("Preencha todos os campos");

    try {
      setLoading(true);
      setError("");

      // Tratamento de valor (Vírgula para Ponto)
      let valorString = formAmount.toString().replace(',', '.');
      if (isNaN(valorString) || valorString === "") throw new Error("Valor inválido.");

      // Converte para Wei (BigInt)
      const valorEmWei = ethers.parseEther(valorString);
      
      // Envia transação
      const tx = await contract.recordTransaction(formDesc, valorEmWei, isCredit);
      await tx.wait(); // Aguarda mineração

      // Limpa formulário e atualiza
      setFormDesc("");
      setFormAmount("");
      await refreshData(contract, wallet.address);
      alert("Sucesso!");

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("Saldo insuficiente")) {
        setError("ERRO: Saldo insuficiente para realizar este débito.");
      } else {
        setError("Falha na transação. Verifique o console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Sistema Contábil Blockchain</h1>
        {/* Mostra o endereço atual para confirmação visual */}
        <div style={{fontSize: "0.8rem", color: "#666", marginTop: "5px", background: "#eee", padding: "5px", borderRadius: "4px", display: "inline-block"}}>
          Contrato Ativo: {CONTRACT_ADDRESS || "Não carregado"}
        </div>
      </header>

      {!wallet ? (
        <div className="card login-card">
          <h2>Acesso ao Sistema</h2>
          <p>Cole uma Private Key do terminal Hardhat.</p>
          <input 
            type="password" 
            placeholder="Cole sua Private Key aqui..." 
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <button onClick={handleLogin}>Acessar Painel</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="dashboard">
          <div className="status-bar">
            <div><strong>Carteira:</strong> {wallet.address.substring(0, 10)}...</div>
            <div><strong>Saldo:</strong> <span className="big-number">{balance}</span> ETH</div>
          </div>

          <div className="main-content">
            <div className="card form-card">
              <h3>Novo Lançamento</h3>
              <input placeholder="Descrição" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              <input type="number" placeholder="Valor (ex: 10.50)" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
              <div className="buttons">
                <button className="btn-credit" disabled={loading} onClick={() => handleTransaction(true)}>{loading ? "..." : "+ Crédito"}</button>
                <button className="btn-debit" disabled={loading} onClick={() => handleTransaction(false)}>{loading ? "..." : "- Débito"}</button>
              </div>
              {error && <p className="error">{error}</p>}
            </div>

            <div className="card list-card">
              <h3>Últimos Registros</h3>
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index} className={tx.isCredit ? "item-credit" : "item-debit"}>
                    <div className="tx-info"><strong>{tx.description} </strong><small>{tx.user.substring(0,6)}...</small></div>
                    <div className="tx-value">{tx.isCredit ? "+" : "-"} {tx.amountFormatted}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="logout-btn" onClick={() => setWallet(null)}>Sair</button>
        </div>
      )}
    </div>
  );
}

export default App;