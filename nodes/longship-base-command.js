module.exports = function (RED) {
    class BaseLongshipCommand {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.server = RED.nodes.getNode(config.server);

            if (!this.server) {
                this.error("No configuration node");
                return;
            }

            if (!this.server.credentials || !this.server.credentials.tenantKey || !this.server.credentials.applicationKey) {
                this.error("Missing required credentials. Please check the configuration node settings.");
                this.status({ fill: "red", shape: "ring", text: "Missing credentials" });
                return;
            }

            this.on('input', this.handleInput.bind(this));
        }

        async handleInput(msg) {
            try {
                if (!msg.chargePointId) {
                    throw new Error('chargePointId is required in msg object');
                }

                const endpoint = this.getEndpoint(msg.chargePointId);
                const requestConfig = {
                    method: 'POST',
                    url: endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': this.server.credentials.tenantKey,
                        'x-api-key': this.server.credentials.applicationKey
                    },
                    body: msg.payload || {}
                };

                const response = await this.makeRequest(requestConfig);
                msg.payload = response;
                this.send(msg);
                this.status({ fill: "green", shape: "dot", text: "Success" });
            } catch (error) {
                this.error(error.message, msg);
                this.status({ fill: "red", shape: "ring", text: error.message });
            }
        }

        getEndpoint(chargePointId) {
            return `${this.server.baseUrl}/v1/chargepoints/${chargePointId}/${this.command}`;
        }

        async makeRequest(config) {
            const fetch = require('node-fetch');
            try {
                const response = await fetch(config.url, {
                    method: config.method,
                    headers: config.headers,
                    body: JSON.stringify(config.body)
                });

                let data = null;
                if (response.headers.get('content-length') !== '0') {
                    data = await response.json();
                }

                if (!response.ok) {
                    throw new Error(data?.message || `HTTP error! status: ${response.status}`);
                }

                // Extract messageId from location header if present
                const locationHeader = response.headers.get('location');
                if (locationHeader) {
                    try {
                        const url = new URL(`${this.server.baseUrl}${locationHeader}`);
                        const messageId = url.searchParams.get('messageId');
                        if (messageId) {
                            data = data || {};
                            data.messageId = messageId;
                        }
                    } catch (e) {
                        // Invalid URL format, skip extraction
                    }
                }

                return data;
            } catch (error) {
                throw error;
            }
        }
    }

    return BaseLongshipCommand;
}