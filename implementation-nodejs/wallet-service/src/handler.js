const grpc = require('@grpc/grpc-js');

class WalletHandler 
{
    constructor(service)
    {
        this.service = service;
    }

    async processTransaction(call, callback) 
    {
        try 
        {
            const { user_id, amount, transaction_type } = call.request;

            const result = await this.service.executeTransaction(user_id, amount, transaction_type);

            callback(null, {
                success: result.success,
                message: result.message,
                transaction_id: result.transaction_id,
                final_balance: result.final_balance
            });
        } 
        catch (error) 
        {
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    }
}

module.exports = WalletHandler;