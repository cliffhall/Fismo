---
layout: default
title: Transition
grand_parent: Domain Model
parent: Entity
nav_order: 5
---
# Transition
* View Struct in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L42)
* View Class [Transition.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/Transition.js)
* Fismo Domain Entity: `Transition`

## Constructor

```javascript
constructor (
    name, 
    exitGuarded, 
    enterGuarded, 
    transitions, 
    guardLogic
)
```

**Parameters**

| Name          | Description                                                       | Type    |
|---------------|-------------------------------------------------------------------|---------|
| name          | name of state. begin with letter, no spaces, a-z, A-Z, 0-9, and _ | string  |
| exitGuarded   | is there an exit guard?                                           | boolean |
| enterGuarded  | is there an enter guard?                                          | boolean |
| transitions   | all of the valid Transitions from this state                      | Array   |
| guardLogic    | address of guard logic contract  | string  |

## Static Methods

### fromObject
Get a new `Transition` instance from an object representation.

**Signature**
```javascript
Transition.fromObject(o)
```
**Parameters**

| Name     | Description      | Type   |
|----------|------------------|--------|
| o        | the plain object | object | 

**Returns**

| Description       | Type           |
|-------------------|----------------|
| the instance | `Transition` | 

### fromStruct
Get a new `Transition` instance from a struct representation.

**Signature**
```javascript
Transition.fromStruct(struct)
```
**Parameters**

| Name   | Description | Type  |
|--------|-------------|-------|
| struct | the struct  | Array | 

**Returns**

| Name    | Description       | Type           |
|---------|-------------------|----------------|
|         | the instance | `Transition` |

## Instance Methods

### toObject
Get a plain object representation of this `Transition` instance.

**Signature**
```javascript
instance.toObject()
```

**Returns**

| Name    | Description      | Type   |
|---------|------------------|--------|
|         | the plain object | object | 

### toString
Get a string representation of this `Transition` instance.

**Signature**
```javascript
instance.toString()
```

**Returns**

| Name    | Description              | Type   |
|---------|--------------------------|--------|
|         | the JSON representation | string | 

### toStruct
Get a struct representation of this `Transition` instance.

**Signature**
```javascript
instance.toStruct()
```

**Returns**

| Description | Type  |
|-------------|-------|
| the struct  | Array | 

### clone
Clone this `Transition` instance.

**Signature**
```javascript
instance.clone()
```

**Returns**

| Description         | Type           |
|---------------------|----------------|
| the cloned instance | Transition | 

### isValid
Is this `Transition` instance valid?

**Signature**
```javascript
instance.isValid()
```

**Returns**

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | boolean | 
