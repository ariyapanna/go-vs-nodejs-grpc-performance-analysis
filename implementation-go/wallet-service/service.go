package wallet_service

import (
	"context"
	"fmt"
	"go-microtrans-grpc/ledger-service/pb/ledger"

	"go-microtrans-grpc/user-service/pb/user"
	"go-microtrans-grpc/wallet-service/pb/wallet"
)

type WalletService struct {
	userClient   user.UserServiceClient
	ledgerClient ledger.LedgerServiceClient
}

func (s *WalletService) checkEligibility(ctx context.Context, userId int64, amount float64) (*user.UserEligibilityResponse, error) {
	return s.userClient.ValidateUser(ctx, &user.UserEligibilityRequest{
		UserId:        userId,
		AmountToSpend: amount,
	})
}

func (s *WalletService) updateBalance(ctx context.Context, userId int64, amount float64, isCredit bool) (*user.UpdateBalanceResponse, error) {
	return s.userClient.UpdateUserBalance(ctx, &user.UpdateBalanceRequest{
		UserId:   userId,
		Amount:   amount,
		IsCredit: isCredit,
	})
}

func (s *WalletService) recordToLedger(ctx context.Context, transactionType int32, userId int64, amount float64, status bool) (*ledger.RecordTransactionResponse, error) {
	return s.ledgerClient.RecordTransaction(ctx, &ledger.RecordTransactionRequest{
		TransactionType: transactionType,
		UserId:          userId,
		Amount:          amount,
		Status:          status,
	})
}

func (s *WalletService) ExecuteTransaction(ctx context.Context, req *wallet.TransactionRequest) (*wallet.TransactionResponse, error) {
	userId := req.GetUserId()
	amount := req.GetAmount()
	transactionType := req.GetTransactionType()

	userCheck, err := s.checkEligibility(ctx, userId, amount)
	if err != nil {
		return nil, err
	}
	if !userCheck.GetIsValid() {
		return &wallet.TransactionResponse{
			Success: false,
			Message: fmt.Sprintf("Transaction failed due to user not found"),
		}, nil
	}

	isDebit := TransactionType(transactionType) != TopUp
	if isDebit && !userCheck.GetBalanceSufficient() {
		return &wallet.TransactionResponse{
			Success: false,
			Message: fmt.Sprintf("Transaction failed due to insufficient balance "),
		}, nil
	}

	updateRes, err := s.updateBalance(ctx, userId, amount, !isDebit)
	if err != nil {
		return nil, err
	}

	if !updateRes.GetStatus() {
		return &wallet.TransactionResponse{
			Success: false,
			Message: fmt.Sprintf("Transaction failed: %s", updateRes.GetMessage()),
		}, nil
	}

	ledgerRes, err := s.recordToLedger(ctx, transactionType, userId, amount, updateRes.GetStatus())
	if err != nil {
		return nil, err
	}

	return &wallet.TransactionResponse{
		Success:       true,
		Message:       "Transaction succeeded",
		TransactionId: ledgerRes.GetReferenceId(),
		FinalBalance:  updateRes.GetCurrentBalance(),
	}, nil
}

func NewWalletService(userClient user.UserServiceClient, ledgerClient ledger.LedgerServiceClient) *WalletService {
	return &WalletService{
		userClient:   userClient,
		ledgerClient: ledgerClient,
	}
}
