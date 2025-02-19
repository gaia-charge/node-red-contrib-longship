module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class DataTransferCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'datatransfer';
            this.vendorId = config.vendorId;
            this.messageId = config.messageId;
            this.data = config.data;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Use payload values if provided, otherwise use configured values
            const vendorId = msg.payload.vendorId || this.vendorId;
            const messageId = msg.payload.messageId || this.messageId;
            const data = msg.payload.data || this.data;

            // Validate required fields
            if (!vendorId) {
                throw new Error('vendorId is required either in msg.payload or node configuration');
            }

            // Construct the payload
            msg.payload = {
                vendorId: vendorId,
                messageId: messageId,
                data: data
            };

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-datatransfer", DataTransferCommand);
}