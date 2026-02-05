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
    
    Wallet->>User: ValidateUser(user_id, amount_to_spend)
 
    alt Invalid User / Insufficient Balance
        User-->>Wallet: Valid: false
        Wallet-->>Client: { "success": false, "message": "Insufficient balance", ... }
    else User Valid
        User-->>Wallet: Valid: true
        
        Note over Wallet, User: Attempting Balance Update
        Wallet->>User: UpdateUserBalance(user_id, amount, is_credit)
        
        alt Update Fail
            User-->>Wallet: UpdateSuccess: false
            Wallet-->>Client: { "success": false, "message": "Transaction failed: Failed to update balance", "final_balance": 0 }
        else Update Success
            User-->>Wallet: UpdateSuccess: true (NewBalance: 500)
            
            Wallet->>Ledger: RecordTransaction(transaction_type, user_id, amount, status)
            Ledger-->>Wallet: Logged: true (ID: TX-99)
            
            Wallet-->>Client: { "success": true, "message": "Success", "transaction_id": "TX-99", "final_balance": 500 }
        end
    end
    
    deactivate Wallet
```

## ⚙ Tech Stack
- **Language A:** Go (Native gRPC implementation)
- **Language B:** Node.js (@grpc/grpc-js)
- **Protocol:** Protocol Buffers (v3)
- **Benchmarking Tool:** ghz