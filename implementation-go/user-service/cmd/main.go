package main

import (
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	userservice "go-microtrans-grpc/user-service"
	"go-microtrans-grpc/user-service/pb/user"
)

func main() {
	port := 50051
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("❌ Failed to listen: %v", err)
	}

	server := grpc.NewServer()

	handler := userservice.NewUserHandler()
	user.RegisterUserServiceServer(server, handler)

	log.Printf(fmt.Sprintf("👤 User Service is running on port %d", port))
	if err := server.Serve(listener); err != nil {
		log.Fatalf("❌ Failed to serve: %v", err)
	}
}
