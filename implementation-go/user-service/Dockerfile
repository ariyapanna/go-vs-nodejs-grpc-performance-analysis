FROM golang:alpine AS builder

WORKDIR /app

RUN apk add --no-cache git protobuf-dev protoc-gen-go protoc-gen-go-grpc

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN protoc --proto_path=./proto \
    --go_out=./implementation-go/ledger-service \
    --go-grpc_out=./implementation-go/ledger-service \
    ./proto/ledger.proto

RUN go build -o server ./implementation-go/user-service/cmd/main.go

RUN chmod +x /app/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 50051

CMD ["./server"]