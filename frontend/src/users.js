// Banco de Contas do Hardhat (Pre-funded accounts)
// Usamos essas contas porque elas já possuem 10.000 ETH para testes.
const HARDHAT_ACCOUNTS = [
    { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
    { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
    { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
    { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
    { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", privateKey: "0x47e179ec197488593b1878672552ad746e3205a50e77723405f68dde4d5fa636" },
    { address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0d18e3859027f4f676524587e9" },
    { address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" },
    { address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", privateKey: "0x4bbbf85ce3377467afe5d46f804f221313cd9ead88d975e2796ad63df274e177" },
    { address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", privateKey: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97" },
    { address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6" }
];

const STORAGE_KEY = "blockchain_ledger_users";

// Recupera usuários salvos no LocalStorage
export const getRegisteredUsers = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

// Registra um novo usuário associando-o a uma conta Hardhat disponível
export const registerUser = (name, role) => {
    const currentUsers = getRegisteredUsers();
    
    // Verifica se ainda há contas disponíveis
    if (currentUsers.length >= HARDHAT_ACCOUNTS.length) {
        throw new Error("Limite de usuários de teste atingido (Máx 10).");
    }

    // Pega a próxima conta livre
    const nextAccount = HARDHAT_ACCOUNTS[currentUsers.length];

    const newUser = {
        name: name,
        address: nextAccount.address,
        privateKey: nextAccount.privateKey,
        registeredAt: new Date().toISOString()
    };

    // Salva no storage
    const updatedList = [...currentUsers, newUser];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    return newUser;
};

// Função auxiliar para encontrar o nome pelo endereço
export const getUserName = (address) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    return user ? user.name : `${address.substring(0, 6)}...`;
};

// Reseta tudo (para testes)
export const clearUsers = () => {
    localStorage.removeItem(STORAGE_KEY);
};