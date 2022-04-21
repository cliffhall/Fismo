---
layout: default
title: IFismoSupport
parent: Interfaces
nav_order: 4
---
# Query Supported Interfaces
* View Interface [IFismoSupport.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/interfaces/IFismoSupport.sol)
* This is the ERC-165 Interface Detection Standard
* The ERC-165 identifier for this interface is `0x01ffc9a7`

## Functions

### supportsInterface
Query whether Fismo supports a given interface

**Signature**
```solidity
function supportsInterface (
    bytes4 _interfaceId
) 
external 
view 
returns (bool);
```

**Arguments**

| Name           | Description                    | Type   |
|----------------|--------------------------------|--------|
| _interfaceId      |the sighash of the given interface  | bytes4 |