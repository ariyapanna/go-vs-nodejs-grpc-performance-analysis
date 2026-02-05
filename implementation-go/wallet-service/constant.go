package wallet_service

type TransactionType int32

const (
	Unknown                   TransactionType = iota
	Misc                      TransactionType = 1
	TopUp                     TransactionType = 2
	PaymentParking            TransactionType = 3
	PaymentMarketplace        TransactionType = 4
	PaymentAdvertisementClick TransactionType = 5
)
