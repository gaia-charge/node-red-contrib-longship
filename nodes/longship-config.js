module.exports = function (RED) {
    function LongshipConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.baseUrl = config.baseUrl;
    }

    RED.nodes.registerType("longship-config", LongshipConfigNode, {
        credentials: {
            tenantKey: { type: "password" },
            applicationKey: { type: "password" }
        }
    });
}