![Fismo](../images/fismo-logo.png)
# [Status](../../README.md) 🧪 [About](../about.md)  🧪 Docs 🧪 [FAQ](../faq.md)

## [Intro](../intro.md) 💥 [Setup](../setup.md) 💥 [Tasks](../tasks.md) 💥 API

### [IFismoOperate](IFismoOperate.md) 🔬 IFismoUpdate 🔬 [IFismoView](IFismoView.md)

## Interface [IFismoUpdate](../../contracts/interfaces/IFismoUpdate.sol)
### Update Fismo Storage
The ERC-165 identifier for this interface is `0xe29cbd4a`

## Events
### MachineAdded
Emitted when a new Machine is added to Fismo.

<details>
<summary>
View Details
</summary>

**Signature**
```solidity
event MachineAdded(bytes4 indexed machineId, string machineName);
```
**Parameters**

| Name         | Description             | Type   |
|--------------|-------------------------|--------|
| machineId    | the machine's id        | bytes4 | 
| machineName | the name of the machine | string | 
</details>

### StateAdded
Emitted when a new State is added to Fismo. 

<details>
<summary>
View Details
</summary>

**Note**
- May be emitted multiple times during the addition of a Machine.

**Signature**

```solidity
event StateAdded(bytes4 indexed machineId, bytes4 indexed stateId, string stateName);
```
**Parameters**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string | 
</details>

### StateUpdated
Emitted when an existing State is updated. 

<details>
<summary>
View Details
</summary>

**Signature**

```solidity
event StateUpdated(bytes4 indexed machineId, bytes4 indexed stateId, string stateName);
```
**Parameters**

| Name      | Description           | Type   |
|-----------|-----------------------|--------|
| machineId | the machine's id      | bytes4 | 
| stateId   | the state's id        | bytes4 | 
| stateName | the name of the state | string | 
</details>

### TransitionAdded
Emitted when a new Transition is added to an existing State. 

<details>
<summary>
View Details
</summary>

**Note**
- May be emitted multiple times during the addition of a Machine or State.

**Signature**

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
</details>

## Functions

### installMachine
Install a Fismo Machine that requires no initialization.

<details>
<summary>
View Details
</summary>

**Emits**
- [`MachineAdded`](#machineadded)
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Reverts if**
- Caller is not contract owner
- Operator address is zero
- Machine id is not valid for Machine name
- Machine already exists

**Signature**
```solidity
function installMachine(FismoTypes.Machine memory _machine)
external;
```

**Arguments**

| Name     | Description                    | Type     |
| ---------- |--------------------------------|----------|
| _machine | the machine definition to add  | FismoTypes.Machine  | 
</details>

### installAndInitializeMachine
Install a Fismo Machine and initialize it.

<details>
<summary>
View Details
</summary>

**Emits**
- [`MachineAdded`](#machineadded)
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Reverts if**
- Caller is not contract owner
- Operator address is zero
- Machine id is not valid for Machine name
- Machine already exists
- Initializer call reverts

**Signature**
```solidity
function installAndInitializeMachine(
    FismoTypes.Machine memory _machine,
    address _initializer,
    bytes memory _calldata
)
external;
```

**Arguments**

| Name    | Description                       | Type  |
| --------- |-----------------------------------|-------|
| _machine | the machine definition to install | FismoTypes.Machine | 
| _initializer | the address of the initializer contract | address | 
| _calldata | the encoded function and args to pass in delegatecall | bytes | 
</details>

### addState
Add a State to an existing Machine.

<details>
<summary>
View Details
</summary>

**Emits**
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Note**
- The new state will not be reachable by any action
- Add one or more transitions to other states, targeting the new state

**Reverts if**
- Caller is not contract owner
- State id is invalid for State name
- Machine does not exist
- Any contained transition is invalid

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
</details>

### updateState
Update an existing State in an existing Machine.

<details>
<summary>
View Details
</summary>

**Note**
- State name and id cannot be changed.

**Emits**
- [`StateAdded`](#stateadded)
- [`TransitionAdded`](#transitionadded)

**Reverts if**
- Caller is not contract owner
- Machine does not exist
- State does not exist
- State id is invalid
- Any contained transition is invalid

**Use this when**
- Adding more than one transition
- Removing one or more transitions
- Changing exitGuarded, enterGuarded, guardLogic params

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
</details>

### addTransition
Add a Transition to an existing State of an existing Machine.

<details>
<summary>
View Details
</summary>

**Emits**
* [`TransitionAdded`](#transitionadded)

**Reverts if**
- Caller is not contract owner
- Machine does not exist
- State does not exist
- Action id is invalid
- Target state id is invalid

**Use this when**
- Adding only a single transition (use updateState for multiple)

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
</details>


[![Created by Futurescale](../images/created-by.png)](https://futurescale.com)