FROM ubuntu:24.04

RUN apt-get update && \
  apt-get install -y inotify-tools nodejs

COPY ./src/. /app
COPY ./package.json /app
COPY --chmod=755 ./devops/scripts/. /scripts

ENTRYPOINT [ "/scripts/notifytools.sh" ]

CMD [ "/app_data/payments", "payment", "--cba" ]