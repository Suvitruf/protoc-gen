'use strict';

const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const mkdirp = require('mkdirp');
const utils = require('./utils');

/***
 * @param {string?} options.inputFiles
 * @param {string?} options.inputPath
 * @param {string?} options.destinationPath
 * @param {boolean?} options.recursive
 * @param options
 */
module.exports.protoc = async (options) => {
    if (!options)
        throw new Error("No params");

    if (options.inputFiles) {
        return protocFiles(options.inputFiles, options.inputPath, options.destinationPath);
    }

    if (options.inputPath) {
        if(options.destinationPath)
            await utils.deleteDirectory(options.destinationPath);
        else
            options.destinationPath = path.join('/');

        return protocPath(options.inputPath, options.recursive, options.destinationPath);
    }
};

async function protocFiles(files, inputPath = null, destPath = null) {
    const filesStr = files.join(' ');
    const protoPath = inputPath ? `--proto_path=${inputPath}` : "";
    const destinationPath = destPath ? `output_dir=${destPath},` : "";
    const protocPath = '"' + path.join(__dirname, 'protoc', 'bin', 'protoc') + '"';
    const cmd = `${protocPath} ${protoPath} --js_out=${destinationPath}import_style=commonjs,binary:. ` + filesStr;

    console.log(`processing: ${cmd}`);

    childProcess.execSync(cmd);
}

async function protocPath(inputPath, recursive = true, destPath = null) {
    const items = fs.readdirSync(inputPath, {withFileTypes: true});
    const files = items.filter(item => !item.isDirectory())
        .map(item => item.name);

    if(destPath)
        await new Promise((resolve, reject) => {
            mkdirp(destPath, (err) => {
                if (err)
                    return reject(err);

                resolve();
            })
        });

    if (files.length)
        await protocFiles(files, inputPath, destPath);


    if(recursive)
        items.filter(item => item.isDirectory())
            .map(item => item.name)
            .forEach(async item => {
                await protocPath(path.join(inputPath, path.parse(item).base), recursive, destPath ? path.join(destPath, path.parse(item).base) : null);
            });
}
