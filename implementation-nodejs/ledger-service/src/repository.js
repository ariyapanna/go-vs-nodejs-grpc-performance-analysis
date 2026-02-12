class LedgerRepository 
{
    constructor()
    {
        this.transactionRecords = new Map();
    }

    async recordTransaction(transactionId, record) 
    {
        this.transactionRecords.set(transactionId, record);
        return record;
    }
}

module.exports = new LedgerRepository();