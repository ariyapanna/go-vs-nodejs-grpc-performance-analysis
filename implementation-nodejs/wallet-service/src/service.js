const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH_USER = path.join(__dirname, '../../../proto/user.proto');
const PROTO_PATH_LEDGER = path.join(__dirname, '../../../proto/ledger.proto');

const packageDefinitionUser = protoLoader.loadSync(PROTO_PATH_USER, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const userProto = grpc.loadPackageDefinition(packageDefinitionUser).user;

const packageDefinitionLedger = protoLoader.loadSync(PROTO_PATH_LEDGER, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const ledgerProto = grpc.loadPackageDefinition(packageDefinitionLedger).ledger;
class WalletService {
    constructor() {
        // Initialize clients
        // Assuming default ports if not specified by env
        const userAddr = process.env.USER_SERVICE_ADDR || 'localhost:50051';
        const ledgerAddr = process.env.LEDGER_SERVICE_ADDR || 'localhost:50052';

        this.userClient = new userProto.UserService(userAddr, grpc.credentials.createInsecure());
        this.ledgerClient = new ledgerProto.LedgerService(ledgerAddr, grpc.credentials.createInsecure());
    }

    checkEligibility(userId, amount) {
        return new Promise((resolve, reject) => {
            this.userClient.ValidateUser({ user_id: userId, amount_to_spend: amount }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    updateBalance(userId, amount, isCredit) {
        return new Promise((resolve, reject) => {
            this.userClient.UpdateUserBalance({ user_id: userId, amount: amount, is_credit: isCredit }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    recordToLedger(transactionType, userId, amount, status) {
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

    async executeTransaction(userId, amount, transactionType) {
        try {
            // 1. Check Eligibility
            const userCheck = await this.checkEligibility(userId, amount);

            if (!userCheck.is_valid) {
                return {
                    success: false,
                    message: "Transaction failed due to user not found",
                    transaction_id: "",
                    final_balance: 0
                };
            }

            // TransactionType enum: 2 is TopUp. 
            // In Go: isDebit := TransactionType(transactionType) != TopUp
            const isDebit = transactionType !== 2;

            if (isDebit && !userCheck.balance_sufficient) {
                return {
                    success: false,
                    message: "Transaction failed due to insufficient balance ",
                    transaction_id: "",
                    final_balance: 0
                };
            }

            // 2. Update Balance
            // !isDebit because if it is debit, we want isCredit = false
            const updateRes = await this.updateBalance(userId, amount, !isDebit);

            if (!updateRes.status) {
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

        } catch (error) {
            console.error("ExecuteTransaction error:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = new WalletService();