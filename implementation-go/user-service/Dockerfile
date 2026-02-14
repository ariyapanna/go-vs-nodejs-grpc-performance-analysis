FROM golang:alpine AS builder

WORKDIR /app

RUN apk add --no-cache git protobuf-dev

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

ENV PATH="$PATH:$(go env GOPATH)/bin"

COPY go.mod go.sum ./

RUN go mod download

COPY proto/ ./proto/
COPY implementation-go/user-service/ ./implementation-go/user-service/

RUN protoc --proto_path=./proto \
    --go_out=./implementation-go/user-service \
    --go-grpc_out=./implementation-go/user-service \
    ./proto/user.proto

RUN go build -o server ./implementation-go/user-service/cmd/main.go

RUN chmod +x /app/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 50051

CMD ["./server"]