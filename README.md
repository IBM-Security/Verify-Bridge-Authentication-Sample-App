
# Verify Bridge for Authentication Sample App
This repository contains a sample implementation of an *external agent web service* that can be used in conjunction with the [IBM Verify Bridge](https://www.ibm.com/docs/en/security-verify?topic=integrations-security-verify-bridge). This sample application is intended for use as a reference for developers wishing to implement their own external agent web service. Please refer to the [developer guide]() for comprehensive details on developing an external agent web service. 

## Prerequisites
* [Node.js](https://nodejs.org/) version 16.14.0 or higher
* A bash  compatible environment

## Generating the TLS certificates
The sample application requires TLS certificates to run. A helper script has been included to generate the needed certificates in the `certs.sh` file. To generate these certificates, navigate to `sample-application/certs`, create the default configuration file by copying `.env_example` to `.env` and then run the `certs.sh` helper script: 

```bash
cd sample-application/certs/
cp .env_example .env
bash certs.sh
```

The created `.env` file contains the default configuration options used during TLS certificate generation. Refer to the [developer guide]() for more information on using and configuring TLS certificates. 
## Running the sample application 
After generating the sample certificates, navigate to the `sample-application/` directory and create the default configuration file by copying `.env_example` to `.env`:

```bash 
cd sample-application
cp .env_example .env
```

The `.env` file contains the configuration options used by the sample application. 

Install the required packages and start the sample application:

```bash
npm install
npm start
```

The sample application server should now be listening on port 8555 (the port specified in the created `.env` file), you should see a message like:

```bash
HTTPS Listening on port          8555
```

The sample application is a web server designed for use in conjunction with the Verify Bridge and provides a REST interface intended to receive requests from the *bridge agent*. For more information about simulating requests from the bridge agent or running the bridge agent with a live ISV tenant, please refer to our full [developer guide]().

# develop 
a