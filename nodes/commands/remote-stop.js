module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class RemoteStopCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'remotestop';
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Validate that transactionId is provided and is a number
            if (!msg.payload.transactionId && typeof msg.payload.transactionId !== 'number') {
                throw new Error('transactionId is required in msg.payload and must be a number');
            }

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-remote-stop", RemoteStopCommand);
}