#!/bin/bash

##############################################################################
# Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
##############################################################################

source ../../.env
cd $CERT_PATH

AUTH_ENCODED=`echo -n "${INVALID_BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}" | base64`

curl -i --location --cacert $CA_CERT_NAME --request POST "https://${EXTAUTHN_SERVER_HOST}:${EXTAUTHN_SERVER_PORT}/action" \
--header "Authorization: Basic ${AUTH_ENCODED}" \
--header 'Content-Type: application/json' \
--data-raw '{
    "operation": "password-verify",
    "parameters": {
      "username": "scott",
      "password": "scott11111"
    },
    "requestedAttributes": ["cn", "mobile_number", "displayName"]
}'