const { nameToId } =  require('../util/name-utils');

const NightClubMachine = {
  "operator": null,
  "name": "NightClub",
  "initialStateId": nameToId("Home"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Bar",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Head out",
          "targetStateName": "Foyer",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Cab",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Pay the driver and go party",
          "targetStateName": "Street",
        },
        {
          "action": "Pay the driver and go get a shower",
          "targetStateName": "Home",
        }
      ]
    },
    {
      "name": "Dancefloor",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Head out",
          "targetStateName": "Foyer",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Foyer",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Home",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Go to the club",
          "targetStateName": "Cab",
        }
      ]
    },
    {
      "name": "Restroom",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
          "name": "Street",
          "enterGuarded": true,
          "exitGuarded": true,
          "transitions": [
            {
              "action": "Hail a cab",
              "targetStateName": "Cab",
            },
            {
              "action": "Enter the club",
              "targetStateName": "Foyer",
            }
          ]
        },
    {
      "name": "VIP_Lounge",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        }
      ]
    }
  ]
};

const StopWatchMachine = {
  "operator": null,
  "name": "StopWatch",
  "initialStateId":  nameToId("Ready"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Ready",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Start",
          "targetStateName": "Running",
        }
      ]
    },
    {
      "name": "Running",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Stop",
          "targetStateName": "Paused",
        },
      ]
    },
    {
      "name": "Paused",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Start",
          "targetStateName": "Running"
        },
        {
          "action": "Reset",
          "targetStateName": "Ready",
        }
      ]
    },
  ]
};

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
        },
        {
          "action": "Reset",
          "targetStateName": "Ready",
        }
      ]
    },
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

exports.LockableDoor = {
  machine: LockableDoorMachine,
  operator: "LockableDoorOperator",
  guards: [
    {
      states: ["Locked"],
      contractName: "LockableDoorGuards",
      contract: null
    },
  ]
};