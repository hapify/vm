# Hapify VM

## Description

This repository provides a secured sandbox to execute unsafe JavaScript code

[![Build Status](https://travis-ci.org/hapify/vm.svg?branch=master)](https://travis-ci.org/hapify/vm) [![codecov](https://codecov.io/gh/hapify/vm/branch/master/graph/badge.svg)](https://codecov.io/gh/hapify/vm)

## Usage

### Basic usage

```typescript
import { HapifyVM } from 'hapify-vm';

const script = `const concat = a + b; return concat;`;
const result = new HapifyVM().run(script, { a: 'hello', b: 'world' }); // result = 'hello world'
```

### Advanced usage

```typescript
import { HapifyVM } from 'hapify-vm';

const script = `const sum = a + b; return sum;`;
const options = {
    timeout: 200, // Maximum script execution time. Default to 1000ms.
    allowAnyOutput: true // Allow the input script to return any data type. Default to false.
};
const result = new HapifyVM(options).run(script, { a: 1, b: 2 }); // result = 3
```

## Errors sent by this module

Errors range: 6000 to 6999

- 6001 (VmOutputError): Thrown when the script does not return a string or undefined.
- 6002 (VmEvaluationError): Thrown when the evaluation of the JS script causes an error.
- 6003 (VmTimeoutError): Thrown when the JS script is too long to process.
- 6004 (VmIntegrityError): Thrown when the script throws a modified error.
