'use strict';

const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const unzip = require('unzip');
const fs = require('fs');
const ProtocVersion = '3.7.1';

const baseUrl = `https://github.com/protocolbuffers/protobuf/releases/download/v${ProtocVersion}/`;
let platform = null;

switch (process.platform) {
    case 'win32':
        if (process.arch === 'x64')
            platform = 'win64';
        else if (process.arch === 'ia32')
            platform = 'win32';
        break;
    case 'linux':
        if (process.arch === 'x64')
            platform = 'linux-x86_64';
        else if (process.arch === 'ia32')
            platform = 'linux-x86_32';
        break;
    case 'darwin':
        if (process.arch === 'x64')
            platform = 'osx-x86_64';
        else if (process.arch === 'ia32')
            platform = 'osx-x86_32';
        break;
}

if (platform === null) {
    throw new Error("Can't determine the platform");
}

const fileName = `protoc-${ProtocVersion}-${platform}.zip`;

request(baseUrl + fileName)
    .pipe(unzip.Parse())
    .on("entry", function (entry) {
        const isFile = "File" === entry.type;
        const isDir = "Directory" === entry.type;
        const fullpath = path.join(__dirname, "protoc", entry.path);
        const directory = isDir ? fullpath : path.dirname(fullpath);

        mkdirp(directory, function (err) {
            if (err) throw err;
            if (isFile) {
                entry.pipe(fs.createWriteStream(fullpath))
                    .on("finish", function () {
                        fs.chmod(fullpath, 0o755, function (err) {
                            if (err) throw err;
                        });
                    });
            }
        });
    });