FROM golang:alpine AS builder

WORKDIR /app/implementation-go

RUN apk add --no-cache git protobuf-dev

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

ENV PATH="$PATH:$(go env GOPATH)/bin"

COPY implementation-go/go.mod implementation-go/go.sum ./

RUN go mod download

COPY proto/ ./proto/
COPY implementation-go/ .

RUN protoc --proto_path=./proto \
    --go_out=./implementation-go/ledger-service \
    --go-grpc_out=./implementation-go/ledger-service \
    ./proto/ledger.proto

RUN go build -o server ./ledger-service/cmd/main.go

RUN chmod +x /app/server

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 50052

CMD ["./server"]