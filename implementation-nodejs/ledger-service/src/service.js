module.exports = {
    createTransactionRecord: async (userId, amount, transactionType, status) => {
        const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const record = {
            id: transactionId,
            transactionType: transactionType,
            userId: userId,
            amount: amount,
            status: status,
            createdAt: new Date().toISOString()
        };

        return {
            logged: true,
            referenceId: transactionId
        };
    }
}