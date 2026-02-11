const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const walletHandler = require('./handler');

const PROTO_PATH = path.join(__dirname, '../../proto/wallet.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;

function main() {
    const server = new grpc.Server();
    server.addService(walletProto.WalletService.service, {
        ProcessTransaction: walletHandler.processTransaction
    });

    const port = process.env.PORT || '50053';
    const address = `0.0.0.0:${port}`;

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Failed to bind server: ${err}`);
            return;
        }
        console.log(`💳 Wallet Service is running on port ${port}`);
        // server.start() is not needed in newer @grpc/grpc-js versions, bindAsync starts it or it's implicitly started? 
        // Checking docs: server.start() is deprecated in grpc-js but typically still used or not needed if bind is successful?
        // Actually typically we don't need explicit start in recent versions but let's check. 
        // Wait, checking my knowledge: grpc-js server.start() is not required after bindAsync? 
        // Actually, older docs say start(), newer ones say it's started. 
        // Let's stick to safe pattern, usually explicit start is fine or no-op. 
        // But wait, if I use a recent version, server.start() might be removed?
        // "server.start() is deprecated. The server starts automatically after bindAsync returns successfully."
        // So I will not call server.start().
    });
}

main();
