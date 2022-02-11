```
> fismo@0.1.0 test
> npx hardhat test
```
```
ActionResponse
📋 Constructor
✓ Should allow creation of valid, fully populated ActionResponse instance (4ms)
📋 Field validations
✓ Always present, machineName must start with a letter and contain only characters: a-z, A-Z, 0-9, and  (0ms)
✓ Always present, action must contain only characters: a-z, A-Z, 0-9, _, and space (1ms)
✓ Always present, priorStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _ (1ms)
✓ Always present, nextStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _ (1ms)
✓ If present, exitMessage must be a string (0ms)
✓ If present, enterMessage must be a string (0ms)
📋 Utility functions
👉 Static
✓ ActionResponse.fromObject() should return a ActionResponse instance with the same values as the given plain object (1ms)
👉 Instance
✓ instance.toString() should return a JSON string representation of the ActionResponse instance (1ms)
✓ instance.clone() should return another ActionResponse instance with the same property values (0ms)
✓ instance.toObject() should return a plain object representation of the ActionResponse instance (1ms)

Machine
📋 Constructor
✓ Should allow creation of valid, fully populated Machine instance (3ms)
📋 Field validations
✓ Always present, operator must be a valid eip55 address (1ms)
✓ Always present, id must be a bytes4 kecckak hash of the name (1ms)
✓ Always present, initialStateId must be a bytes4 kecckak hash of a State instance in the states array (2ms)
✓ Always present, name must start with a letter and contain only characters: a-z, A-Z, 0-9, and  (0ms)
✓ Always present, states must be an array, containing zero or more State instances (2ms)
✓ If present, uri must be a string (2ms)
📋 Utility functions
👉 Static
✓ Machine.fromObject() should return a Machine instance with the same values as the given plain object (0ms)
👉 Instance
✓ instance.toString() should return a JSON string representation of the Machine instance (0ms)
✓ instance.clone() should return another Machine instance with the same property values (2ms)
✓ instance.toObject() should return a plain object representation of the Machine instance (0ms)
✓ instance.getState() should return the named State instance (1ms)
✓ instance.getInitialState() should return the initial State instance (0ms)

State
📋 Constructor
✓ Should allow creation of valid, fully populated State instance (0ms)
📋 Field validations
✓ Always present, id must be a bytes4 kecckak hash of the name (3ms)
✓ Always present, name must start with a letter and contain only characters: a-z, A-Z, 0-9, and  (1ms)
✓ Always present, exitGuarded must be a boolean (0ms)
✓ Always present, enterGuarded must be a boolean (3ms)
✓ Always present, transitions must be an array, containing zero or more Transition instances (1ms)
✓ If present, guardLogic must be a string representation of an EIP-55 compliant address (2ms)
📋 Utility functions
👉 Static
✓ State.fromObject() should return a State instance with the same values as the given plain object (1ms)
👉 Instance
✓ instance.toString() should return a JSON string representation of the State instance (0ms)
✓ instance.clone() should return another State instance with the same property values (1ms)
✓ instance.toObject() should return a plain object representation of the State instance (1ms)

Transition
📋 Constructor
✓ Should allow creation of valid, fully populated Transition instance (0ms)
📋 Field validations
✓ Always present, actionId must be a bytes4 kecckak hash of the action (0ms)
✓ Always present, action must contain only characters: a-z, A-Z, 0-9, _, and space (1ms)
✓ Always present, targetStateId must be a bytes4 kecckak hash of the targetStateName (1ms)
✓ Always present, targetStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _ (2ms)
📋 Utility functions
📋 Static
✓ Transition.fromObject() should return a Transition instance with the same values as the given plain object (1ms)
👉 Instance
✓ instance.toString() should return a JSON string representation of the Transition instance (2ms)
✓ instance.clone() should return another Transition instance with the same property values (1ms)
✓ instance.toObject() should return a plain object representation of the Transition instance (0ms)

Lockable Door Machine
📋 Operator
👉 callGuard()
✓ Should call guard function and return response (33ms)
👉 invokeAction()
✓ Should invoke valid action 'Open' for initial state 'Closed' (70ms)
✓ Should invoke valid action 'Lock' for initial state 'Closed' (50ms)
✓ Should invoke valid action 'Unlock' from state 'Locked' (127ms)
💔 Revert Reasons
✓ Should revert if machineId is invalid (40ms)
✓ Should revert if actionId is invalid (22ms)

Fismo
📋 Supported Interfaces
👉 supportsInterface()
✓ should indicate support for ERC-165 interface (8ms)
✓ should indicate support for IFismoOperate interface (7ms)
✓ should indicate support for IFismoUpdate interface (8ms)
✓ should indicate support for IFismoView interface (7ms)
📋 IFismoOperate methods
👉 invokeAction()
✓ Should accept a valid invocation (36ms)
💔 Revert Reasons
✓ Should revert if caller is not the machine's operator (17ms)
✓ Should revert if machine doesn't exist (17ms)
✓ Should revert if the action is invalid for the user's current state (21ms)
📋 IFismoUpdate methods
👉 addMachine()
✓ Should accept a valid unguarded Machine (65ms)
✓ Should accept a valid guarded Machine (186ms)
💔 Revert Reasons
✓ Should revert if operator address is zero address (22ms)
✓ Should revert if machine id is invalid (21ms)
✓ Should revert if machine already exists (77ms)
✓ Should revert if a state id in a state is invalid (23ms)
✓ Should revert if an action id in a transition is invalid (29ms)
✓ Should revert if a target state id in a transition is invalid (31ms)
👉 addState()
✓ Should accept a valid end State (no transitions) (38ms)
✓ Should accept a valid State with transitions (49ms)
💔 Revert Reasons
✓ Should revert if the state id is invalid (10ms)
✓ Should revert if an action id in a transition is invalid (19ms)
✓ Should revert if a target state id in a transition is invalid (20ms)
👉 updateState()
✓ Should accept an updated State (63ms)
💔 Revert Reasons
✓ Should revert if the state id is invalid (14ms)
✓ Should revert if an action id in a transition is invalid (21ms)
✓ Should revert if a target state id in a transition is invalid (20ms)
👉 addTransition()
✓ Should accept a valid Transition (21ms)
💔 Revert Reasons
✓ Should revert if the action id is invalid (9ms)
✓ Should revert if the target state id is invalid (11ms)

InterfaceInfo
📋 Interface Ids
✓ getIFismoOperate() should return expected id (6ms)
✓ getIFismoUpdate() should return expected id (6ms)
✓ getIFismoView() should return expected id (7ms)

·------------------------------------------|----------------------------|-------------|-----------------------------·
|           Solc version: 0.8.9            ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···········································|····························|·············|······························
|  Methods                                 ·               170 gwei/gas               ·       2901.80 usd/eth       │
·························|·················|··············|·············|·············|···············|··············
|  Contract              ·  Method         ·  Min         ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·························|·················|··············|·············|·············|···············|··············
|  Fismo                 ·  addMachine     ·      360861  ·     856041  ·     408021  ·           21  ·     201.28  │
·························|·················|··············|·············|·············|···············|··············
|  Fismo                 ·  addState       ·      158643  ·     259191  ·     208917  ·            4  ·     103.06  │
·························|·················|··············|·············|·············|···············|··············
|  Fismo                 ·  addTransition  ·           -  ·          -  ·     114932  ·            2  ·      56.70  │
·························|·················|··············|·············|·············|···············|··············
|  Fismo                 ·  invokeAction   ·           -  ·          -  ·     133696  ·            2  ·      65.95  │
·························|·················|··············|·············|·············|···············|··············
|  Fismo                 ·  updateState    ·           -  ·          -  ·     313424  ·            2  ·     154.61  │
·························|·················|··············|·············|·············|···············|··············
|  LockableDoorOperator  ·  invokeAction   ·      134586  ·     156374  ·     150254  ·            8  ·      74.12  │
·························|·················|··············|·············|·············|···············|··············
|  MockFismo             ·  addMachine     ·           -  ·          -  ·     839924  ·            6  ·     414.34  │
·························|·················|··············|·············|·············|···············|··············
|  Deployments                             ·                                          ·  % of limit   ·             │
···········································|··············|·············|·············|···············|··············
|  Fismo                                   ·           -  ·          -  ·    4067850  ·       13.6 %  ·    2006.69  │
···········································|··············|·············|·············|···············|··············
|  InterfaceInfo                           ·           -  ·          -  ·     142663  ·        0.5 %  ·      70.38  │
···········································|··············|·············|·············|···············|··············
|  LockableDoorGuards                      ·           -  ·          -  ·     243080  ·        0.8 %  ·     119.91  │
···········································|··············|·············|·············|···············|··············
|  LockableDoorOperator                    ·      461520  ·     461532  ·     461530  ·        1.5 %  ·     227.68  │
···········································|··············|·············|·············|···············|··············
|  MockFismo                               ·           -  ·          -  ·    4120224  ·       13.7 %  ·    2032.53  │
···········································|··············|·············|·············|···············|··············
|  StopWatchGuards                         ·           -  ·          -  ·     603439  ·          2 %  ·     297.68  │
·------------------------------------------|--------------|-------------|-------------|---------------|-------------·

81 passing (10s)
```