---
layout: default
title: ActionResponse
parent: Domain Model
nav_order: 1
---
# ActionResponse
* View Struct [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol#L49)
* View Class [ActionResponse.js](https://github.com/cliffhall/Fismo/blob/main/scripts/domain/entity/ActionResponse.js)
* Fismo Domain Entity: ActionResponse
* The response from a successful state transition. 
* May include messages from Enter and/or Exit guard code.

## Constructor

```javascript
    constructor (
        machineName, 
        action, 
        priorStateName, 
        nextStateName,
        exitMessage, 
        enterMessage
)
```

**Parameters**

| Name           | Description                                  | Type   |
|----------------|----------------------------------------------|--------|
| machineName    | name of machine                              | string |
| action         | name of action that triggered the transition | string |
| priorStateName | name of prior state                          | string |
| nextStateName  | name of new state                            | string |
| exitMessage    | response from the prior state's exit guard   | string |
| enterMessage   | response from the new state's enter guard    | string |

## Static Methods

### fromObject
Get a new `ActionResponse` instance from an object representation.

**Signature**
```javascript
ActionResponse.fromObject(o)
```
**Parameters**

| Name     | Description      | Type   |
|----------|------------------|--------|
| o        | the plain object | object | 

**Returns**

| Description       | Type           |
|-------------------|----------------|
| the instance | `ActionResponse` | 

### fromStruct
Get a new `ActionResponse` instance from a struct representation.

**Signature**
```javascript
ActionResponse.fromStruct(struct)
```
**Parameters**

| Name   | Description | Type  |
|--------|-------------|-------|
| struct | the struct  | Array | 

**Returns**

| Description       | Type           |
|-------------------|----------------|
| the instance | `ActionResponse` |

## Instance Methods

### toObject
Get a plain object representation of this `ActionResponse` instance.

**Signature**
```javascript
instance.toObject()
```

**Returns**

| Name    | Description      | Type   |
|--------|
| the plain object | object | 

### toString
Get a string representation of this `ActionResponse` instance.

**Signature**
```javascript
instance.toString()
```

**Returns**

| Description              | Type   |
|--------------------------|--------|
| the JSON representation | string | 

### toStruct
Get a struct representation of this `ActionResponse` instance.

**Signature**
```javascript
instance.toStruct()
```

**Returns**

| Description | Type  |
|-------------|-------|
| the struct  | Array | 

### clone
Clone this `ActionResponse` instance.

**Signature**
```javascript
instance.clone()
```

**Returns**

| Description  | Type           |
|--------------|----------------|
| the instance | ActionResponse | 


### isValid
Is this `ActionResponse` instance valid?

**Signature**
```javascript
instance.isValid()
```

**Returns**

| Description                   | Type    |
|-------------------------------|---------|
| true if the instance is valid | boolean | 
