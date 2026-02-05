package ledger_service

import (
	"sync"
)

var transactionRecords = make(map[string]TransactionRecord)

type LedgerRepository struct {
	mu sync.RWMutex
}

func (r *LedgerRepository) RecordTransaction(id string, record TransactionRecord) TransactionRecord {
	r.mu.Lock()
	defer r.mu.Unlock()

	transactionRecords[id] = record
	return record
}

func NewLedgerRepository() *LedgerRepository {
	return &LedgerRepository{
		mu: sync.RWMutex{},
	}
}
