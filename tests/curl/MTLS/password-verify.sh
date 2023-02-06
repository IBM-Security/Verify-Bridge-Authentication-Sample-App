#!/bin/bash

##############################################################################
# Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
##############################################################################

source ../../.env
cd $CERT_PATH

curl -i --location --cert ${CLIENT_CERT_NAME} --key ${CLIENT_CERT_KEY} --cacert $CA_CERT_NAME --request POST "https://${EXTAUTHN_SERVER_HOST}:${EXTAUTHN_SERVER_PORT}/action" \
--header 'Content-Type: application/json' \
--data-raw '{
    "operation": "password-verify",
    "parameters": {
      "username": "scott",
      "password": "scott11111"
    },
    "requestedAttributes": ["cn", "mobile_number", "displayName"]
}'