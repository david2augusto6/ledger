echo "🔄 Reiniciando o contrato..."

npx hardhat run ignition/modules/deploy.js --network localhost

echo "✅ Deploy concluído e frontend atualizado!"
echo "🚀 Se o React já estiver rodando, apenas dê F5 na página."