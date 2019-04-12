'use strict';

//https://stackoverflow.com/a/41052903/1991579

const fs = require('fs');
const path = require('path');

module.exports.deleteFile = (dir, file) => {
    return new Promise(function (resolve, reject) {
        const filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(module.exports.deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
};

module.exports.deleteDirectory = (dir) => {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                if(err.code === 'ENOENT')
                    resolve();
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return module.exports.deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
};