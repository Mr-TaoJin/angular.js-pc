angular.module('myService', [])
    .factory('api', ['$rootScope', '$http', '$location', '$q', 'Popup','$routeParams','ngDialog',
        function ($rootScope, $http, $location, $q, Popup,$routeParams,ngDialog) {
            //本地文件配置
            var request_demo = function (api_name, api_parm) {
                var post_url = "../api_demo/" + api_name + ".json";
                return $http.get(post_url, api_parm).then(function (ret) {
                    if (ret.data.status == 1) {
                        return ret.data;
                    } else {
                        // Popup.notice(ret.data.message);
                        return false;  //ret.data;
                    }
                }).catch(function (ret) {
                    // Popup.notice('网络访问失败');
                    return false;
                });
            };

            //生成sign
            var create_sign = function (api_name, param) {
                var key = 'baison';
                var secret = "123456";
                var act = api_name.replace(/\//g, "");//去除/
                act = act.replace(/(^\s*)|(\s*$)/g, "");//字符串左右去除空格
                var sign = key + act;
                // var sign_params={
                //     'timestamp':param.timestamp,
                //     'user_info':param.user_info
                // };
                //baisonsysuserget_listtimestamp1499915374user_id1user_codeadmin
                //追加其他参数
                param = $util.ksort(param);
                if (Object.keys(param).length != 0) {
                    for (var i in param) {
                        if (i != 'sign') {
                            if (angular.isObject(param[i])) {
                                for (var k in param[i]) {
                                    if (angular.isObject(param[i][k])) {
                                        continue;
                                    }
                                    if (param[i][k] != undefined) {
                                        sign += k + param[i][k];
                                    }
                                }
                            } else {
                                if (param[i] != undefined) {
                                    sign += i + param[i];
                                }
                            }
                        }
                    }
                }

                sign = $.md5(secret + sign + secret);
                return sign;
            }

            //线上配置
            //请求接口方法
            /**
             * api_name 接口名称 例如 base/customer/get_list
             * api_parm 请求参数 例如 {'search_data': {'code': '001', 'status': 1}}
             * http_parm http参数 例如 {'responseType': 'arraybuffer'}
             */
            var request = function (api_name, api_parm, http_parm) {
                var post_url = __config_sys__.api_path + '?app_act=' + api_name;


                //提交请求时附加上当前操作人信息
                if (api_parm) {
                    api_parm.user_info = {
                        // user_code: '13761612240',
                        // shop_code: '01I-000'
                        user_code: $routeParams.user_code,
                        shop_code: $routeParams.shop_code
                    }
                    //安全测试提交请求增加时间戳
                    var timestamp = Date.parse(new Date()) / 1000;
                    api_parm.timestamp = timestamp;
                    api_parm.sign = create_sign(api_name, api_parm);
                }
                //分页没有传num参数的处理
                if (api_parm.page_data) {
                    if (!api_parm.page_data.num) {
                        api_parm.page_data.num = 15;
                        // api_parm.page_data.count = 0;
                        // api_parm.page_data.countPage = 0;
                        // api_parm.page_data.pageNum = 0;
                    }
                }
                return $http.post(post_url, api_parm, http_parm).then(function (ret) {
                    if(ret.data.status == 1){
                        return ret.data;
                    }else if(ret.data.status == -1){
                        Popup.notice(ret.data.message);
                        return ret.data;
                    }

                }).catch(function (ret) {
                    return false;
                });
            };

            var request_route = function (api_name, api_parm, http_parm) {
                if (__config_sys__.fake_api === true) {
                    return request_demo(api_name, api_parm);
                } else {
                    return request(api_name, api_parm, http_parm);
                }
            }

            //获取URL请求的地址
            var get_api_url = function (api_name) {
                var post_url = __config_sys__.api_path + "manage/web/index.php?app_act=" + api_name;
                return post_url;
            };
            if (!$rootScope.config_sys) {
                $rootScope.config_sys = __config_sys__;
            };
            return {
                "get_api_url": get_api_url,   //获取请求的地址
                "request": request_route,     //API请求：根据配置是访问正式环境还是静态数据
                "request_demo": request_demo
            };

        }])
    .factory('valid', ['$rootScope', function ($rootScope) {

        //验证是否必填
        var check_required = function (input) {
            //console.log(input);
            if (typeof input == 'undefined' || input == undefined || input == '' || input == null) {
                return false;
            } else {
                return true;
            }
        }

        //验证正整数(不包含0)
        var check_positive_integer = function (input) {
            if ((/^(\+|-)?\d+$/.test(input)) && input > 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证(包含0)的正整数
        var check_integer = function (input) {
            if ((/^(\+|-)?\d+$/.test(input)) && input >= 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证手机号码
        var check_mobile = function (input) {
            if ((/^1\d{10}$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }
        //验证邮箱
        var check_email = function (input) {
            if ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }

        //验证0~1之间的数
        var check_zero_one = function (input) {
            if (input >= 0 && input <= 1) {
                return true;
            } else {
                return false;
            }
        }
        //验证1~100之间的数
        var check_one_hundred = function (input) {
            if (input >= 1 && input <= 100) {
                return true;
            } else {
                return false;
            }
        }
        //包含0的正数
        var check_zero_positive = function (input) {
            if ((/^[0-9]+.?[0-9]*$/.test(input)) && input >= 0) {
                return true;
            } else {
                return false;
            }
        }

        //正数(不包含0)
        var check_positive = function (input) {
            if ((/^[0-9]+.?[0-9]*$/.test(input)) && input > 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证是否相等 input为有两个元素的数组
        var check_eq = function (input) {
            if (input[0] !== input[1]) {
                return false;
            } else {
                return true;
            }
        }

        //只能输入2位小数或正数(金额)
        var check_money_format = function (input) {
            if ((/^\d+(\.\d{2})*$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }

        //非法字符
        var check_character = function(input){
            if((/[^a-zA-Z0-9\_\u4e00-\u9fa5]/.test(input))){
                return false;
            }else{
                return true;
            }
        }

        //验证选择
        var check_switch = function (func, dat) {
            switch (func) {
                case 'check_required': return check_required(dat);//验证是否必填
                case 'check_positive_integer': return check_positive_integer(dat);//验证正整数(不包含0)
                case 'check_integer': return check_integer(dat);//验证(包含0)的正整数
                case 'check_mobile': return check_mobile(dat);//验证手机号
                case 'check_email': return check_email(dat);//验证邮箱
                case 'check_zero_one': return check_zero_one(dat);//验证0~1之间的数
                case 'check_one_hundred': return check_one_hundred(dat);//验证1~100之间的数
                case 'check_zero_positive': return check_zero_positive(dat);//包含0的正数
                case 'check_positive': return check_positive(dat);//正数(不包含0)
                case 'check_money_format': return check_money_format(dat);//只能输入2位小数或正数(金额)
                case 'check_eq': return check_eq(dat);//验证是否相等 input为有两个元素的数组
                case 'check_character': return check_character(dat);//验证是否有非法字符
            }
            return true;
        }

        //各种验证: TODO 可以根据需要改造成promise返回
        var check = function (check_list) {
            var ret = {
                'status': true,
                'data': {}
            };

            check_list.forEach(function (o) {
                if (!check_switch(o.valid, o.data)) {
                    ret.status = false;
                    ret.data[o.key] = 'error';
                    ret.data[o.key + '_ico'] = 'glyphicon-warning-sign';
                    ret.data[o.key + '_tip'] = o.tip;
                } else {
                    ret.data[o.key] = 'success';
                    ret.data[o.key + '_ico'] = 'glyphicon-ok';
                    ret.data[o.key + '_tip'] = '';
                }
            });
            return ret;
        }

        return {
            "check": check,
            "check_required": check_required,//验证是否必填
            "check_positive_integer": check_positive_integer,//验证正整数(不包含0)
            "check_integer": check_integer,//验证(包含0)的正整数
            "check_mobile": check_mobile,//验证手机号
            "check_email": check_email,//验证邮箱
            "check_zero_one": check_zero_one,//验证0~1之间的数
            "check_one_hundred": check_one_hundred,//验证1~100之间的数
            "check_zero_positive": check_zero_positive,//包含0的正数
            "check_positive": check_positive,//正数(不包含0)
            "check_money_format": check_money_format,//只能输入2位小数或正数(金额)
            "check_eq": check_eq,//验证是否相等 input为有两个元素的数组
            "check_character": check_character//验证是否有非法字符
        }
    }])
    ;