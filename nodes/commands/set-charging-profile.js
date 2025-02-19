module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class SetChargingProfileCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'setchargingprofile';
            this.connectorId = config.connectorId;
            this.csChargingProfiles = config.csChargingProfiles;
        }

        async handleInput(msg) {
            msg.payload = msg.payload || {};

            // Validate connector ID
            const connectorId = msg.payload.connectorId || this.connectorId;
            if (!connectorId || connectorId < 1) {
                throw new Error('Connector ID must be a positive number');
            }

            // Validate charging profile
            const profile = msg.payload.csChargingProfiles || this.csChargingProfiles;
            if (!profile) {
                throw new Error('Charging profile is required');
            }

            // Validate charging profile fields
            this.validateChargingProfile(profile);

            msg.payload = {
                connectorId: connectorId,
                csChargingProfiles: profile
            };

            await super.handleInput(msg);
        }

        validateChargingProfile(profile) {
            // Required fields
            if (!profile.chargingProfileId || typeof profile.chargingProfileId !== 'number') {
                throw new Error('chargingProfileId is required and must be a number');
            }

            if (!profile.stackLevel || typeof profile.stackLevel !== 'number') {
                throw new Error('stackLevel is required and must be a number');
            }

            if (!profile.chargingProfilePurpose) {
                throw new Error('chargingProfilePurpose is required');
            }

            const validPurposes = ['ChargePointMaxProfile', 'TxDefaultProfile', 'TxProfile'];
            if (!validPurposes.includes(profile.chargingProfilePurpose)) {
                throw new Error(`Invalid chargingProfilePurpose. Must be one of: ${validPurposes.join(', ')}`);
            }

            if (!profile.chargingProfileKind) {
                throw new Error('chargingProfileKind is required');
            }

            const validKinds = ['Absolute', 'Recurring', 'Relative'];
            if (!validKinds.includes(profile.chargingProfileKind)) {
                throw new Error(`Invalid chargingProfileKind. Must be one of: ${validKinds.join(', ')}`);
            }

            if (!profile.chargingSchedule) {
                throw new Error('chargingSchedule is required');
            }

            this.validateChargingSchedule(profile.chargingSchedule);
        }

        validateChargingSchedule(schedule) {
            if (!schedule.chargingRateUnit) {
                throw new Error('chargingSchedule.chargingRateUnit is required');
            }

            const validUnits = ['W', 'A'];
            if (!validUnits.includes(schedule.chargingRateUnit)) {
                throw new Error(`Invalid chargingRateUnit. Must be one of: ${validUnits.join(', ')}`);
            }

            if (!Array.isArray(schedule.chargingSchedulePeriod) || schedule.chargingSchedulePeriod.length === 0) {
                throw new Error('chargingSchedule.chargingSchedulePeriod must be a non-empty array');
            }

            schedule.chargingSchedulePeriod.forEach((period, index) => {
                if (typeof period.startPeriod !== 'number') {
                    throw new Error(`chargingSchedulePeriod[${index}].startPeriod must be a number`);
                }
                if (typeof period.limit !== 'number') {
                    throw new Error(`chargingSchedulePeriod[${index}].limit must be a number`);
                }
            });
        }
    }

    RED.nodes.registerType("longship-set-charging-profile", SetChargingProfileCommand);
}