---
layout: default
title: State
parent: Domain Model
nav_order: 4
---
# State
* View Struct in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L28)
* View Class [State.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/State.js)
* The complete on-chain definition of a state.

## Constructor
#### Signature

```javascript
constructor (
    name, 
    exitGuarded, 
    enterGuarded, 
    transitions, 
    guardLogic
)
```

#### Parameters

| Name          | Description                                                       | Type                                                        |
|---------------|-------------------------------------------------------------------|-------------------------------------------------------------|
| `name`          | name of state. begin with letter, no spaces, a-z, A-Z, 0-9, and _ | `string`                                                    |
| `exitGuarded`   | is there an exit guard?                                           | `boolean`                                                   |
| `enterGuarded`  | is there an enter guard?                                          | `boolean`                                                   |
| `transitions`   | all of the valid Transitions from this state                      | [`FismoTypes.Transition[]`](Transition.md) |
| `guardLogic`    | address of guard logic contract  | `string`                                                    |

## Static Members
#### Methods
* [`fromObject`](#-fromobject)
* [`fromStruct`](#-fromstruct)

## 🦠 `fromObject`
Get a new `State` instance from an object representation.

#### Signature
```javascript
State.fromObject(o)
```
#### Parameters

| Name     | Description      | Type   |
|----------|------------------|--------|
| `o`        | the plain object | `object` | 

#### Returns

| Description       | Type           |
|-------------------|----------------|
| the instance | `State` | 

## 🦠 `fromStruct`
Get a new `State` instance from a struct representation.

#### Signature
```javascript
State.fromStruct(struct)
```
#### Parameters

| Name   | Description | Type  |
|--------|-------------|-------|
| `struct` | the struct  | `Array` | 

#### Returns

| Description       | Type           |
|-------------------|----------------|
| the instance | `State` |

## Instance Members
#### Properties
* name
* id
* enterGuarded
* exitGuarded
* transitions
* guardLogic

#### Methods
* [`toObject`](#-toobject)
* [`toString`](#-tostring)
* [`toStruct`](#-tostruct)
* [`clone`](#-clone)
* [`isValid`](#-isvalid)

## 🦠 `toObject`
Get a plain object representation of this `State` instance.

#### Signature
```javascript
instance.toObject()
```

#### Returns

| Description       | Type   |
|-------------------|--------|
|  the plain object | `object` | 

## 🦠 `toString`
Get a string representation of this `State` instance.

#### Signature
```javascript
instance.toString()
```

#### Returns

| Description              | Type   |
|--------------------------|--------|
| the JSON representation | `string` | 

## 🦠 `toStruct`
Get a struct representation of this `State` instance.

#### Signature
```javascript
instance.toStruct()
```

#### Returns

| Description | Type  |
|-------------|-------|
| the struct  | `Array` | 

## 🦠 `clone`
Clone this `State` instance.

#### Signature
```javascript
instance.clone()
```

#### Returns

| Description         | Type           |
|---------------------|----------------|
| the cloned instance | `State` | 

## 🦠 `isValid`
Is this `State` instance valid?

#### Signature
```javascript
instance.isValid()
```

#### Returns

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | `boolean` | 
