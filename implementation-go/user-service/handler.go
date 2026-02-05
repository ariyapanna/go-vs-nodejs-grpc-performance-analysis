package user_service

import (
	"context"
	"go-microtrans-grpc/user-service/pb/user"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type UserHandler struct {
	user.UnimplementedUserServiceServer
	service *UserService
}

func (h *UserHandler) ValidateUser(ctx context.Context, req *user.UserEligibilityRequest) (*user.UserEligibilityResponse, error) {
	userId := req.GetUserId()
	amountToSpend := req.GetAmountToSpend()

	if userId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid User ID")
	}

	if amountToSpend <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid amount to spend")
	}

	targetUser, eligible, _ := h.service.CheckUserEligibility(userId, amountToSpend)
	if targetUser == nil {
		return &user.UserEligibilityResponse{
			IsValid: false,
		}, nil
	}

	return &user.UserEligibilityResponse{
		IsValid:           true,
		Name:              targetUser.Name,
		CurrentBalance:    targetUser.Balance,
		BalanceSufficient: eligible,
	}, nil
}

func (h *UserHandler) UpdateUserBalance(ctx context.Context, req *user.UpdateBalanceRequest) (*user.UpdateBalanceResponse, error) {
	userId := req.GetUserId()
	amount := req.GetAmount()
	isCredit := req.GetIsCredit()

	if userId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid User ID")
	}

	if amount <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid amount")
	}

	status, message, newBalance := h.service.UpdateUserBalance(userId, amount, isCredit)
	return &user.UpdateBalanceResponse{
		Status:         status,
		Message:        message,
		CurrentBalance: newBalance,
	}, nil
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		service: NewUserService(),
	}
}
