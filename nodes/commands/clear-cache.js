module.exports = function (RED) {
    const BaseLongshipCommand = require('../longship-base-command')(RED);

    class ClearCacheCommand extends BaseLongshipCommand {
        constructor(config) {
            super(config);
            this.command = 'clearcache';
        }
    }

    RED.nodes.registerType("longship-clear-cache", ClearCacheCommand);
}