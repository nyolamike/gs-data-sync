var express = require('express');
var fs = require("fs")
var rl = require("readline")
var http = require('http');

var app = express();

//key indexes
const keyIndexes = {
    Title: 0, 
    Description: 1,
    ClientSiteName: 2,
    ClientSiteXRefCode: 3,
    CompanyName: 4,
    ParentCompanyName: 5,
    JobDetailsUrl: 6,
    ApplyUrl: 7,
    AddressLine1: 8,
    City: 9,
    State: 10,
    Country: 11,
    PostalCode: 12,
    JobFamily: 13,
    DatePosted: 14,
    LastUpdated: 15,
    ReferenceNumber: 16,
    CultureCode: 17,
    ParentRequisitionCode: 18,
    JobType: 19,
    TravelRequired: 20,
    IsVirtualLocation: 21,
};

const process_csv = () => {
    var aPromise = new Promise(function(resolve, reject) {
        try {
            var arr = []
            stream = fs.createReadStream("data/email.csv")
            reader = rl.createInterface({ input: stream })
            reader.on("line", (row) => {
                arr.push(row.split(";"))
            })
            .on('close', function () {
                resolve(arr);
            });
        }catch (err) {
            reject(err)
        }
    });
    return aPromise;
}

const post_csv_data = (csv_data) => {
    var aPromise = new Promise(function(resolve, reject) {
        try {
            var resData = [];
            csv_data.forEach((csvRecordRow) => {
                var temp = {};
                for(const key in keyIndexes) {
                    if (Object.hasOwnProperty.call(keyIndexes, key)) {
                        const csvIndex = keyIndexes[key];
                        temp[key] = csvIndex < csvRecordRow.length ? csvRecordRow[csvIndex]: ""
                    }
                }
                resData.push(temp);
            })
            resolve(resData);
        }catch (err) {
            reject(err)
        }
    });
    return aPromise;
}

app.get('/', function (req, res) {
    process_csv()
    .then((csvData) => {
        console.error("we are coolx", csvData)
        post_csv_data(csvData)
        .then((dataSent) => {
            res.send(JSON.stringify(dataSent));
        })
        .catch(err2 => console.error(":error in saving data: ", err))
    })
    .catch(err => console.error(":error in processing file: ", err))
});

app.listen(3000, function () {
    console.log('GS: Data Sync Running @port 3000!');
});