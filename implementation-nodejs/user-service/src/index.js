(async() => {
    const path = require('path');

    const grpc = require('@grpc/grpc-js');
    const protoLoader = require('@grpc/proto-loader');

    const protoLoaderConfig = {
        keepCase: true, // Preserve field names. The default is to change them to camel case.
        longs: String, // The type to use to represent long values. Defaults to a Long object type.
        enums: String, // The type to use to represent enum values. Defaults to the numeric value.
        defaults: true, // Set default values on output objects. Defaults to false.
        oneofs: true // Set virtual oneof properties to the present field's name. Defaults to false.
    }

    const PROTO_PATH = path.join(__dirname, '..', 'proto', 'user.proto');

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, protoLoaderConfig);
    const userProto = grpc.loadPackageDefinition(packageDefinition).user;

    const userHandler = require('./handler');

    const server = new grpc.Server();
    server.addService(userProto.UserService.service, userHandler);

    const serverAddress = `0.0.0.0:60051`;
    server.bindAsync(serverAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if(error)
            throw error;

        console.log(`👤 User Service is running on port ${port}`);
        server.start();
    });
})()