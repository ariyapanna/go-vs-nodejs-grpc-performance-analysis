package main

import (
	"fmt"
	"go-microtrans-grpc/ledger-service/pb/ledger"
	"go-microtrans-grpc/user-service/pb/user"
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	walletservice "go-microtrans-grpc/wallet-service"
	"go-microtrans-grpc/wallet-service/pb/wallet"
)

func main() {
	userAddr := os.Getenv("USER_SERVICE_ADDR")
	if userAddr == "" {
		userAddr = "localhost:50051"
	}

	userConn, err := grpc.NewClient(userAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("❌ Failed to connect to User Service: %v", err)
	}
	userClient := user.NewUserServiceClient(userConn)

	ledgerAddr := os.Getenv("LEDGER_SERVICE_ADDR")
	if ledgerAddr == "" {
		ledgerAddr = "localhost:50052"
	}

	ledgerConn, err := grpc.NewClient(ledgerAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("❌ Failed to connect to Ledger Service: %v", err)
	}
	ledgerClient := ledger.NewLedgerServiceClient(ledgerConn)

	walletService := walletservice.NewWalletService(userClient, ledgerClient)
	walletHandler := walletservice.NewWalletHandler(walletService)

	port := 50053
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("❌ Failed to listen: %v", err)
	}

	server := grpc.NewServer()

	wallet.RegisterWalletServiceServer(server, walletHandler)

	log.Printf(fmt.Sprintf("💳 Wallet Service is running on port %d", port))
	if err := server.Serve(listener); err != nil {
		log.Fatalf("❌ Failed to serve: %v", err)
	}
}
