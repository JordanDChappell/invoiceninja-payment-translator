# invoiceninja-payment-translator

## Docker

### Build
docker build -t invoiceninja-payment-translator -f ./devops/docker/Dockerfile

### Run
docker run --rm --name invoiceninja-translator --mount type=bind,src="/invoiceninja/data/payments",target="/app_data/payments" invoiceninja-payment-translator /app_data/payments payment cba