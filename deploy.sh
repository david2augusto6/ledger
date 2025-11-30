#!/bin/zsh

echo "🔄 Reiniciando o contrato..."

# 1. Faz o deploy (o script JS já vai atualizar o frontend)
npx hardhat run ignition/modules/deploy.js --network localhost

echo "✅ Deploy concluído e frontend atualizado!"
echo "🚀 Se o React já estiver rodando, apenas dê F5 na página."