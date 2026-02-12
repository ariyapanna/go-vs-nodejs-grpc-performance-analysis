(async() => {
    const path = require('path');

    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');
    
    const { createClient } = require('./grpc-client');
    
    const WalletService = require('./service');
    const WalletHandler = require('./handler');

    const WALLET_PROTO_PATH = path.join(__dirname, '..', 'proto', 'wallet.proto');
    const USER_PROTO_PATH = path.join(__dirname, '..', 'proto', 'user.proto');
    const LEDGER_PROTO_PATH = path.join(__dirname, '..', 'proto', 'ledger.proto');

    const userClient = createClient(USER_PROTO_PATH, 'user', 'UserService', 'USER_SERVICE', 'user-service:60051');
    const ledgerClient = createClient(LEDGER_PROTO_PATH, 'ledger', 'LedgerService', 'LEDGER_SERVICE', 'ledger-service:60052');

    const walletService = new WalletService(userClient, ledgerClient);
    const walletHandler = new WalletHandler(walletService);

    const packageDefinition = protoLoader.loadSync(WALLET_PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

    const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;

    const server = new grpc.Server();
    server.addService(walletProto.WalletService.service, {
        ProcessTransaction: walletHandler.processTransaction.bind(walletHandler)
    });

    const address = `0.0.0.0:60053`;

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Failed to bind server: ${err}`);
            return;
        }
        console.log(`💳 Wallet Service is running on port ${port}`);
    });
})()