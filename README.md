[![Apache 2.0 License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![NPM](https://img.shields.io/npm/v/protoc-gen.svg)](https://www.npmjs.com/package/protoc-gen)

#Disclaimer
It was really annoying to download protoc binary each time, so I've written this module for myself. But feel free to use :D

#Protocol Buffers Compiler (protoc) for Node.js 
A wrapper in Node for the compiled protoc from [https://github.com/google/protobuf](https://github.com/google/protobuf).

# Version
It's currently using Protocol Buffers `v3.7.1` (`proto3`).

# Platforms
Windows, Linux and OSX in x86_64 and x86_32.

#Examples

##From nodejs srcipt

If your directory looks like:
  
    project
    │   [...] 
    │
    └───models
    │   │   base.proto
    │   │
    │   └───nested
    │       │   base_nested.proto
    │       │ 
    │       └───nested2
    │       │    base_nested_2.proto

###Not Recursive

```JavaScript
const path = require('path');
const protoc = require('protoc-gen');


protoc.protoc({inputPath: path.join('models'), recursive: false, destinationPath: path.join('out')})
    .catch(err => {
        console.log(err);
    });
```

It will look:

    project
    │   [...] 
    │
    └───models
    │   │   base.proto
    │   │
    │   └───nested
    │       │   base_nested.proto
    │       │ 
    │       └───nested2
    │       │    base_nested_2.proto
    │   
    └───out
        │   base_pb.js

###Recursive

```JavaScript
const path = require('path');
const protoc = require('protoc-gen');


protoc.protoc({inputPath: path.join('models'), recursive: true, destinationPath: path.join('out')})
    .catch(err => {
        console.log(err);
    });
```

It will look:

    project
    │   [...] 
    │
    └───models
    │   │   base.proto
    │   │
    │   └───nested
    │       │   base_nested.proto
    │       │ 
    │       └───nested2
    │       │    base_nested_2.proto
    │   
    └───out
        │   base_pb.js
        │
        └───nested
            │    base_nested_pb.js
            │ 
            └───nested2
            │    base_nested_2_pb.js

###File list

```JavaScript
const path = require('path');
const protoc = require('protoc-gen');


protoc.protoc({inputPath: path.join('models'), inputFiles: ['base.proto'], destinationPath: path.join('out')})
    .catch(err => {
        console.log(err);
    });
```

    project
    │   [...] 
    │
    └───modesl
    │   │   base.proto
    │   │
    │   └───nested
    │       │   base_nested.proto
    │       │ 
    │       └───nested2
    │       │    base_nested_2.proto
    │   
    └───out
        │   base_pb.js


##From cli

`npm explore protoc-gen -- npm run gen -- --input_path ../../models --dest_path ../../out --r`

Result:

    project
    │   [...] 
    │
    └───models
    │   │   base.proto
    │   │
    │   └───nested
    │       │   base_nested.proto
    │       │ 
    │       └───nested2
    │       │    base_nested_2.proto
    │   
    └───out
        │   base_pb.js
        │
        └───nested
            │    base_nested_pb.js
            │ 
            └───nested2
            │    base_nested_2_pb.js

### Arguments
|    Argument          |  Alias          | Description                                  |
|----------------------|-----------------|----------------------------------------------|
| `--recursive`        | `--r`           | Will check all nested directories            | 
| `--input_path`       |  `--inp_path`   | Root directory where  .proto files located   |   
| `--input_files`      |  `--inp_files`  | Exact  .proto files list                     |   
| `--destination_path` |  `--dest_path`  | Root directory where put generated .js files | 

