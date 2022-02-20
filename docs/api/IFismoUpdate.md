![Fismo](../images/fismo-logo.png)
## [Lab](../../README.md) 🧪 [Setup](../setup.md) 🧪 [Tasks](../tasks.md) 🧪 API 🧪 [FAQ](../faq.md) 🧪 [About](../about.md)

## Fismo API
### [IFismoOperate](IFismoOperate.md) 💥 IFismoUpdate 💥 [IFismoView](IFismoView.md)

## Interface [IFismoUpdate.sol](../../contracts/interfaces/IFismoUpdate.sol)
### Update Fismo Storage
The ERC-165 identifier for this interface is `0xe29cbd4a`

## Events

- [MachineAdded(bytes4 indexed machineId, string machineName)](#machineadded)
- [StateAdded(bytes4 indexed machineId, bytes4 indexed stateId, string stateName)](#stateadded)
- [StateUpdated(bytes4 indexed machineId, bytes4 indexed stateId, string stateName)](#stateupdated)
- [TransitionAdded(bytes4 indexed machineId, bytes4 indexed stateId, string action, string targetStateName)](#transitionadded)

### MachineAdded

```solidity
event MachineAdded(bytes4 indexed machineId, string machineName);
```
**Parameters**

| Name         | Description             | Type   |
|--------------|-------------------------|--------|
| machineId    | the machine's id        | bytes4 | 
| machineName | the name of the machine | string | 

### StateAdded

```solidity
event StateAdded(bytes4 indexed machineId, bytes4 indexed stateId, string stateName);
```
**Parameters**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string | 

### StateUpdated

```solidity
event StateUpdated(bytes4 indexed machineId, bytes4 indexed stateId, string stateName);
```
**Parameters**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string | 

### TransitionAdded

```solidity
  event TransitionAdded(bytes4 indexed machineId, bytes4 indexed stateId, string action, string targetStateName);
```
**Parameters**

| Name      | Description                  | Type   |
|-----------|------------------------------|--------|
| machineId | the machine's id             | bytes4 | 
| stateId   | the state's id               | bytes4 | 
| action | the name of the action       | string | 
| targetStateName | the name of the target state | string | 

## Functions
- [`addMachine(FismoTypes.Machine memory _machine)`](#addmachine)
- [`addState(bytes4 _machineId, FismoTypes.State memory _state)`](#addstate)
- [`updateState(bytes4 _machineId, FismoTypes.State memory _state)`](#updatestate)
- [`addTransition(bytes4 _machineId, bytes4 _stateId, FismoTypes.Transition memory _transition)`](#addtransition)

### addMachine
Add a new Machine

**Emits**
- [`MachineAdded`](#machineadded)
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Reverts if**
- caller is not contract owner
- operator address is zero
- `machineId` is not valid
- machine already exists

**Signature**
```solidity
function 
external;
```

**Arguments**

| Name     | Description                    | Type     |
| ---------- |--------------------------------|----------|
| _machine | the machine definition to add  | FismoTypes.Machine  | 

### addState
Add a State to an existing Machine

**Emits**
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Note**
- the new state will not be reachable by any action
- add one or more transitions to other states, targeting the new state

**Reverts if**
- caller is not contract owner
- state is invalid
- machine does not exist
- any contained transition is invalid

**Signature**
```solidity
function  addState(bytes4 _machineId, FismoTypes.State memory _state)
external;
```

**Arguments**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| _machineId | the id of the machine | bytes4 | 
| _state | the State to add      | FismoTypes.State  |

### updateState
Update an existing state to an existing machine

**Note**
- State name and id cannot be changed.

**Emits**
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Reverts if**
- caller is not contract owner
- machine does not exist
- state does not exist
- state id is invalid
- any contained transition is invalid

**Use this when**
- adding more than one transition
- removing one or more transitions
- changing exitGuarded, enterGuarded, guardLogic params

**Signature**
```solidity
function updateState(bytes4 _machineId, FismoTypes.State memory _state)
external;
```

**Arguments**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| _machineId | the id of the machine | bytes4 | 
| _state | the State to update   | FismoTypes.State  | 

### addTransition
Add a Transition to an existing State of an existing Machine

**Emits**
* [`TransitionAdded`](#transitionadded)

**Reverts if**
- caller is not contract owner
- machine does not exist
- state does not exist
- action id is invalid
- target state id is invalid

**Use this when**
- adding only a single transition (use updateState for multiple)

**Signature**
```solidity
function addTransition(bytes4 _machineId, bytes4 _stateId, FismoTypes.Transition memory _transition)
external;
```

**Arguments**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| _machineId | the id of the machine | bytes4 | 
| _state | the State to update   | FismoTypes.State  | 
