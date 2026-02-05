package ledger_service

import (
	"fmt"
	"math/rand"
	"time"
)

type LedgerService struct {
	repo *LedgerRepository
}

func (s *LedgerService) CreateTransactionRecord(transactionType int32, userId int64, amount float64, status bool) (bool, TransactionRecord) {
	transactionId := fmt.Sprintf("TX-%d-%d", time.Now().UnixNano(), rand.Int63n(1000))
	record := TransactionRecord{
		ID:              transactionId,
		TransactionType: transactionType,
		UserID:          userId,
		Amount:          amount,
		Status:          status,
		CreatedAt:       time.Now().Format(time.RFC3339),
	}

	return true, s.repo.RecordTransaction(transactionId, record)
}

func NewLedgerService() *LedgerService {
	return &LedgerService{
		repo: NewLedgerRepository(),
	}
}
