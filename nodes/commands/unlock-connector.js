module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class UnlockConnectorCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'unlockconnector';
            this.connectorId = config.connectorId;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Use payload connectorId if provided, otherwise use configured value
            const connectorId = msg.payload.connectorId || this.connectorId;

            // Validate connector ID
            if (!connectorId || typeof connectorId !== 'number' || connectorId < 1) {
                throw new Error('Connector ID must be a positive number');
            }

            // Construct the payload
            msg.payload = {
                connectorId: connectorId
            };

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-unlock-connector", UnlockConnectorCommand);
}