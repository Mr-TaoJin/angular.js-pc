angular.module('myFilters', [])
    .filter('checkmark', function () {
        return function (input) {
            return (input===true||input==='true'||input===1||input==='1') ? '\u2713' : '\u2718';
        };
    })
    //保留2位小数
    .filter('formatmoneymark', function () {
        return function (input) {
            if (input == undefined) {
                return '0.00';
            } else {
                return Number(input).toFixed(2);
            }

        };
    })
    //保留3位小数
    .filter('formatmoney3mark', function () {
        return function (input) {
            if (input == undefined) {
                return '0.000';
            } else {
                return Number(input).toFixed(3);
            }

        };
    })
    //整数
    .filter('formatmoneyint', function () {
        return function (input) {
            if (input == undefined) {
                return '0';
            } else {
                return Number(input).toFixed();
            }

        };
    })
    