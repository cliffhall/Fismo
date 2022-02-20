![Fismo](../images/fismo-logo.png)
## [Lab](../../README.md) 🧪 [Setup](../setup.md) 🧪 [Tasks](../tasks.md) 🧪 API 🧪 [FAQ](../faq.md) 🧪 [About](../about.md)

## Fismo API
### IFismoOperate 💥 [IFismoUpdate](IFismoUpdate.md)  💥 [IFismoView](IFismoView.md)

## Interface [IFismoOperate.sol](../../contracts/interfaces/IFismoOperate.sol)
### Invoke Actions on Fismo Machines
The ERC-165 identifier for this interface is `0xcad6b576`

## Events

- [StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed priorStateId)](#stateexited)

- [StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId)](#stateentered)

- [Transitioned(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId, FismoTypes.ActionResponse response)](#transitioned)

### StateExited

```solidity
event StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed priorStateId);
```
**Parameters**

| Name         | Description                 | Type     |
|--------------|-----------------------------|----------|
| user         | the user's wallet address   | address  | 
| machineId    | the machine's id            | bytes4  | 
| priorStateId | the id of state exited | bytes4  | 


### StateEntered

```solidity
event StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId);
```
**Parameters**

| Name         | Description               | Type     |
|--------------|---------------------------|----------|
| user         | the user's wallet address | address  | 
| machineId    | the machine's id          | bytes4  | 
| newStateId | the id of state entered   | bytes4  | 


### Transitioned

```solidity
event Transitioned(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId, FismoTypes.ActionResponse response);
```
**Parameters**

| Name        | Description                  | Type     |
|-------------|------------------------------|----------|
| user        | the user's wallet address    | address  | 
| machineId   | the machine's id             | bytes4  | 
| actionId | the id of the action invoked | bytes4  | 
| response | the id of the action invoked | FismoTypes.ActionResponse  | 


## Functions
- [`invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)`](#invokeAction)

### invokeAction
Invoke an action on a configured machine.

**Emits events**
* [`StateExited`](#stateexited)
* [`StateEntered`](#stateentered)
* [`Transitioned`](#transitioned)

**Reverts if**
- caller is not the machine's operator (contract or EOA)
- _`machineId` does not refer to a valid machine
- _`actionId` is not valid for the user's current state in the given machine
- any invoked guard logic reverts (revert reason is guard response)

**Signature**
```solidity
function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
external
returns(FismoTypes.ActionResponse memory response);
```

**Arguments**

| Name      | Description                    | Type     |
| ----------- |--------------------------------|----------|
| _user | the user's wallet address      | address  | 
| _machineId | the machine's id               | bytes4  | 
| _actionId | the id of the action to invoke | bytes4  | 

**Return Values**

| Name        | Description                                | Type          |
| ------------- |--------------------------------------------|-------------|
| response | the address of the guard logic implementation contract| FismoTypes.ActionResponse |