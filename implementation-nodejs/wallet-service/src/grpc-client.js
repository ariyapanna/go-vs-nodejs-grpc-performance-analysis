const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

module.exports = {
    createClient: (protoPath, packageName, serviceName, envKey, defaultAddress) => {
        const packageDefinition = protoLoader.loadSync(protoPath, {
            keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
        });
        
        const proto = grpc.loadPackageDefinition(packageDefinition);
        const address = process.env[envKey] || defaultAddress;

        return new proto[packageName][serviceName](
            address, 
            grpc.credentials.createInsecure()
        );
    }
}