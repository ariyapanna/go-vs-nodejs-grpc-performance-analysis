class TransactionRecord 
{
    constructor(id, transactionType, userId, amount, status, createdAt)
    {
        this.id = id;
        this.transactionType = transactionType;
        this.userId = userId;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = TransactionRecord;