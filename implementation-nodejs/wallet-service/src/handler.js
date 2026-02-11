const grpc = require('@grpc/grpc-js');
const walletService = require('./service');

module.exports = {
    processTransaction: async (call, callback) => {
        try {
            const { user_id, amount, transaction_type } = call.request;

            const result = await walletService.executeTransaction(user_id, amount, transaction_type);

            callback(null, {
                success: result.success,
                message: result.message,
                transaction_id: result.transaction_id,
                final_balance: result.final_balance
            });
        } catch (error) {
            console.error("Handler error:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    }
}