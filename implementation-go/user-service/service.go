package user_service

import "log"

type UserService struct {
	repo *UserRepository
}

func (s *UserService) CheckUserEligibility(id int64, amount float64) (*User, bool, error) {
	user := s.repo.FindById(id)
	if user == nil {
		return nil, false, nil
	}

	return user, user.Balance > amount, nil
}

func (s *UserService) UpdateUserBalance(id int64, amount float64, isCredit bool) (status bool, message string, newBalance float64) {
	user := s.repo.FindById(id)
	if user == nil {
		return false, "User not found", 0
	}

	if !isCredit && user.Balance < amount {
		return false, "Insufficient balance for this transaction", user.Balance
	}

	status, newBalance = s.repo.UpdateBalance(id, amount, isCredit)
	if !status {
		return false, "Failed to update balance", user.Balance
	}

	return true, "Balance updated successfully", newBalance
}

func NewUserService() *UserService {
	return &UserService{
		repo: NewUserRepository(),
	}
}
