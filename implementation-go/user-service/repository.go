package user_service

import (
	"fmt"
	"log"
	"sync"
)

var users = make(map[int64]User)

type UserRepository struct {
	mu sync.RWMutex
}

func (r *UserRepository) FindById(userId int64) *User {
	r.mu.RLock()
	defer r.mu.RUnlock()

	value, exists := users[userId]
	if exists {
		return &value
	}
	return nil
}

func (r *UserRepository) UpdateBalance(userId int64, amount float64, isCredit bool) (status bool, newBalance float64) {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, exists := users[userId]
	if !exists {
		return false, 0
	}

	if isCredit {
		user.Balance += amount
	} else {
		if user.Balance < amount {
			return false, user.Balance
		}
		user.Balance -= amount
	}

	users[userId] = user

	return true, user.Balance
}

func NewUserRepository() *UserRepository {
	log.Println("🌱 Seeding User Data")
	for i := int64(1); i <= 100000; i++ {
		var balance float64
		if i%10 == 0 {
			balance = 100
		} else {
			balance = 1000000
		}

		users[i] = User{
			ID:      i,
			Name:    fmt.Sprintf("User-%d", i),
			Balance: balance,
		}
	}

	return &UserRepository{
		mu: sync.RWMutex{},
	}
}
