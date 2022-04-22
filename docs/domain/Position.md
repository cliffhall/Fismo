---
layout: default
title: Position
parent: Domain Model
nav_order: 3
---
# Position
* View Struct in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L37)
* View Class [Position.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/Position.js)
* A machine-qualified state id.
* For recording history and reporting current position of a user.

## Constructor

```javascript
constructor (
    machineId, 
    stateId
)
```

**Parameters**

| Name           | Description                                  | Type   |
|----------------|----------------------------------------------|--------|
| machineId      | keccak256 hash of machine name   | string |
| name           | keccak256 hash of state name | string |

## Static Methods

### fromObject
Get a new `Position` instance from an object representation.

**Signature**
```javascript
Position.fromObject(o)
```
**Parameters**

| Name     | Description      | Type   |
|----------|------------------|--------|
| o        | the plain object | object | 

**Returns**

| Description       | Type           |
|-------------------|----------------|
| the instance | `Position` | 

### fromStruct
Get a new `Position` instance from a struct representation.

**Signature**
```javascript
Position.fromStruct(struct)
```
**Parameters**

| Name   | Description | Type  |
|--------|-------------|-------|
| struct | the struct  | Array | 

**Returns**

| Description       | Type           |
|-------------------|----------------|
| the instance | `Position` |

## Instance Methods

### toObject
Get a plain object representation of this `Position` instance.

**Signature**
```javascript
instance.toObject()
```

**Returns**

| Description | Type   |
|-------------|--------|
| the object  | object | 

### toString
Get a string representation of this `Position` instance.

**Signature**
```javascript
instance.toString()
```

**Returns**

| Description             | Type   |
|-------------------------|--------|
| the JSON representation | string | 

### toStruct
Get a struct representation of this `Position` instance.

**Signature**
```javascript
instance.toStruct()
```

**Returns**

| Description | Type  |
|-------------|-------|
| the struct  | Array | 

### clone
Clone this `Position` instance.

**Signature**
```javascript
instance.clone()
```

**Returns**

| Description         | Type           |
|---------------------|----------------|
| the cloned instance | Position | 

### isValid
Is this `Position` instance valid?

**Signature**
```javascript
instance.isValid()
```

**Returns**

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | boolean | 
