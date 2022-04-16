---
layout: default
title: IFismoClone
parent: Contract Interfaces
nav_order: 1
---
# Clone the Fismo Contract
* View Interface [IFismoClone.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoClone.sol)
* The ERC-165 identifier for this interface is `0x08a9f5ec`

## Events

### FismoCloned
Emitted when a user clones the Fismo contract.

**Signature**
```solidity
event FismoCloned(
    address indexed owner, 
    address indexed instance
);
```
**Parameters**

| Name     | Description               | Type                     |
|----------|---------------------------|--------------------------|
| owner    | the owner's wallet        | address                  | 
| instance | the cloned Fismo instance | address                  |

## Functions

### cloneFismo
Creates and returns the address of a Fismo clone.

**Reverts if**
* Being called on a clone 

**Emits**
* [`FismoCloned`](#fismocloned)

**Note**
* The owner of the new instance will be the caller of the `cloneFismo` method.
* No storage data from the original contract is visible to the cloned instance.
* The instance is actually an [ERC-1167 Minimal Proxy](https://eips.ethereum.org/EIPS/eip-1167) that delegates all of its calls to the Fismo implementation contract it is cloned from, while maintaining its own storage. 
* The Fismo clone is orders of magnitude cheaper to deploy than the full Fismo contract and behaves exactly the same. 
* And finally yes, you *could* try to make a clone of a clone. And it would work... ok. 
  * Unfortunately, like Micheal Keaton in [Multiplicity](https://en.wikipedia.org/wiki/Multiplicity_(film)), you would realize a sort of fidelity loss with each successive clone in the chain. 
  * Although the logic would operate the same and the clone would store the data, each clone would be delegating the call to the clone it came from, increasing the transaction cost with each delegation.
  * To avoid this hidden expense for the unwary, the `cloneFismo` method reverts if attempting to clone a clone.

**Signature**
```solidity
function cloneFismo() 
external 
returns (
    address instance
);
```

**Return Values**

| Name     | Description                          | Type    |
|----------|--------------------------------------|---------|
| instance | the address of cloned Fismo instance | address |


### init
Initialize this Fismo instance.

**Reverts if**
* Owner is not zero address

**Note**
* Must be external to be called from the Fismo factory.
* Is called immediately after cloning by `cloneFismo` and can not be called again.

**Signature**
```solidity
function init(
    address _owner
) 
external;
```

**Arguments**

| Name     | Description                          | Type    |
|----------|--------------------------------------|---------|
| _owner | the address of cloned Fismo instance | address |


[![Created by Futurescale](../images/created-by.png)](https://futurescale.com)