const grpc = require('@grpc/grpc-js')
const ledgerService = require('./service');
module.exports = { 
    recordTransaction: async (call, callback) => {
        try
        {
            const { transaction_type, user_id, amount, status } = call.request;

            const result = await ledgerService.createTransactionRecord(transaction_type, user_id, amount, status);

            return callback(null, {
                logged: result.logged,
                reference_id: result.transactionRecord.id
            });
        }
        catch(error)
        {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    }
}


