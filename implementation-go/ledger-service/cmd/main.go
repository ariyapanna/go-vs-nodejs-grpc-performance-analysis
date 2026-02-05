package main

import (
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	ledgerservice "go-microtrans-grpc/ledger-service"
	"go-microtrans-grpc/ledger-service/pb/ledger"
)

func main() {
	port := 50052
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("❌ Failed to listen: %v", err)
	}

	server := grpc.NewServer()

	handler := ledgerservice.NewLedgerHandler()
	ledger.RegisterLedgerServiceServer(server, handler)

	log.Printf(fmt.Sprintf("📃 Ledger Service is running on port %d", port))
	if err := server.Serve(listener); err != nil {
		log.Fatalf("❌ Failed to serve: %v", err)
	}
}
