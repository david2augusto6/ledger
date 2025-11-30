// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccountingLedger {
    
    // Define a estrutura de uma transação contábil
    struct Transaction {
        uint256 id;
        address user;     // Quem registrou
        string description;
        uint256 amount;
        bool isCredit;    // true = Crédito (Entrada), false = Débito (Saída)
        uint256 timestamp;
    }

    Transaction[] public ledger; // O "Livro" de registros
    mapping(address => uint256) public balances; // Saldo atual de cada endereço

    // Evento para notificar o front-end quando algo acontecer
    event NewEntry(uint256 indexed id, address indexed user, uint256 amount, string description);

    // Função para registrar uma entrada (Crédito ou Débito)
    function recordTransaction(string memory _description, uint256 _amount, bool _isCredit) public {
        // Validação simples: Se for débito, verificar se há saldo (opcional dependendo da regra)
        if (!_isCredit) {
            require(balances[msg.sender] >= _amount, "Saldo insuficiente para este debito.");
            balances[msg.sender] -= _amount;
        } else {
            balances[msg.sender] += _amount;
        }

        // Cria a transação
        Transaction memory newTx = Transaction({
            id: ledger.length,
            user: msg.sender,
            description: _description,
            amount: _amount,
            isCredit: _isCredit,
            timestamp: block.timestamp
        });

        ledger.push(newTx);
        
        emit NewEntry(newTx.id, msg.sender, _amount, _description);
    }

    // Função para ler o número total de transações
    function getTransactionCount() public view returns (uint256) {
        return ledger.length;
    }
    
    // Função para ler uma transação específica
    function getTransaction(uint256 _index) public view returns (Transaction memory) {
        return ledger[_index];
    }
}