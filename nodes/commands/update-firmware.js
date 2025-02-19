module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class UpdateFirmwareCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'updatefirmware';
            this.location = config.location;
            this.retries = config.retries;
            this.retrieveDate = config.retrieveDate;
            this.retryInterval = config.retryInterval;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Required parameter: location
            const location = msg.payload.location || this.location;
            if (!location) {
                throw new Error('location is required either in msg.payload or node configuration');
            }

            // Build the payload with optional parameters
            const payload = {
                location: location
            };

            // Add optional parameters if they exist in either msg.payload or node config
            if (msg.payload.retries !== undefined || this.retries !== undefined) {
                payload.retries = msg.payload.retries || this.retries;
            }

            if (msg.payload.retrieveDate || this.retrieveDate) {
                payload.retrieveDate = msg.payload.retrieveDate || this.retrieveDate;
            }

            if (msg.payload.retryInterval !== undefined || this.retryInterval !== undefined) {
                payload.retryInterval = msg.payload.retryInterval || this.retryInterval;
            }

            msg.payload = payload;
            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-update-firmware", UpdateFirmwareCommand);
}