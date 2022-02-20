![Fismo](../images/fismo-logo.png)
## [Lab](../../README.md) 🧪 [Setup](../setup.md) 🧪 [Tasks](../tasks.md) 🧪 API 🧪 [FAQ](../faq.md) 🧪 [About](../about.md)

## Fismo API
### [IFismoOperate](IFismoOperate.md) 💥 [IFismoUpdate](IFismoUpdate.md)  💥 IFismoView

## Interface [IFismoView.sol](../../contracts/interfaces/IFismoView.sol)
### View Fismo Storage
The ERC-165 identifier for this interface is `0x26276912`

## Functions

### getGuardAddress
Get the implementation address for a given Guard selector.

<details>
<summary>
View Details
</summary>

**Reverts if**
- Guard logic implementation is not defined

**Signature**
```solidity
function getGuardAddress(bytes4 _functionSelector)
external
view
returns (address guardAddress);
```

**Arguments**

| Name        | Type           | Description                              |
| ------------- |------------- |------------------------------------------|
| _functionSelector | bytes4 | the bytes4 sighash of function signature | 

**Return Values**

| Name        | Type           | Description                                |
| ------------- |------------- |--------------------------------------------|
| guardAddress | address | the address of the guard logic implementation contract|
</details>

### getLastPosition
Get the last recorded position of the given user.

<details>
<summary>
View Details
</summary>

**Signature**
```solidity
function getLastPosition(address _user)
external
view
returns (FismoTypes.Position memory position);
```

**Arguments**

| Name       | Type    | Description                              |
| ----------- |---------|------------------------------------------|
| _user | address | the address of the user | 

**Return Values**

| Name        | Type                | Description                                |
| ------------- |---------------------|--------------------------------------------|
| position | FismoTypes.Position | the last recorded position of the given user|
</details>

### getPositionHistory
Get the entire position history for a given user.

<details>
<summary>
View Details
</summary>

**Signature**
```solidity
function getPositionHistory(address _user)
external
view
returns (FismoTypes.Position[] memory history);
```

**Arguments**

| Name       | Type    | Description                              |
| ----------- |---------|------------------------------------------|
| _user | address | the address of the user | 

**Return Values**

| Name        | Type                  | Description                               |
| ------------- |-----------------------|-------------------------------------------|
| history | FismoTypes.Position[] | an array of Position structs|
</details>

### getUserState
Get the current state for a given user in a given machine.

<details>
<summary>
View Details
</summary>

**Reverts if**
- Machine does not exist

**Signature**
```solidity
function getUserState(address _user, bytes4 _machineId)
external
view
returns (bytes4 currentStateId);
```

**Arguments**

| Name      | Type    | Description           |
| ---------- |---------|-----------------------|
| _user | address | the address of the user | 
| _machineId | bytes4 | the id of the machine | 

**Return Values**

| Name        | Type                   | Description                                    |
| ------------- |------------------------|------------------------------------------------|
| currentStateId | bytes4 | the user's current state in the given machine  |

</details>


