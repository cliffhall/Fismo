---
layout: default
title: Transition
parent: Domain Model
nav_order: 5
---
# Transition
* View Struct in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L42)
* View Class [Transition.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/Transition.js)
* The complete on-chain definition of a transition.

## Constructor
#### Signature

```javascript
constructor (
    action,
    targetStateName
)
```

#### Parameters

| Name               | Description                                                       | Type    |
|--------------------|-------------------------------------------------------------------|---------|
| `action`           | Action name. no spaces, only a-z, A-Z, 0-9, and _ | `string`  |
| `targetStateName`  | Target State name. begin with letter, no spaces, a-z, A-Z, 0-9, and _      | `string` |

## Static Members
#### Methods
* [`fromObject`](#-fromobject)
* [`fromStruct`](#-fromstruct)

## 🦠 `fromObject`
Get a new `Transition` instance from an object representation.

#### Signature
```javascript
Transition.fromObject(o)
```
#### Parameters

| Name     | Description      | Type   |
|----------|------------------|--------|
| `o`        | the plain object | `object` | 

#### Returns

| Description       | Type           |
|-------------------|----------------|
| the instance | `Transition` | 

## 🦠 `fromStruct`
Get a new `Transition` instance from a struct representation.

#### Signature
```javascript
Transition.fromStruct(struct)
```
#### Parameters

| Name   | Description | Type  |
|--------|-------------|-------|
| `struct` | the struct  | `Array` | 

#### Returns

| Name    | Description       | Type           |
|---------|-------------------|----------------|
|         | the instance | `Transition` |

## Instance Members
#### Properties
* action
* actionId
* targetStateName
* targetStateId

#### Methods
* [`toObject`](#-toobject)
* [`toString`](#-tostring)
* [`toStruct`](#-tostruct)
* [`clone`](#-clone)
* [`isValid`](#-isvalid)

## 🦠 `toObject`
Get a plain object representation of this `Transition` instance.

#### Signature
```javascript
instance.toObject()
```

#### Returns

| Name    | Description      | Type   |
|---------|------------------|--------|
|         | the plain object | `object` | 

## 🦠 `toString`
Get a string representation of this `Transition` instance.

#### Signature
```javascript
instance.toString()
```

#### Returns

| Name    | Description              | Type   |
|---------|--------------------------|--------|
|         | the JSON representation | `string` | 

## 🦠 `toStruct`
Get a struct representation of this `Transition` instance.

#### Signature
```javascript
instance.toStruct()
```

#### Returns

| Description | Type  |
|-------------|-------|
| the struct  | `Array` | 

## 🦠 `clone`
Clone this `Transition` instance.

#### Signature
```javascript
instance.clone()
```

#### Returns

| Description         | Type           |
|---------------------|----------------|
| the cloned instance | `Transition` | 

## 🦠 `isValid`
Is this `Transition` instance valid?

#### Signature
```javascript
instance.isValid()
```

#### Returns

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | `boolean` | 
