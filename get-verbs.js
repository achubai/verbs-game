/**
 * Created by achubai on 3/30/2016.
 */

var fs = require('fs');

fs.readFile('verbs.txt', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    } else {
        var arr = data.split(';\r\n');
        var newArr = [];

        for (i in arr) {
            var verb = arr[i].split('|');
            var obj = {};

            obj.v1 = verb[0];
            obj.v2 = verb[1];
            obj.v3 = verb[2];
            obj.translate = verb[3];

            newArr.push(obj);
        }

        fs.writeFile('new.json', JSON.stringify(newArr), function (err) {
            if(err) {
                return console.log(err);
            }

            console.log('Ok');
        })
    }
});