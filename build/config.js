var __config_sys__ = {
    "can_speak": false, //允许语音提示
    "fake_api": false, //使用demo的api返回数据替换真实api
    "api_path": window.location.href.substring(0,window.location.href.lastIndexOf('manage'))+"manage/web/index.php", //API访问路径
    "api_log": "none", //none:不记录任何日志; debug:记录每次api请求的日志; error:仅记录错误返回的api日志
    "dump_mode": true, //在当前页面弹框展示当前rootScope和scope的变量
    "app_path": "src", //应用存放的路径前缀: 开发中使用src, 压缩混淆后使用build或服务器上具体存放路径，相对于index.html
    "src_path":"src/" , //引用模板路径
};