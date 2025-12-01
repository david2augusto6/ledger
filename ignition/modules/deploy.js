const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. Pega a "fábrica" do contrato
  const Accounting = await hre.ethers.getContractFactory("AccountingLedger");

  // 2. Faz o deploy
  console.log("Iniciando deploy na rede localhost...");
  const accounting = await Accounting.deploy();
  await accounting.waitForDeployment();

  const address = await accounting.getAddress();
  console.log("✅ Contrato implantado em:", address);

  // 3. AUTOMAÇÃO: Salvar o endereço no Frontend
  // Define o caminho onde o arquivo JSON será salvo (dentro do React)
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src");
  
  // Verifica se a pasta existe
  if (!fs.existsSync(frontendDir)) {
    console.warn("⚠️ Pasta frontend/src não encontrada. Pulando a gravação do arquivo.");
    return;
  }

  // Cria o objeto JSON
  const contractData = {
    address: address,
    created_at: new Date().toISOString()
  };

  // Escreve o arquivo contractData.json
  fs.writeFileSync(
    path.join(frontendDir, "contractData.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("📄 Endereço salvo automaticamente em: frontend/src/contractData.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});