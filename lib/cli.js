'use strict';

const path = require('path');

const protoc = require('./protoc');

let recursive = false;
let inputPath = null;
let inputFiles = null;
let destPath = null;

process.argv.forEach(function (val, index, array) {
    if (val === "--r" || val === "--recursive")
        recursive = true;

    if ((val === "--input_path" || val === "--inp_path") && array.length > index + 1)
        inputPath = array[index + 1];

    if ((val === "--input_files" || val === "--inp_files") && array.length > index + 1)
        inputFiles = array[index + 1];

    if ((val === "--destination_path" || val === "--dest_path") && array.length > index + 1)
        destPath = array[index + 1];
});

//console.log(`${inputFiles}, ${inputPath}, ${destPath}, ${recursive}`);

if (inputFiles)
    return protoc.protoc({inputFiles: inputFiles.split(',').map(f => path.join(f)), inputPath: path.join(inputPath ? inputPath : '/'), recursive: recursive, destinationPath: destPath ? path.join(destPath) : null})
        .catch(err => {
            console.log(err);
        });

if (inputPath)
    return protoc.protoc({inputPath: path.join(inputPath), recursive: recursive, destinationPath: destPath ? path.join(destPath) : null})
        .catch(err => {
            console.log(err);
        });

throw new Error("Bad arguments");