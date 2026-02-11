(async() => {
    const path = require('path');

    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');

    const protoLoaderConfig = {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }

    const PROTO_PATH = path.join(__dirname, '..', 'proto', 'ledger.proto');

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, protoLoaderConfig);
    const ledgerProto = grpc.loadPackageDefinition(packageDefinition).ledger;

    const ledgerHandler = require('./handler');

    const server = new grpc.Server();
    server.addService(ledgerProto.LedgerService.service, ledgerHandler);

    const serverAddress = `0.0.0.0:60052`;
    server.bindAsync(serverAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if(error)
            throw error;

        console.log(`💰 Ledger Service is running on port ${port}`);
        server.start();
    });
})()