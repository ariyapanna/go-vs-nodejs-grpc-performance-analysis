const transactionRecords = new Map();
module.exports ={
    recordTransaction: async (transactionId, record) => {
        transactionRecords.set(transactionId, record);
        return record;
    }

}