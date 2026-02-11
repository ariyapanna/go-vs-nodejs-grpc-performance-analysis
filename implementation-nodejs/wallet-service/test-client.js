const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../proto/wallet.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;

const client = new walletProto.WalletService('localhost:50053', grpc.credentials.createInsecure());

const request = {
    user_id: 1,
    transaction_type: 2, // TopUp
    amount: 100.0
};

console.log("Sending request:", request);

client.ProcessTransaction(request, (err, response) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Response:", response);
    }
});
