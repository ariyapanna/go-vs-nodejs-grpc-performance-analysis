const grpc = require('@grpc/grpc-js')
const ledgerService = require('./service');
module.exports = { 
    recordTransaction: async (call, callback) => {
        try
        {
            const { user_id, amount, transaction_type, status } = call.request;

            const result = await ledgerService.createTransactionRecord(user_id, amount, transaction_type, status);
            return callback(null, {
                logged: result.logged,
                reference_id: result.referenceId
            });
        }
        catch(error)
        {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    }
}


