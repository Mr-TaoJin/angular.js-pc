angular.module('myFilters', [])
    .filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse)
                filtered.reverse();
            return filtered;
        };
    })
    .filter('checkmark', function () {
        return function (input) {
            return (input===true||input==='true'||input===1||input==='1') ? '\u2713' : '\u2718';
        };
    }) 
    .filter('resolvetypemark', function () {
    	return function (input) {
			if(input=='0' || input==0){
				return '未处理';
			}else if(input=='-1' || input==-1){
				return '问题单';
			}else if(input=='1' || input==1){
				return '处理成功';
			}else{
				return '';
			}
        };
    })
    //会员状态
    .filter('vipstatusmark', function () {
        return function (input) {
            if (input == '0' || input == 0) {
                return '未激活';
            } else if (input == '1' || input == 1) {
                return '激活';
            } else if (input == '2' || input == 2) {
                return '停用';
            } else if (input == '3' || input == 3) {
                return '挂失';
            }
        };
    })
    .filter('sourcemark', function () {
        return function (input) {
            if (input == 1 || input == '1') {
                return 'erp';
            } else if (input == 6 || input == '6') {
                return 'pos';
            } else if (input == 7 || input == '7') {
                return '百胜icrm';
            } else if (input == 8 || input == '8') {
                return 'e3后台';
            } else if (input == 9 || input == '9') {
                return '淘宝';
            } else if (input == 10 || input == '10') {
                return '拍拍';
            } else if (input == 11 || input == '11') {
                return 'openshop';
            } else if (input == 12 || input == '12') {
                return '分销商';
            } else if (input == 13 || input == '13') {
                return '京东';
            } else if (input == 14 || input == '14') {
                return '亚马逊';
            } else if (input == 15 || input == '15') {
                return 'QQ网购';
            } else if (input == 16 || input == '16') {
                return '一号店';
            } else if (input == 17 || input == '17') {
                return 'eBay';
            } else if (input == 18 || input == '18') {
                return '网络分销主站';
            } else if (input == 19 || input == '19') {
                return '淘宝分销';
            } else if (input == 20 || input == '20') {
                return '新浪';
            } else if (input == 21 || input == '21') {
                return 'shopex';
            } else if (input == 22 || input == '22') {
                return 'ecshop';
            } else if (input == 23 || input == '23') {
                return '当当';
            } else if (input == 24 || input == '24') {
                return '邮乐';
            } else if (input == 25 || input == '25') {
                return '乐酷天';
            } else if (input == 26 || input == '26') {
                return 'shopex分销王';
            } else if (input == 27 || input == '27') {
                return 'vjia';
            } else if (input == 28 || input == '28') {
                return '优购';
            } else if (input == 29 || input == '29') {
                return 'efast';
            } else if (input == 30 || input == '30') {
                return '微购物';
            } else if (input == 31 || input == '31') {
                return '微信';
            } else if (input == 32 || input == '32') {
                return '苏宁';
            } else if (input == 33 || input == '33') {
                return '唯品会';
            } else if (input == 34 || input == '34') {
                return '聚美优品';
            } else if (input == 35 || input == '35') {
                return '卖网';
            } else if (input == 36 || input == '36') {
                return '库巴';
            } else if (input == 37 || input == '37') {
                return '名鞋库';
            } else if (input == 38 || input == '38') {
                return '阿里巴巴';
            } else if (input == 39 || input == '39') {
                return '口袋通';
            } else if (input == 40 || input == '40') {
                return '工行';
            } else if (input == 41 || input == '41') {
                return '银泰';
            } else if (input == 42 || input == '42') {
                return '走秀网';
            } else if (input == 43 || input == '43') {
                return '贝贝网';
            } else if (input == 44 || input == '44') {
                return '蘑菇街';
            } else if (input == 45 || input == '45') {
                return '拍鞋网';
            } else if (input == 46 || input == '46') {
                return '好乐买';
            } else if (input == 47 || input == '47') {
                return '乐蜂';
            } else if (input == 48 || input == '48') {
                return '微盟';
            } else if (input == 49 || input == '49') {
                return '折800';
            } else if (input == 50 || input == '50') {
                return 'OS主站';
            } else if (input == 51 || input == '51') {
                return 'API接口';
            } else if (input == 52 || input == '52') {
                return 'ncm';
            } else if (input == 53 || input == '53') {
                return 'BSERP2';
            } else if (input == 54 || input == '54') {
                return 'BS3000+';
            } else if (input == 55 || input == '55') {
                return '第三方仓储物流';
            } else if (input == 56 || input == '56') {
                return '唯品会JIT';
            } else if (input == 57 || input == '57') {
                return 'ISHOP';
            } else if (input == 58 || input == '58') {
                return '飞牛';
            } else if (input == 59 || input == '59') {
                return '蜜芽';
            } else if (input == 60 || input == '60') {
                return '百度mall接口';
            } else if (input == 61 || input == '61') {
                return '三足接口';
            } else if (input == 62 || input == '62') {
                return '移动pos';
            } else if (input == 63 || input == '63') {
                return 'M6';
            } else if (input == 65 || input == '65') {
                return '速卖通';
            } else if (input == 66 || input == '66') {
                return '明星衣橱';
            } else if (input == 67 || input == '67') {
                return '百胜E3';
            } else if (input == 68 || input == '68') {
                return '润和pos';
            } else if (input == 69 || input == '69') {
                return '内部员工';
            } else if (input == 70 || input == '70') {
                return 'PC门户';
            } else if (input == 71 || input == '71') {
                return '雅瑞POS';
            } else if (input == 72 || input == '72') {
                return 'SMS系统';
            } else if (input == 73 || input == '73') {
                return '巅峰呼叫中心';
            } else if (input == 74 || input == '74') {
                return '会员通';
            } else if (input == 78 || input == '78') {
                return '衣全球商城';
            } else if (input == 9000 || input == '9000') {
                return '错误来源';
            } else {
                return '';
            }
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
    .filter('createtypemark', function () {
        return function (input) {
            if (input == 0 || input == '0') {
                return '消费';
            } else if (input == 1 || input == '1') {
                return '调整';
            } else if (input == 2 || input == '2') {
                return '活动';
            } else if (input == 3 || input == '3') {
                return '兑换';
            } else if (input == 4 || input == '4') {
                return '积分抵现';
            } else if (input == 5 || input == '5') {
                return '顾客充值送';
            } else if (input == 6 || input == '6') {
                return '过期清零';
            } else if (input == 7 || input == '7') {
                return '积分变现';
            } else if (input == 8 || input == '8') {
                return '停卡';
            } else if (input == 10 || input == '10') {
                return '其他';
            } else if (input == 12 || input == '12') {
                return '积分签到';
            } else if (input == 13 || input == '13') {
                return '推荐送';
            } else if (input == 14 || input == '14') {
                return '完善顾客资料送积分';
            } else if (input == 15 || input == '15') {
                return '开卡送';
            } else if (input == 16 || input == '16') {
                return '微信注册';
            } else if (input == 17 || input == '17') {
                return '评价送';
            } else if (input == 18 || input == '18') {
                return '调查问卷送';
            } else if (input == 19 || input == '19') {
                return '过期恢复积分';
            }
        };
    })
    //积分有效期
    .filter('checkexpdate', function () {
        return function (input) {
            if (input == '0000-00-00 00:00:00' || input == '' || input == null || input == 'null') {
                return '永久有效';
            } else {
                return input;
            }
        };
    })
    //优惠券类型
    .filter('coupontypemark', function () {
        return function (input) {
            if (input == 4 || input == '4') {
                return '现金券';
            } else if (input == 0 || input == '0') {
                return '折扣券';
            } else if (input == 1 || input == '1') {
                return '折扣券';
            } else if (input == 2 || input == '2') {
                return '赠券';
            } else if (input == 3 || input == '3') {
                return '随机金额券';
            } else if (input == 5 || input == '5') {
                return '代金券';
            } else if (input == 6 || input == '6') {
                return '整单折扣券';
            } else if (input == 7 || input == '7') {
                return '单品折扣券';
            } else if (input == 8 || input == '8') {
                return '礼品券';
            } else if (input == 9 || input == '9') {
                return '积分券';
            } else if (input == 10 || input == '10') {
                return '免运费券';
            } else if (input == 11|| input == '11') {
                return '抵用券';
            }
        };
    })
    //折扣
    .filter('couponrebate',function(){
        return function(input){
            if (input == 0.000) {
                return '0.0';
            } else {
                return Number(input).toFixed(1);
            }
        }
    })