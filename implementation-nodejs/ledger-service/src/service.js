const ledgerRepository = require('./repository');
const TransactionRecord = require('./model');

class LedgerService 
{
    async createTransactionRecord(transactionType, userId, amount, status) 
    {
        const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const record = new TransactionRecord(
            transactionId,
            transactionType,
            userId,
            amount,
            status,
            new Date().toISOString()
        )

        return {
            logged: true,
            transactionRecord: await ledgerRepository.recordTransaction(transactionId, record)
        };
    }
}

module.exports = new LedgerService();