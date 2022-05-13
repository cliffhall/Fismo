---
layout: default
title: Machine
parent: Domain Model
nav_order: 2
---
# Machine
* View Struct in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L19)
* View Class [Machine.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/Machine.js)
* The complete on-chain definition of a machine.

## Constructor
#### Signature

```javascript
constructor (
    operator, 
    name, 
    states,
    initialStateId, 
    uri
)
```

#### Parameters

| Name           | Description                                                        | Type      |
|----------------|--------------------------------------------------------------------|-----------|
| `operator`    | address of approved operator contract                              | `string`  |
| `name`         | name of machine. begin with letter, no spaces, a-z, A-Z, 0-9, and _ | `string`  |
| `states` | all of the valid States for this machine                           | `State[]` |
| `initialStateId`  | keccak256 hash of initial state name                               | `string`  |
| `uri`    | off-chain URI of metadata describing the machine                   | `string`  |

## Static Members
#### Methods
* [`fromObject`](#-fromobject)
* [`fromStruct`](#-fromstruct)

## 🦠 `fromObject`
Get a new `Machine` instance from an object representation.

#### Signature
```javascript
Machine.fromObject(o)
```
#### Parameters

| Name     | Description      | Type   |
|----------|------------------|--------|
| `o`        | the plain object | `object` | 

#### Returns

| Description       | Type           |
|-------------------|----------------|
| the instance | `Machine` | 

## 🦠 `fromStruct`
Get a new `Machine` instance from a struct representation.

#### Signature
```javascript
Machine.fromStruct(struct)
```
#### Parameters

| Name   | Description | Type  |
|--------|-------------|-------|
| `struct` | the struct  | `Array` | 

#### Returns

| Description       | Type           |
|-------------------|----------------|
| the instance | `Machine` |

## Instance Members
#### Properties
* operator
* id
* name
* initialStateId
* states
* uri

#### Methods
* [`toObject`](#-toobject)
* [`toString`](#-tostring)
* [`toStruct`](#-tostruct)
* [`clone`](#-clone)
* [`isValid`](#-isvalid)

## 🦠 `toObject`
Get a plain object representation of this `Machine` instance.

#### Signature
```javascript
instance.toObject()
```

#### Returns

| Description      | Type   |
|------------------|--------|
| the plain object | `object` | 

## 🦠 `toString`
Get a string representation of this `Machine` instance.

#### Signature
```javascript
instance.toString()
```

#### Returns

| Description              | Type   |
|--------------------------|--------|
| the flattened JSON | `string` | 

## 🦠 `toStruct`
Get a struct representation of this `Machine` instance.

#### Signature
```javascript
instance.toStruct()
```

#### Returns

| Description | Type  |
|-------------|-------|
| the struct  | `Array` | 

## 🦠 `clone`
Clone this `Machine` instance.

#### Signature
```javascript
instance.clone()
```

#### Returns

| Description         | Type           |
|---------------------|----------------|
| the cloned instance | `Machine` | 

## 🦠 `isValid`
Is this `Machine` instance valid?

#### Signature
```javascript
instance.isValid()
```

#### Returns

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | `boolean` | 


