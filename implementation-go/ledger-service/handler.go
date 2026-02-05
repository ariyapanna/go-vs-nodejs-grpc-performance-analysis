package ledger_service

import (
	"context"
	"go-microtrans-grpc/ledger-service/pb/ledger"
)

type LedgerHandler struct {
	ledger.UnimplementedLedgerServiceServer
	service *LedgerService
}

func (h *LedgerHandler) RecordTransaction(ctx context.Context, req *ledger.RecordTransactionRequest) (*ledger.RecordTransactionResponse, error) {
	logged, transactionLog := h.service.CreateTransactionRecord(
		req.GetTransactionType(),
		req.GetUserId(),
		req.GetAmount(),
		req.GetStatus(),
	)

	return &ledger.RecordTransactionResponse{
		Logged:      logged,
		ReferenceId: transactionLog.ID,
	}, nil
}

func NewLedgerHandler() *LedgerHandler {
	return &LedgerHandler{
		service: NewLedgerService(),
	}
}
