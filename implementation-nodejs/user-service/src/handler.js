const grpc = require('@grpc/grpc-js');
const userService = require('./service');

module.exports = {
    validateUser: async (call, callback) => {
        try 
        {
            const { user_id, amount_to_spend } = call.request;

            if(user_id <= 0) 
            {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid User ID"
                });
            }

            if(amount_to_spend <= 0) 
            {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid amount to spend"
                })
            }

            const result = await userService.checkEligibility(user_id, amount_to_spend);
            return callback(null, {
                is_valid: result.isValid,
                name: result.name || "",
                balance_sufficient: result.balanceSufficient,
                current_balance: result.currentBalance
            });
        }
        catch(error)
        {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    updateUserBalance: async (call, callback) => {
        try
        {
            const { user_id, amount, is_credit } = call.request;

            if(user_id <= 0) 
            {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid User ID"
                });
            }

            if(amount <= 0) 
            {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid amount"
                })
            }

            const result = await userService.updateUserBalance(user_id, amount, is_credit);
            return callback(null, {
                status: result.status,
                message: result.message,
                current_balance: result.balance
            });
        }
        catch(error)
        {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    }
}