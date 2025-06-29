module.exports = function (RED) {
    class GetChargepointMessagesNode {
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

            // Store configured values
            this.skip = config.skip || 0;
            this.take = config.take || 50;
            this.responseOnly = config.responseOnly || false;
            this.requestOnly = config.requestOnly || false;
            this.chargerToCpoOnly = config.chargerToCpoOnly || false;
            this.cpoToChargerOnly = config.cpoToChargerOnly || false;

            this.on('input', this.handleInput.bind(this));
        }

        async handleInput(msg) {
            try {
                if (!msg.chargePointId) {
                    throw new Error('chargePointId is required in msg object');
                }

                // Build query parameters
                const queryParams = this.buildQueryParams(msg);
                const endpoint = this.getEndpoint(msg.chargePointId, queryParams);

                const requestConfig = {
                    method: 'GET',
                    url: endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': this.server.credentials.tenantKey,
                        'x-api-key': this.server.credentials.applicationKey
                    }
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

        buildQueryParams(msg) {
            const params = new URLSearchParams();
            const payload = msg.payload || {};

            // Use payload values if provided, otherwise use configured values
            const skip = payload.skip !== undefined ? payload.skip : this.skip;
            const take = payload.take !== undefined ? payload.take : this.take;
            const responseOnly = payload.responseOnly !== undefined ? payload.responseOnly : this.responseOnly;
            const requestOnly = payload.requestOnly !== undefined ? payload.requestOnly : this.requestOnly;
            const chargerToCpoOnly = payload.chargerToCpoOnly !== undefined ? payload.chargerToCpoOnly : this.chargerToCpoOnly;
            const cpoToChargerOnly = payload.cpoToChargerOnly !== undefined ? payload.cpoToChargerOnly : this.cpoToChargerOnly;

            // Add pagination parameters
            if (skip > 0) params.append('skip', skip.toString());
            if (take > 0) params.append('take', Math.min(take, 100).toString());

            // Add filter parameters
            if (payload.search) params.append('search', payload.search);
            if (payload.from) params.append('from', payload.from);
            if (payload.to) params.append('to', payload.to);
            if (payload.transactionId) params.append('transactionId', payload.transactionId);
            if (payload.messageId) params.append('messageId', payload.messageId);

            // Add boolean filter parameters
            if (responseOnly) params.append('responseOnly', 'true');
            if (requestOnly) params.append('requestOnly', 'true');
            if (chargerToCpoOnly) params.append('chargerToCpoOnly', 'true');
            if (cpoToChargerOnly) params.append('cpoToChargerOnly', 'true');

            return params;
        }

        getEndpoint(chargePointId, queryParams) {
            const baseUrl = `${this.server.baseUrl}/v1/chargepoints/${chargePointId}/messages`;
            const queryString = queryParams.toString();
            return queryString ? `${baseUrl}?${queryString}` : baseUrl;
        }

        async makeRequest(config) {
            const fetch = require('node-fetch');
            try {
                const response = await fetch(config.url, {
                    method: config.method,
                    headers: config.headers
                });

                let data = null;
                if (response.headers.get('content-length') !== '0') {
                    data = await response.json();
                }

                if (!response.ok) {
                    throw new Error(data?.message || `HTTP error! status: ${response.status}`);
                }

                // Add pagination info from headers if available
                const linkHeader = response.headers.get('link');
                if (linkHeader && data) {
                    data._pagination = {
                        nextPage: linkHeader
                    };
                }

                return data;
            } catch (error) {
                throw error;
            }
        }
    }

    RED.nodes.registerType("longship-get-chargepoint-messages", GetChargepointMessagesNode);
} 