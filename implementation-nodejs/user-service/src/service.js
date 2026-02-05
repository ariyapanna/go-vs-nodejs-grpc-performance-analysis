const userRepository = require('./repository');

class UserService
{
    async checkEligibility(userId, amountToSpend)
    {
        const user = await userRepository.findById(userId);
        if(!user)
            return { isValid: false }

        return {
            isValid: true,
            name: user.name,
            balanceSufficient: user.balance >= amountToSpend,
            currentBalance: user.balance
        }
    }

    async updateUserBalance(userId, amount, isCredit)
    {
        const user = await userRepository.findById(userId);
        if(!user)
            return { 
                status: false,
                message: 'User not found',
                balance: 0
            };

        if(!isCredit && user.balance < amount)
            return { 
                status: false,
                message: 'Insufficient balance for this transaction',
                balance: user.balance
            };

        const result = await userRepository.updateBalance(userId, amount, isCredit);
        if(!result.status)
            return { status: false, message: 'Failed to update balance', balance: user.balance };

        return { status: true, message: 'Balance updated successfully', balance: user.balance}
    }
}

module.exports = new UserService();