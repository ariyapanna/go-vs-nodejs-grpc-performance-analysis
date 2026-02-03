# Go vs Node.js gRPC Performance Evaluation
> This repository contains a comparative study designed to evaluate the performance of gRPC as a communication protocol within a microservices ecosystem. By implementing a three-tier chained service architecture (User, Wallet, and Ledger Services) in both Go and Node.js, this project analyzes key performance metrics such as latency distribution, throughput, and resource utilization under various stress-load scenarios.

## 🧱 Microservices Interaction Overview
```mermaid
sequenceDiagram
    participant Client as Benchmarking Tool (ghz)
    participant Wallet as Wallet Service (Orchestrator)
    participant User as User Service
    participant Ledger as Ledger Service

    Note over Client: Data: user_id, amount, type
    Client->>Wallet: ProcessTransaction(user_id, amount, type)
    activate Wallet
    
    Wallet->>User: ValidateUser(user_id)
    User-->>Wallet: UserValid: true
    
    Note over Wallet: In-memory balance mutation<br/>to isolate gRPC performance
    
    Wallet->>Ledger: RecordActivity(user_id, amount, type)
    Ledger-->>Wallet: Logged: true (ID: TX-99)
    
    Wallet-->>Client: TransactionResponse(Success, TX-99)
    deactivate Wallet
```

## ⚙ Tech Stack
- **Language A:** Go (Native gRPC implementation)
- **Language B:** Node.js (@grpc/grpc-js)
- **Protocol:** Protocol Buffers (v3)
- **Benchmarking Tool:** ghz