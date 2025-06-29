# Node-RED Longship Integration

A Node-RED integration for the Longship charging station management platform. This collection of nodes enables interaction with OCPP-compliant charging stations through the Longship API.

## Installation

```bash
npm install @gaia-charge/node-red-contrib-longship
```


## Configuration

Before using any of the command nodes, you need to configure the Longship connection details:

1. Add a "longship-config" node to your flow
2. Configure:
   - Base URL (default: https://api.longship.io)
   - Tenant Key (`Ocp-Apim-Subscription-Key`)
   - Application Key (`x-api-key`)

## Available Nodes

### Configuration Node

- **longship-config**: Stores connection details for the Longship API including base URL and authentication keys.

### Command Nodes

#### Information Retrieval

- **Get Chargepoint**
  - Retrieves detailed information about a specific chargepoint
  - Returns comprehensive data including status, configuration, EVSEs, connectors, and tariffs
  - Input: chargePointId

- **Get Chargepoint Messages**
  - Retrieves message logs for a specific chargepoint
  - Supports filtering by date range, message type, direction, transaction ID, and more
  - Returns detailed OCPP message information including payloads and timestamps
  - Input: chargePointId, optional filters in payload

#### Basic Commands

- **Clear Cache**
  - Clears the internal cache of a charging point
  - Input: chargePointId

- **Reset**
  - Resets a charging point (soft or hard reset)
  - Input: chargePointId, type (Soft/Hard)

- **Trigger Message**
  - Requests specific messages from a charging point
  - Supported messages: BootNotification, Heartbeat, StatusNotification, MeterValues
  - Input: chargePointId, requestedMessage, connectorId

#### Charging Control

- **Remote Start**
  - Initiates a charging session
  - Input: chargePointId, connectorId, idTag (optional)

- **Remote Stop**
  - Stops an active charging session
  - Input: chargePointId, transactionId

#### Charging Profiles

- **Clear Charging Profile**
  - Removes charging profiles from a charging point
  - Input: chargePointId, various profile filters

- **Get Composite Schedule**
  - Retrieves the composite charging schedule
  - Input: chargePointId, connectorId, duration, chargingRateUnit

- **Set Charging Profile**
  - Configures charging profiles
  - Input: chargePointId and profile configuration

#### Additional Commands

- **Data Transfer**
  - Sends custom data to charging points
  - Input: chargePointId and transfer data

- **Unlock Connector**
  - Unlocks a connector on a charging point
  - Input: chargePointId, connectorId

- **Update Firmware**
  - Initiates firmware updates on charging points
  - Input: chargePointId and firmware details

## Usage Example

Here's a basic example of how to trigger a status notification:

1. Add a `longship-config` node and configure your credentials
2. Add a `trigger-message` node and configure:
   - Server: Select your config node
   - Message Type: StatusNotification
   - Connector ID: 1
3. Inject a message with:
   ```json
   {
       "chargePointId": "CP001"
   }
   ```

## Error Handling

All nodes provide error feedback through:
- Node status indicators
- Error messages in the Node-RED debug panel
- Error outputs in the message payload

## License

MIT License

## Author

[Gaia Charge](https://gaiacharge.com)