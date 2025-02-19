module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class ResetCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'reset';
            this.resetType = config.resetType;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Use payload type if provided, otherwise use configured type
            const resetType = msg.payload.type || this.resetType;

            // Validate reset type
            if (!['Soft', 'Hard'].includes(resetType)) {
                throw new Error('Reset type must be either "Soft" or "Hard"');
            }

            msg.payload = {
                ...msg.payload,
                type: resetType
            };

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-reset", ResetCommand);
}