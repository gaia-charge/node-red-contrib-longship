module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class GetCompositeScheduleCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'getcompositeschedule';
            this.connectorId = config.connectorId;
            this.duration = config.duration;
            this.chargingRateUnit = config.chargingRateUnit;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Use payload values if provided, otherwise use configured values
            const connectorId = msg.payload.connectorId || this.connectorId;
            const duration = msg.payload.duration || this.duration;
            const chargingRateUnit = msg.payload.chargingRateUnit || this.chargingRateUnit;

            // Validate connector ID
            if (typeof connectorId !== 'number' || connectorId < 1) {
                throw new Error('Connector ID must be a positive number');
            }

            // Validate duration
            if (typeof duration !== 'number' || duration < 0) {
                throw new Error('Duration must be a non-negative number');
            }

            // Validate charging rate unit
            const validUnits = ['W', 'A'];
            if (chargingRateUnit && !validUnits.includes(chargingRateUnit)) {
                throw new Error('ChargingRateUnit must be either "W" or "A"');
            }

            msg.payload = {
                connectorId: connectorId,
                duration: duration,
                ...(chargingRateUnit && { chargingRateUnit: chargingRateUnit })
            };

            await super.handleInput(msg);
        }
    }

    RED.nodes.registerType("longship-get-composite-schedule", GetCompositeScheduleCommand);
}