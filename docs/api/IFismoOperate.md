---
layout: default
title: IFismoOperate
parent: Interfaces
nav_order: 2
---
# Operate Fismo Machines
* View Interface [IFismoOperate.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoOperate.sol)
* The ERC-165 identifier for this interface is `0xcad6b576`

## Events
* [UserTransitioned](#usertransitioned)

### UserTransitioned
Emitted when a user transitions from one State to another.

#### Signature
```solidity
event UserTransitioned (
    address indexed user, 
    bytes4 indexed machineId, 
    bytes4 indexed newStateId, 
    FismoTypes.ActionResponse response
);
```
#### Parameters

| Name        | Description                  | Type     |
|-------------|------------------------------|----------|
| user        | the user's wallet address    | address  | 
| machineId   | the machine's id             | bytes4  | 
| actionId | the id of the action invoked | bytes4  | 
| response | the id of the action invoked | [FismoTypes.ActionResponse](../domain/ActionResponse.md)  |

## Methods
* [invokeAction](#invokeaction)

### invokeAction
Invoke an action on a configured Machine.

#### Emits
* [`UserTransitioned`](#usertransitioned)

#### Reverts if
- Caller is not the machine's Operator address
- Machine does not exist
- Action is not valid for the user's current State in the given Machine
- Any invoked guard logic reverts

#### Signature
```solidity
function invokeAction(
    address _user, 
    bytes4 _machineId, 
    bytes4 _actionId
) 
external
returns(
    FismoTypes.ActionResponse memory response
);
```

#### Arguments

| Name      | Description                    | Type     |
| ----------- |--------------------------------|----------|
| _user | the user's wallet address      | address  | 
| _machineId | the machine's id               | bytes4  | 
| _actionId | the id of the action to invoke | bytes4  | 

#### Returns

| Name        | Description                                | Type          |
| ------------- |--------------------------------------------|-------------|
| response | the address of the guard logic implementation contract| [FismoTypes.ActionResponse](../domain/ActionResponse.md) |