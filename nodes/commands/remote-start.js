module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class RemoteStartCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);

            this.command = 'remotestart';
            this.connectorId = config.connectorId;
            this.idTag = config.idTag;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Use payload values if provided, otherwise use configured values
            const connectorId = msg.payload.connectorId || this.connectorId;
            const idTag = msg.payload.idTag || this.idTag;

            // Validate connector ID
            if (!connectorId || connectorId < 1) {
                throw new Error('Connector ID must be a positive number');
            }

            // Construct the payload
            msg.payload = {
                connectorId: connectorId
            };

            // Add idTag if provided
            if (idTag) {
                msg.payload.idTag = idTag;
            }

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-remote-start", RemoteStartCommand);
}