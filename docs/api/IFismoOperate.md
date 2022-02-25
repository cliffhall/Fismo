![Fismo](../images/fismo-logo.png)
## [Status](../../README.md) 🧪 [About](../about.md)  🧪 Docs 🧪 [FAQ](../faq.md)

## Developer Documentation

### [Intro](../intro.md) 💥 [Setup](../setup.md) 💥 [Tasks](../tasks.md) 💥 API

## Fismo API
### IFismoOperate 💥 [IFismoUpdate](IFismoUpdate.md)  💥 [IFismoView](IFismoView.md)

## Interface [IFismoOperate](../../contracts/interfaces/IFismoOperate.sol)
###  Operate Fismo Machines
The ERC-165 identifier for this interface is `0xcad6b576`

## Events

### Transitioned
Emitted when a user transitions from one State to another.

<details>
<summary>
View Details
</summary>

**Signature**
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
</details>

## Functions

### invokeAction
Invoke an action on a configured Machine.

<details>
<summary>
View Details
</summary>

**Emits**
* [`Transitioned`](#transitioned)

**Reverts if**
- Caller is not the machine's Operator address
- Machine does not exist
- Action is not valid for the user's current State in the given Machine
- Any invoked guard logic reverts

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
</details>