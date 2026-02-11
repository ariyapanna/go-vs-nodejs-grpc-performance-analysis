module.exports = class UserRepository {
    constructor() {
        this.users = new Map();
        this.seedData();
    }

    seedData() {
        console.log('🌱 Seeding User Data');
        for (let i = 1; i <= 100000; i++) {
            const id = BigInt(i);
            let balance = 1000000;

            if (i % 10 == 0)
                balance = 100;

            this.users.set(id, {
                id,
                balance,
                name: `User-${i}`,
            })
        }
    }

    async findById(userId) {
        return this.users.get(BigInt(userId));
    }

    async updateBalance(userId, amount, isCredit) {
        const user = users.get(BigInt(userId));
        if (!user)
            return { status: false, newBalance: 0 };

        if (isCredit) {
            user.balance += amount;
        } else {
            if (user.balance < amount)
                return { status: false, newBalance: user.balance };

            user.balance -= amount;
        }

        return { status: true, newBalance: user.balance };
    }
}