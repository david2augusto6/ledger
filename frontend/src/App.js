import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import AccountingLedgerArtifact from "./AccountingLedger.json";
import contractData from "./contractData.json"; 
import { getRegisteredUsers, registerUser, getUserName, clearUsers } from "./users";
import "./App.css";

const RPC_URL = "http://127.0.0.1:8545";

function App() {
  const CONTRACT_ADDRESS = contractData.address;

  // Estados
  const [wallet, setWallet] = useState(null); 
  const [contract, setContract] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados para lista de usuários e tela de cadastro
  const [userList, setUserList] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Contador");

  // Estados de Dados
  const [balance, setBalance] = useState("0");
  const [ledgerCount, setLedgerCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carrega usuários do LocalStorage ao iniciar
  useEffect(() => {
    refreshUserList();
  }, []);

  const refreshUserList = () => {
    const users = getRegisteredUsers();
    setUserList(users);
    // Se não tiver nenhum usuário, força a tela de cadastro
    if (users.length === 0) setIsRegistering(true);
  };

  // --- CADASTRO DE USUÁRIO ---
  const handleRegister = () => {
    if (!newName) return alert("Digite um nome!");
    try {
      const createdUser = registerUser(newName, newRole);
      refreshUserList();
      setIsRegistering(false); // Volta para login
      setNewName("");
      // Opcional: Já logar direto
      // handleUserSelect(createdUser.privateKey);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- LOGIN ---
  const handleUserSelect = async (selectedPrivateKey) => {
    if (!selectedPrivateKey) return;
    if (selectedPrivateKey === "new") {
        setIsRegistering(true);
        return;
    }

    try {
      setError("");
      
      const selectedUser = userList.find(u => u.privateKey === selectedPrivateKey);
      setCurrentUser(selectedUser);

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const _wallet = new ethers.Wallet(selectedPrivateKey, provider);
      
      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        AccountingLedgerArtifact.abi,
        _wallet 
      );

      setWallet(_wallet);
      setContract(_contract);
      await refreshData(_contract, _wallet.address);

    } catch (err) {
      console.error(err);
      setError("Erro ao logar. Verifique se o Hardhat Node está rodando.");
    }
  };

  const refreshData = async (_contract, _address) => {
    try {
      const bal = await _contract.balances(_address);
      setBalance(ethers.formatEther(bal)); 

      const count = await _contract.getTransactionCount();
      setLedgerCount(count.toString());

      let history = [];
      for (let i = Number(count) - 1; i >= 0 && i >= Number(count) - 10; i--) {
        const tx = await _contract.getTransaction(i);
        history.push({
            id: i,
            description: tx.description,
            amountFormatted: ethers.formatEther(tx.amount), 
            isCredit: tx.isCredit,
            userAddress: tx.user 
        });
      }
      setTransactions(history);
    } catch (err) {
      console.error("Erro data:", err);
      setError("Erro ao buscar dados. Tente reiniciar o Hardhat.");
    }
  };

  const handleTransaction = async (isCredit) => {
    if (!contract) return;
    if (!formDesc || !formAmount) return alert("Preencha todos os campos");

    try {
      setLoading(true);
      setError("");

      let valorString = formAmount.toString().replace(',', '.');
      if (isNaN(valorString) || valorString === "") throw new Error("Valor inválido.");

      const valorEmWei = ethers.parseEther(valorString);
      
      const tx = await contract.recordTransaction(formDesc, valorEmWei, isCredit);
      await tx.wait(); 

      setFormDesc("");
      setFormAmount("");
      await refreshData(contract, wallet.address);
      alert("Transação registrada!");

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("Saldo insuficiente")) {
        setError("ERRO: Saldo insuficiente.");
      } else {
        setError("Falha na transação.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar usuários (Debug)
  const handleResetUsers = () => {
    if(window.confirm("Isso apagará todos os usuários cadastrados. Continuar?")) {
        clearUsers();
        refreshUserList();
        setWallet(null);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Sistema Contábil Blockchain</h1>
        <div style={{fontSize: "0.8rem", color: "#666", marginTop: "5px"}}>
          Contrato: {CONTRACT_ADDRESS}
        </div>
      </header>

      {!wallet ? (
        <div className="card login-card">
          {isRegistering ? (
            // --- TELA DE CADASTRO ---
            <div>
              <h2>Novo Cadastro</h2>
              <p>Crie um usuário para acessar o sistema.</p>
              
              <input 
                placeholder="Nome Completo (Ex: João Silva)" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
                style={{width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ddd"}}
              >
                <option value="Contador">Contador</option>
                <option value="Auditor">Auditor</option>
                <option value="Diretor">Diretor</option>
              </select>

              <button onClick={handleRegister} style={{backgroundColor: "#27ae60", color: "white"}}>
                Salvar e Voltar
              </button>
              
              {userList.length > 0 && (
                <button onClick={() => setIsRegistering(false)} style={{marginTop: "10px", background: "none", color: "#555", border: "1px solid #ccc"}}>
                  Cancelar
                </button>
              )}
            </div>
          ) : (
            // --- TELA DE LOGIN ---
            <div>
              <h2>Login</h2>
              <p>Selecione seu usuário:</p>
              
              <select 
                onChange={(e) => handleUserSelect(e.target.value)}
                style={{padding: "15px", width: "100%", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "20px"}}
                defaultValue=""
              >
                <option value="" disabled>-- Selecione --</option>
                {userList.map((user, index) => (
                  <option key={index} value={user.privateKey}>
                    👤 {user.name} ({user.role})
                  </option>
                ))}
                <option value="new" style={{fontWeight: "bold", color: "blue"}}>+ CADASTRAR NOVO USUÁRIO</option>
              </select>

              <div style={{marginTop: "30px", fontSize: "0.8rem"}}>
                <span style={{cursor: "pointer", color: "red"}} onClick={handleResetUsers}>Limpar base de usuários</span>
              </div>
            </div>
          )}
          
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        // --- DASHBOARD ---
        <div className="dashboard">
          <div className="status-bar">
            <div>
              <strong>Usuário:</strong> <span style={{fontSize: "1.2rem"}}>👤 {currentUser?.name}</span> <small>({currentUser?.role})</small>
            </div>
            <div style={{textAlign: "right"}}>
              <strong>Saldo:</strong> <span className="big-number">$ {balance}</span>
            </div>
          </div>

          <div className="main-content">
            <div className="card form-card">
              <h3>Novo Lançamento</h3>
              <input placeholder="Descrição" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              <input type="number" placeholder="Valor" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
              <div className="buttons">
                <button className="btn-credit" disabled={loading} onClick={() => handleTransaction(true)}>{loading ? "..." : "+ Crédito"}</button>
                <button className="btn-debit" disabled={loading} onClick={() => handleTransaction(false)}>{loading ? "..." : "- Débito"}</button>
              </div>
              {error && <p className="error">{error}</p>}
            </div>

            <div className="card list-card">
              <h3>Histórico de Transações</h3>
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index} className={tx.isCredit ? "item-credit" : "item-debit"}>
                    <div className="tx-info">
                      <strong>{tx.description}</strong>
                      <div style={{fontSize: "0.9rem", color: "#555", marginTop: "4px"}}>
                        Feito por: <b>{getUserName(tx.userAddress)}</b>
                      </div>
                    </div>
                    <div className="tx-value">
                      {tx.isCredit ? "+" : "-"} {tx.amountFormatted}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="logout-btn" onClick={() => {setWallet(null); setCurrentUser(null);}}>Sair</button>
        </div>
      )}
    </div>
  );
}

export default App;