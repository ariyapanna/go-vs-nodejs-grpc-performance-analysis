const { TransactionType } = require("./constant");

class WalletService 
{
    constructor(userServiceClient, ledgerServiceClient) 
    {
        this.userClient = userServiceClient;
        this.ledgerClient = ledgerServiceClient;
    }

    checkEligibility(userId, amount) 
    {
        return new Promise((resolve, reject) => {
            this.userClient.ValidateUser({ user_id: userId, amount_to_spend: amount }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    updateBalance(userId, amount, isCredit) 
    {
        return new Promise((resolve, reject) => {
            this.userClient.UpdateUserBalance({ user_id: userId, amount: amount, is_credit: isCredit }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    recordToLedger(transactionType, userId, amount, status) 
    {
        return new Promise((resolve, reject) => {
            this.ledgerClient.RecordTransaction({
                transaction_type: transactionType,
                user_id: userId,
                amount: amount,
                status: status
            }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    async executeTransaction(userId, amount, transactionType) 
    {
        try 
        {
            // 1. Check Eligibility
            const userCheck = await this.checkEligibility(userId, amount);

            if (!userCheck.is_valid) 
            {
                return {
                    success: false,
                    message: "Transaction failed due to user not found",
                    transaction_id: "",
                    final_balance: 0
                };
            }

            const isDebit = transactionType !== TransactionType.TopUp;

            if (isDebit && !userCheck.balance_sufficient) 
            {
                return {
                    success: false,
                    message: "Transaction failed due to insufficient balance ",
                    transaction_id: "",
                    final_balance: 0
                };
            }

            // 2. Update Balance
            const updateRes = await this.updateBalance(userId, amount, !isDebit);

            if (!updateRes.status) 
            {
                return {
                    success: false,
                    message: `Transaction failed: ${updateRes.message}`,
                    transaction_id: "",
                    final_balance: 0
                };
            }

            // 3. Record to Ledger
            const ledgerRes = await this.recordToLedger(transactionType, userId, amount, updateRes.status);

            return {
                success: true,
                message: "Transaction succeeded",
                transaction_id: ledgerRes.reference_id,
                final_balance: updateRes.current_balance
            };

        } 
        catch (error) 
        {
            console.error("ExecuteTransaction error:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = WalletService;