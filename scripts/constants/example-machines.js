// TODO: Fix this defintion. What's wrong???
const NightClubMachine = {
  "operator": null,
  "name": "NightClub",
  "id": "0xf1b3092a",
  "initialStateId": "0x13728da8",
  "uri": "ipfs://",
  "states": [
    {
      "name": "Bar",
      "id": "0xc1620375",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "actionId": "0x4f17fd5a",
          "targetStateName": "Dancefloor",
          "targetStateId": "0x3da68dd9"
        },
        {
          "action": "Head out",
          "actionId": "0x942dd27b",
          "targetStateName": "Foyer",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Freshen up",
          "actionId": "0x3fa89cdc",
          "targetStateName": "Restroom",
          "targetStateId": "0x2f61f990"
        },
        {
          "action": "Go chill with the fabulous people",
          "actionId": "0x5dfbf4c2",
          "targetStateName": "VIP_Lounge",
          "targetStateId": "0x63c298a2"
        }
      ]
    },
    {
      "name": "Cab",
      "id": "0x1f5e07f1",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Pay the driver and go party",
          "actionId": "0x08b50e17",
          "targetStateName": "Street",
          "targetStateId": "0xe071b98e"
        },
        {
          "action": "Pay the driver and go get a shower",
          "actionId": "0x3fa89cdc",
          "targetStateName": "Home",
          "targetStateId": "0x13728da8"
        }
      ]
    },
    {
      "name": "Dancefloor",
      "id": "0x3da68dd9",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Grab a drink",
          "actionId": "0x4b809029",
          "targetStateName": "Bar",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Head out",
          "actionId": "0x942dd27b",
          "targetStateName": "Foyer",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Freshen up",
          "actionId": "0x3fa89cdc",
          "targetStateName": "Restroom",
          "targetStateId": "0x2f61f990"
        },
        {
          "action": "Go chill with the fabulous people",
          "actionId": "0x5dfbf4c2",
          "targetStateName": "VIP_Lounge",
          "targetStateId": "0x63c298a2"
        }
      ]
    },
    {
      "name": "Foyer",
      "id": "0x15040bee",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "actionId": "0x4f17fd5a",
          "targetStateName": "Dancefloor",
          "targetStateId": "0x3da68dd9"
        },
        {
          "action": "Hit the road",
          "actionId": "0xe137ce54",
          "targetStateName": "Street",
          "targetStateId": "0xe071b98e"
        },
        {
          "action": "Grab a drink",
          "actionId": "0x4b809029",
          "targetStateName": "Bar",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Freshen up",
          "actionId": "0x3fa89cdc",
          "targetStateName": "Restroom",
          "targetStateId": "0x2f61f990"
        },
        {
          "action": "Go chill with the fabulous people",
          "actionId": "0x5dfbf4c2",
          "targetStateName": "VIP_Lounge",
          "targetStateId": "0x63c298a2"
        }
      ]
    },
    {
      "name": "Home",
      "id": "0x13728da8",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Get off the couch, catch a cab, and go to the club",
          "actionId": "0xe2d459c0",
          "targetStateName": "Cab",
          "targetStateId": "0x1f5e07f1"
        }
      ]
    },
    {
      "name": "Restroom",
      "id": "0x2f61f990",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "actionId": "0x4f17fd5a",
          "targetStateName": "Dancefloor",
          "targetStateId": "0x3da68dd9"
        },
        {
          "action": "Hit the road",
          "actionId": "0xe137ce54",
          "targetStateName": "Street",
          "targetStateId": "0xe071b98e"
        },
        {
          "action": "Grab a drink",
          "actionId": "0x4b809029",
          "targetStateName": "Bar",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Go chill with the fabulous people",
          "actionId": "0x5dfbf4c2",
          "targetStateName": "VIP_Lounge",
          "targetStateId": "0x63c298a2"
        }
      ]
    },
    {
      "name": "Street",
      "id": "0xe071b98e",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Hail a cab",
          "actionId": "0xc8d60a91",
          "targetStateName": "Cab",
          "targetStateId": "0x1f5e07f1"
        },
        {
          "action": "Enter the club",
          "actionId": "0x6ee19ffe",
          "targetStateName": "Foyer",
          "targetStateId": "0x15040bee"
        }
      ]
    },
    {
      "name": "VIP_Lounge",
      "id": "0x63c298a2",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "actionId": "0x4f17fd5a",
          "targetStateName": "Dancefloor",
          "targetStateId": "0x3da68dd9"
        },
        {
          "action": "Hit the road",
          "actionId": "0xe137ce54",
          "targetStateName": "Street",
          "targetStateId": "0xe071b98e"
        },
        {
          "action": "Grab a drink",
          "actionId": "0x4b809029",
          "targetStateName": "Bar",
          "targetStateId": "0x15040bee"
        },
        {
          "action": "Freshen up",
          "actionId": "0x3fa89cdc",
          "targetStateName": "Restroom",
          "targetStateId": "0x2f61f990"
        }
      ]
    }
  ]
};

const StopWatchMachine = {
  "operator": null,
  "name": "StopWatch",
  "id": "0x1c1346e3",
  "initialStateId": "0xce5ceceb",
  "uri": "ipfs://",
  "states": [
    {
      "name": "Ready",
      "id": "0xce5ceceb",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Start",
          "actionId": "0x71b29014",
          "targetStateName": "Running",
          "targetStateId": "0xf4042adf"
        }
      ]
    },
    {
      "name": "Running",
      "id": "0xf4042adf",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Stop",
          "actionId": "0xfcf321a0",
          "targetStateName": "Paused",
          "targetStateId": "0x0eeb5248"
        },
      ]
    },
    {
      "name": "Paused",
      "id": "0x0eeb5248",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Start",
          "actionId": "0x71b29014",
          "targetStateName": "Running",
          "targetStateId": "0xf4042adf"
        },
        {
          "action": "Reset",
          "actionId": "0xaa51a4a1",
          "targetStateName": "Ready",
          "targetStateId": "0xce5ceceb"
        }
      ]
    },
  ]
};

const MeditationMachine = {
  "operator": null,
  "name": "BeHereNow",
  "id": "0x1794ba3e",
  "initialStateId": "0xd3c380eb",
  "uri": "ipfs://",
  "states": [
    {
      "name": "Relax",
      "id": "0xd3c380eb",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Float downstream",
          "actionId": "0x8be2f0a7",
          "targetStateName": "Relax",
          "targetStateId": "0xd3c380eb"
        },
      ]
    }
  ]
};

exports.NightClub = {
    machine: NightClubMachine,
    operator: "NightClubOperator",
    guards: [
      {states: ["Bar"], contractName: "BarGuards", contract: null},
      {states: ["Cab"], contractName: "CabGuards", contract: null},
      {states: ["Dancefloor"], contractName: "DancefloorGuards", contract: null},
      {states: ["Foyer"], contractName: "FoyerGuards", contract: null},
      {states: ["Restroom"], contractName: "RestroomGuards", contract: null},
      {states: ["Street"], contractName: "StreetGuards", contract: null},
      {states: ["VIP_Lounge"], contractName: "VIPLoungeGuards", contract: null},
    ],
};

exports.StopWatch = {
  machine: StopWatchMachine,
  operator: "StopWatchOperator",
  guards: [
    {
      states: ["Ready", "Running", "Paused"],
      contractName: "StopWatchGuards",
      contract: null
    },
  ]
};

// Simple one state unguarded example for unit testing
exports.Meditation = {
  machine: MeditationMachine,
};