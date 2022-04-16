---
layout: default
title: IFismoSupport
parent: API
nav_order: 4
---
![Fismo](../images/fismo-logo.png)
# [Status](../README.md) 🧪 [About](../about.md)  🧪 [FAQ](../faq.md) 🧪 Docs

## [Intro](../intro.md) 💥 [Setup](../setup.md) 💥 [Tasks](../tasks.md) 💥 API

### [IFismoClone](IFismoClone.md) 🔬 [IFismoOperate](IFismoOperate.md) 🔬 [IFismoOwner](IFismoOwner.md) 🔬 IFismoSupport 🔬 [IFismoUpdate](IFismoUpdate.md) 🔬 [IFismoView](IFismoView.md)

### Query Supported Interfaces
* View Interface [IFismoSupport.sol](../../contracts/interfaces/IFismoSupport.sol)
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


[![Created by Futurescale](../images/created-by.png)](https://futurescale.com)