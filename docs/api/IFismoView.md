---
layout: default
title: IFismoView
parent: Contract Interfaces
nav_order: 6
---
# View Fismo Storage
* View Interface [IFismoView.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoView.sol)
* The ERC-165 identifier for this interface is `0x691b5451`

## Functions
### getLastPosition
Get the last recorded position of the given user.

**Signature**
```solidity
function getLastPosition (
    address _user
)
external
view
returns (
    bool success, 
    FismoTypes.Position memory position
);
```

**Arguments**

| Name       | Description                              | Type    |
| ----------- |------------------------------------------|---------|
| _user | the address of the user | address | 

**Return Values**

| Name        | Description                                | Type                |
| ------------- |--------------------------------------------|---------------------|
| success |  whether any history exists for the user | bool |
| position | the last recorded position of the given user| FismoTypes.Position |

### getPositionHistory
Get the entire position history for a given user.

**Signature**
```solidity
function getPositionHistory (
    address _user
)
external
view
returns (
    bool success, 
    FismoTypes.Position[] memory history
);
```

**Arguments**

| Name       | Description                              | Type    |
| ----------- |------------------------------------------|---------|
| _user | the address of the user | address | 

**Return Values**

| Name    | Description                   | Type |
| ------- |-------------------------------|------|
| success |  whether any history exists for the user | bool |
| history | an array of Position structs  | FismoTypes.Position[] |

### getUserState
Get the current state for a given user in a given machine.

**Reverts if**
- Machine does not exist

**Note**
- If the user has not interacted with the machine, the initial state for the machine is returned.

**Signature**
```solidity
function getUserState (
    address _user, 
    bytes4 _machineId
)
external
view
returns (
    FismoTypes.State memory state
);
```

**Arguments**

| Name      | Description           | Type    |
| ---------- |-----------------------|---------|
| _user | the address of the user | address | 
| _machineId | the id of the machine | bytes4 | 

**Return Values**

| Name  | Type | Description                          |
|-------|---|--------------------------------------|
| state | FismoTypes.State  | the user's current state in the given machine |