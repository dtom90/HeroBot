#!/bin/sh
set -ex

docker build -t herobot . && \
docker run \
-d \
--rm \
--name herobot \
-p 9001:80 \
herobot
