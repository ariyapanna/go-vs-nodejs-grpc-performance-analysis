package wallet_service

import (
	"context"
	"go-microtrans-grpc/wallet-service/pb/wallet"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type WalletHandler struct {
	wallet.UnimplementedWalletServiceServer
	service *WalletService
}

func (h *WalletHandler) ProcessTransaction(ctx context.Context, req *wallet.TransactionRequest) (*wallet.TransactionResponse, error) {
	userId := req.GetUserId()
	amount := req.GetAmount()
	transactionType := req.GetTransactionType()

	if userId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "User ID invalid")
	}

	if amount <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Amount must be positive")
	}

	if TransactionType(transactionType) == Unknown {
		return nil, status.Error(codes.InvalidArgument, "Transaction type invalid")
	}

	return h.service.ExecuteTransaction(ctx, req)
}

func NewWalletHandler(service *WalletService) *WalletHandler {
	return &WalletHandler{
		service: service,
	}
}
