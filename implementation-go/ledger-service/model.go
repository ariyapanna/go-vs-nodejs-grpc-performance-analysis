package ledger_service

type TransactionRecord struct {
	ID              string
	TransactionType int32
	UserID          int64
	Amount          float64
	Status          bool
	CreatedAt       string
}
