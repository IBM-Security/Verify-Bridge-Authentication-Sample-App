#!/bin/bash

##############################################################################
# Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
##############################################################################

set -e

source .env

if [ ! -z $BRIDGE_AGENT_IP ]
then
BRIDGE_AGENT_IP="IP.2 = ${BRIDGE_AGENT_IP}"
fi

if [ ! -z $BRIDGE_AGENT_DNS ]
then
BRIDGE_AGENT_DNS="DNS.2 = ${BRIDGE_AGENT_DNS}"
fi

if [ ! -z $WEB_SERVER_IP ]
then
WEB_SERVER_IP="IP.2 = ${WEB_SERVER_IP}"
fi

if [ ! -z $WEB_SERVER_DNS ]
then
WEB_SERVER_DNS="DNS.2 = ${WEB_SERVER_DNS}"
fi

rm -f *.conf
rm -f *.cfg
rm -f *.csr
rm -f *.srl
rm -f *.p12


COMMON='127.0.0.1'

ca_key='extauthn.caroot.key'
ca_cert='extauthn.caroot.crt'
aliaz='extauthnCA'

sslcfg='./ssl.cfg'
# Generate CA certificate	# Generate CA certificate
echo "[req]" > $sslcfg
echo "distinguished_name=req" >> $sslcfg
echo "req_extensions=san"
echo "[san]" >> $sslcfg
echo "subjectAltName=@alt_names" >> $sslcfg
echo "subjectKeyIdentifier=hash" >> $sslcfg
echo "[alt_names]" >> $sslcfg
echo "DNS.1=localhost" >> $sslcfg
echo "IP.1=$COMMON" >> $sslcfg
openssl req -x509 -nodes -newkey rsa:2048 -subj "/C=$COUNTRY/ST=$STATE/L=$LOCATION/O=$ORGANIZATION" -keyout $ca_key -out $ca_cert


echo ""
echo "Generating external agent server public/private key pair certs"
echo ""

aliaz='extauthn.agent'
COMMON=$CN_AGENT
cert_request="csr.${aliaz}.conf"
cert_conf="cert.${aliaz}.conf"

# Generate External Agent Server Private key 

echo ""
echo "Generating external agent private key"
echo ""
openssl genrsa -out ${aliaz}.key 2048


# Create External Agent Server csf conf

cat > ${cert_request} <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn
[ dn ]
C = ${COUNTRY}
ST = ${STATE}
O = ${ORGANIZATION}
OU = ${ORGANIZATIONAL_UNIT}
CN = ${COMMON}
[ req_ext ]
subjectAltName = @alt_names
[ alt_names ]
DNS.1 = localhost
IP.1 = 127.0.0.1
${WEB_SERVER_IP}
${WEB_SERVER_DNS}
EOF


# create External Agent Server CSR request using private key

openssl req -new -key ${aliaz}.key -out ${aliaz}.csr -config ${cert_request}


cat > ${cert_conf} <<EOF

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
${WEB_SERVER_IP}
${WEB_SERVER_DNS}

EOF

# Create SSl with self signed CA

openssl x509 -req \
    -in ${aliaz}.csr \
    -CA ${ca_cert} -CAkey ${ca_key} \
    -CAcreateserial -out ${aliaz}.crt \
    -days 365 \
    -sha256 -extfile ${cert_conf}


echo ""
echo "Generating external agent client public/private key pair certs"
echo ""

aliaz='extauthn.client'
COMMON=$CN_CLIENT
cert_request="csr.${aliaz}.conf"
cert_conf="cert.${aliaz}.conf"

# Generate External Agent Client Private key 

echo ""
echo "Generating external agent client private key"
echo ""
openssl genrsa -out ${aliaz}.key 2048


# Create External Agent Client csf conf

cat > ${cert_request} <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn
[ dn ]
C = ${COUNTRY}
ST = ${STATE}
O = ${ORGANIZATION}
OU = ${ORGANIZATIONAL_UNIT}
CN = ${COMMON}
[ req_ext ]
subjectAltName = @alt_names
[ alt_names ]
DNS.1 = localhost
IP.1 = 127.0.0.1
${BRIDGE_AGENT_IP}
${BRIDGE_AGENT_DNS}
EOF


# create External Agent Server CSR request using private key

openssl req -new -key ${aliaz}.key -out ${aliaz}.csr -config ${cert_request}


cat > ${cert_conf} <<EOF

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
${BRIDGE_AGENT_IP}
${BRIDGE_AGENT_DNS}

EOF

# Create SSl with self signed CA

openssl x509 -req \
    -in ${aliaz}.csr \
    -CA ${ca_cert} -CAkey ${ca_key} \
    -CAcreateserial -out ${aliaz}.crt \
    -days 365 \
    -sha256 -extfile ${cert_conf}


# Create the windows pkcs12's
echo "Generating pkcs12's"
openssl pkcs12 -export -out extauthn.agent.p12 -in extauthn.agent.crt -inkey extauthn.agent.key -password pass:
openssl pkcs12 -export -out extauthn.client.p12 -in extauthn.client.crt -inkey extauthn.client.key -password pass: