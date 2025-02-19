module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class ClearChargingProfileCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'clearchargingprofile';
            this.connectorId = config.connectorId;
            this.chargingProfileId = config.chargingProfileId;
            this.chargingProfilePurpose = config.chargingProfilePurpose;
            this.stackLevel = config.stackLevel;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Build the request payload using configuration or message values
            const payload = {};

            // Only add parameters if they are defined (either in config or msg.payload)
            if (msg.payload.connectorId !== undefined || this.connectorId) {
                payload.connectorId = msg.payload.connectorId || this.connectorId;
            }

            if (msg.payload.chargingProfileId !== undefined || this.chargingProfileId) {
                payload.chargingProfileId = msg.payload.chargingProfileId || this.chargingProfileId;
            }

            if (msg.payload.chargingProfilePurpose || this.chargingProfilePurpose) {
                const purpose = msg.payload.chargingProfilePurpose || this.chargingProfilePurpose;
                const validPurposes = ['ChargePointMaxProfile', 'TxDefaultProfile', 'TxProfile'];
                if (!validPurposes.includes(purpose)) {
                    throw new Error(`Invalid charging profile purpose. Must be one of: ${validPurposes.join(', ')}`);
                }
                payload.chargingProfilePurpose = purpose;
            }

            if (msg.payload.stackLevel !== undefined || this.stackLevel) {
                payload.stackLevel = msg.payload.stackLevel || this.stackLevel;
            }

            msg.payload = payload;
            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-clear-charging-profile", ClearChargingProfileCommand);
}