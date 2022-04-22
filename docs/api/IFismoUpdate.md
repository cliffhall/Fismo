---
layout: default
title: IFismoUpdate
parent: Interfaces
nav_order: 5
---
# Update Fismo Storage
* View Interface [IFismoUpdate.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoUpdate.sol)
* The [ERC-165](https://eips.ethereum.org/EIPS/eip-165) identifier for this interface is `0xf8ebd091`

## Events
* [MachineInstalled](#machineinstalled)
* [StateAdded](#stateadded)
* [StateUpdated](#stateupdated)
* [TransitionAdded](#transitionadded)

### MachineInstalled
Emitted when a new Machine is installed in the Fismo instance.

#### Signature
```solidity
event MachineInstalled (
    bytes4 indexed machineId, 
    string machineName
);
```
#### Parameters

| Name         | Description             | Type   |
|--------------|-------------------------|--------|
| machineId    | the machine's id        | bytes4 | 
| machineName | the name of the machine | string |

### StateAdded
Emitted when a new State is added to a Fismo Machine.

#### Note
* May be emitted multiple times during the installation of a Machine.

#### Signature

```solidity
event StateAdded (
    bytes4 indexed machineId, 
    bytes4 indexed stateId, 
    string stateName
);
```
#### Parameters

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string |

### StateUpdated
Emitted when an existing State is updated. 

#### Signature

```solidity
event StateUpdated (
    bytes4 indexed machineId, 
    bytes4 indexed stateId, 
    string stateName
);
```
#### Parameters

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string |

### TransitionAdded
Emitted when a new Transition is added to an existing State. 

#### Note
- May be emitted multiple times during the addition of a Machine or State.

#### Signature

```solidity
event TransitionAdded (
    bytes4 indexed machineIdΩ, 
    bytes4 indexed stateId, 
    string action, 
    string targetStateName
);
```
#### Parameters

| Name      | Description                  | Type   |
|-----------|------------------------------|--------|
| machineId | the machine's id             | bytes4 | 
| stateId   | the state's id               | bytes4 | 
| action | the name of the action       | string | 
| targetStateName | the name of the target state | string |

## Methods
* [installMachine](#installmachine)
* [installAndInitializeMachine](#installandinitializemachine)
* [addState](#addstate)
* [updateState](#updatestate)
* [addTransition](#addtransition)

### installMachine
Install a Fismo Machine that requires no initialization.

#### Emits
- [`MachineInstalled`](#machineinstalled)
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

#### Reverts if
- Caller is not contract owner
- Operator address is zero
- Machine id is not valid for Machine name
- Machine already exists

#### Signature
```solidity
function installMachine (
    FismoTypes.Machine memory _machine
) 
external;
```

#### Arguments

| Name     | Description                    | Type     |
| ---------- |--------------------------------|----------|
| _machine | the machine definition to add  | [FismoTypes.Machine](../domain/Machine.md)  |

### installAndInitializeMachine
Install a Fismo Machine and initialize it.

#### Emits
- [`MachineInstalled`](#machineinstalled)
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

#### Reverts if
- Caller is not contract owner
- Operator address is zero
- Machine id is not valid for Machine name
- Machine already exists
- Initializer has no code
- Initializer call reverts

#### Signature
```solidity
function installAndInitializeMachine (
    FismoTypes.Machine memory _machine,
    address _initializer,
    bytes memory _calldata
) 
external;
```

#### Arguments

| Name    | Description                       | Type  |
| --------- |-----------------------------------|-------|
| _machine | the machine definition to install | [FismoTypes.Machine](../domain/Machine.md) | 
| _initializer | the address of the initializer contract | address | 
| _calldata | the encoded function and args to pass in delegatecall | bytes |

### addState
Add a State to an existing Machine.

#### Emits
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

#### Reverts if
- Caller is not contract owner
- State id is invalid for State name
- Machine does not exist
- Any contained transition is invalid

#### Note
- The new state will not be reachable by any action
- Add one or more transitions to other states, targeting the new state

#### Signature
```solidity
function  addState (
    bytes4 _machineId, 
    FismoTypes.State memory _state
) 
external;
```

#### Arguments

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| _machineId | the id of the machine | bytes4 | 
| _state | the State to add      | [FismoTypes.State](../domain/State.md)  |

### updateState
Update an existing State in an existing Machine.

#### Emits
- [`StateUpdated`](#stateupdated)
- [`TransitionAdded`](#transitionadded)

#### Reverts if
- Caller is not contract owner
- Machine does not exist
- State does not exist
- State id is invalid
- Any contained transition is invalid

#### Note
* State name and id cannot be changed.

#### Use this when
- Adding more than one transition
- Removing one or more transitions
- Changing exitGuarded, enterGuarded, guardLogic params

#### Signature
```solidity
function updateState (
    bytes4 _machineId, 
    FismoTypes.State memory _state
) 
external;
```

#### Arguments

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| _machineId | the id of the machine | bytes4 | 
| _state | the state to update   | [FismoTypes.State](../domain/State.md)  |

### addTransition
Add a Transition to an existing State of an existing Machine.

#### Emits
* [`TransitionAdded`](#transitionadded)

#### Reverts if
- Caller is not contract owner
- Machine does not exist
- State does not exist
- Action id is invalid
- Target state id is invalid

#### Use this when
- Adding only a single transition (use updateState for multiple)

#### Signature
```solidity
function addTransition (
    bytes4 _machineId, 
    bytes4 _stateId, 
    FismoTypes.Transition memory _transition
) 
external;
```

#### Arguments

| Name        | Description            | Type                                        |
|-------------|------------------------|---------------------------------------------|
| _machineId  | the id of the machine  | bytes4                                      | 
| _stateId    | the id of the state to update | bytes4                                      |
| _transition | the transition to add  | [FismoTypes.Transition](../domain/Transition.md) |