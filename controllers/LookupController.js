
var XLSX = require('xlsx');
const multer = require('multer');
const fs = require("fs");
const randomstring = require('randomstring');
var path = require('path');
const Agent = require("../models/agent");
var rimraf = require('rimraf');




/**
 * Upload CSV or XL.
 *
 * @param {binary}      file
 *
 * @returns {Object}
 */

exports.uploadCSV = (request, response) => {

    uploadFilesLocal("data", 1, request, response, function (error, data) {
        if (error) {
            response.status(500).send({
                "error": true,
                "code": 500,
                "msg": "Something went wrong",
                "data": error
            });
        } else {
            try {
                if (request.files && request.files[0]) {
                    var file = request.files[0];
                    var workbook = XLSX.readFile(file.path);
                    rimraf(file.destination, function () { });
                    if (workbook && workbook.SheetNames && workbook.SheetNames[0] && workbook.Sheets[workbook.SheetNames[0]]) {
                        var data = readBulkFile(workbook.Sheets[workbook.SheetNames[0]]);
                        if (data.length) {
                            Agent.getModel().insertMany(data)
                                .then((data) => {
                                    response.status(201).send({
                                        "error": false,
                                        "code": 201,
                                        "msg": "File Uploaded Successfully",
                                    });
                                })
                                .catch((error) => {
                                    response.status(500).send({
                                        "error": true,
                                        "code": 500,
                                        "msg": "Something went wrong",
                                        "data": error
                                    });
                                })
                        } else {
                            response.status(400).send({
                                "error": true,
                                "code": 400,
                                'msg': `You Are Trying To Upload Empty File. Please try again later`
                            });
                        }
                    } else {
                        response.status(500).send({
                            "error": true,
                            "code": 500,
                            'msg': `Unable to process uploaded file. Please try again later`
                        });
                    }
                } else {
                    response.status(400).send({
                        "error": true,
                        "code": 400,
                        'msg': `Attached file not found, please try again`
                    });
                }
            } catch (error) {
                response.status(500).send({
                    "error": true,
                    "code": 500,
                    "msg": "Something went wrong",
                });
            }
        }
    })
};

function uploadFilesLocal(folderName, userId, request, response, callback) {
    try {
        var storage = multer.diskStorage({
            destination: function (request, response, callback) {
                var root = './uploads';
                if (!fs.existsSync(root)) {
                    fs.mkdirSync(root);
                }
                var dir = root + '/' + folderName + '/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                dir = root + '/' + folderName + '/' + userId + "/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                callback(null, dir);
            },
            filename: function (req, file, callback) {
                var convFileName = Date.now() + randomstring.generate({ length: 4, charset: 'alphabetic' }) + path.extname(file.originalname);
                callback(null, convFileName);
            },
            limits: "limit"
        });

        var upload = multer({
            storage: storage
        }).any();

        upload(request, response, callback);
    } catch (error) {
        console.log("from multer", error);

    }
}

function readBulkFile(uploadedFile) {
    //convert array data into json
    var headers = [];
    var sheet = uploadedFile;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r;
    /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({
            c: C,
            r: R
        })];
        /* find the cell in the first row */

        var hdr = C; // replaced header with coulumn name
        if (cell && cell.t) {
            hdr = XLSX.utils.format_cell(cell);
        }
        headers.push(hdr);
    }
    // For each sheets, convert to json.
    var data = XLSX.utils.sheet_to_json(uploadedFile);
    if (data.length > 0) {
        data.forEach(function (row) {
            // Set empty cell to blank string ' '.
            headers.forEach(function (hd) {
                if (row[hd] === undefined) {
                    row[hd] = null;
                }
            });
        });
    }
    return data;
}

