const hre = require("hardhat");

// COLE O ENDEREÇO QUE APARECEU NO PASSO 5 AQUI
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

async function main() {
    // Conecta à rede local automaticamente configurada pelo Hardhat
    const [dono, outroUsuario] = await hre.ethers.getSigners();
    
    // Pega a referência do contrato já deployado
    const accounting = await hre.ethers.getContractAt("AccountingLedger", CONTRACT_ADDRESS);

    console.log("--- Iniciando Operações Contábeis ---");

    // 1. Registrar um Crédito (Entrada de Dinheiro)
    console.log("Registrando aporte de capital...");
    const tx1 = await accounting.recordTransaction("Aporte Inicial", 5000, true);
    await tx1.wait();
    console.log("Aporte registrado com sucesso!");

    // 2. Registrar um Débito (Pagamento)
    console.log("Pagando fornecedor...");
    const tx2 = await accounting.recordTransaction("Pagamento AWS", 200, false);
    await tx2.wait();
    console.log("Pagamento registrado!");

    // 3. Verificar Saldo
    const saldo = await accounting.balances(dono.address);
    console.log(`Saldo final no Ledger: ${saldo.toString()}`);

    // 4. Ler o histórico
    const total = await accounting.getTransactionCount();
    console.log(`Total de transações no livro: ${total}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});