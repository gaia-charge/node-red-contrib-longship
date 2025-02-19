module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class TriggerMessageCommand extends BaseLongshipCommand {
        constructor(config) {
            // Ensure config object is properly initialized before passing to super
            config = config || {};
            super(config);
            
            // Create the node
            RED.nodes.createNode(this, config);
            
            this.command = 'triggermessage';
            this.requestedMessage = config.requestedMessage;
            this.connectorId = config.connectorId || 0;
        
            // Bind the input handler
            this.on('input', this.handleInput.bind(this));
        }

        // Override handleInput to add message type validation
        async handleInput(msg) {
            msg.payload = msg.payload || {};
            // Validate message type if not provided in msg.payload
            if (!msg.payload || !msg.payload.requestedMessage) {
                msg.payload = {
                    ...msg.payload,
                    requestedMessage: this.requestedMessage
                };
            }
    
            if (!msg.payload.connectorId) {
                msg.payload.connectorId = this.connectorId;
            }

            // Validate message type
            const validMessages = [
                'BootNotification',
                'Heartbeat',
                'StatusNotification',
                'MeterValues'
            ];

            const requestedMessage = msg.payload.requestedMessage;
            if (!validMessages.includes(requestedMessage)) {
                throw new Error(`Invalid message type. Must be one of: ${validMessages.join(', ')}`);
            }

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-trigger-message", TriggerMessageCommand);
}