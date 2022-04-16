---
layout: default
title: IFismoOwner
parent: Contract Interfaces
nav_order: 3
---
# Manage Fismo Ownership
* View Interface [IFismoOwner.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoOwner.sol)
* This is the ERC-173 Ownership Standard
* The ERC-165 identifier for this interface is `0x7f5828d0`

## Events

### OwnershipTransferred
Emitted when ownership of the Fismo instance is transferred.

**Signature**
```solidity
event OwnershipTransferred (
    address indexed previousOwner
    address indexed newOwner
);
```
**Parameters**

| Name         | Description                              | Type    |
|--------------|------------------------------------------|---------|
| previousOwner    | the previous owner of the Fismo instance | address |
| newOwner    | the new owner of the Fismo instance      | address |

## Functions

### owner
Get the address of the Fismo instance's owner

**Signature**
```solidity
function owner () 
external
returns (address);
```

**Returns**

| Name          | Description                   | Type    |
|---------------|-------------------------------|---------|
|       | the owner's address  | address |

### transferOwnership
Transfer ownership of the Fismo instance to another address.

**Emits**
- [`OwnershipTransferred`](#ownershiptransferred)

**Reverts if**
- Caller is not contract owner
- New owner is zero address

**Signature**
```solidity
function transferOwnership (
    address _newOwner
) 
external;
```

**Arguments**

| Name           | Description                    | Type    |
|----------------|--------------------------------|---------|
| _newOwner      | the new owner's address  | address |



[![Created by Futurescale](../images/created-by.png)](https://futurescale.com)