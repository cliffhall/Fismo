/**
 * Machine definitions and example descriptors
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

const { nameToId } =  require('../domain');

//--------------------------------------------------
// Define Machines
//--------------------------------------------------
const LockableDoorMachine = {
  "operator": null,
  "name": "LockableDoor",
  "initialStateId":  nameToId("Closed"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Closed",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Open",
          "targetStateName": "Opened",
        },
        {
          "action": "Lock",
          "targetStateName": "Locked",
        }
      ]
    },
    {
      "name": "Locked",
      "enterGuarded": false,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Unlock",
          "targetStateName": "Closed",
        },
      ]
    },
    {
      "name": "Opened",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Close",
          "targetStateName": "Closed"
        }
      ]
    },
  ]
};

//--------------------------------------------------
// Export example descriptors
//--------------------------------------------------
exports.LockableDoor = {
  machine: LockableDoorMachine,
  initializer: {
    contractName: "LockableDoorGuards",
    signature: "initialize(address)"
  },
  guards: [
    {
      states: ["Locked"],
      contractName: "LockableDoorGuards",
      contract: null
    },
  ]
};