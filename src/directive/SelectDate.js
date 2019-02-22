    myDirective.directive("selectDate", function () {
    return {
        restrict: 'E,A',
        scope: {
            inputValue: '=',    //输入框中的日期
            inputTitle: '@',    //弹框的标题
            inputReadonly: '=', //只读开关:true只读, false可编辑
            inputEdit: '=', //是否可编辑
            inputChange:'=', //变化后执行的方法
            startView:'=', //变化后执行的方法
            inputFormat: '@'    //输入的日期格式 1:yyyy-mm-dd 2:mm-dd 3:yyyy-mm 4：yyyy 5:hh:ii:ss  默认;yyyy-mm-dd hh:ii:ss
        },
        templateUrl: 'src/html/directive/selectdate/DirectiveSelectDate.html',
        controller: ['$scope', '$element', 'ngDialog', function ($scope, $element, ngDialog) {
            $scope.show = true;
            //var format = '';
            //// if($scope.startView){
            ////     $scope.startView =3
            //// }
            //var minView = '';
            //var maxView = '';
            //if($scope.inputFormat==1){
            //    format = 'yyyy-mm-dd';
            //    minView = 2;
            //    maxView = 4;
            //}else if($scope.inputFormat==2){
            //    format = 'mm-dd';
            //    minView = 2;
            //    maxView = 3;
            //}else if($scope.inputFormat==3){
            //    format = 'yyyy-mm';
            //    minView = 3;
            //    maxView = 4;
            //}else if($scope.inputFormat==5){
            //    format = 'hh:ii:ss';
            //    minView = 0;
            //    maxView = 1;
            //
            //}else {
            //    format = 'yyyy-mm-dd hh:ii';
            //    minView = 0;
            //    maxView = 4;
            //}
            //$('.form_time').datetimepicker({
            //    //language:  'fr',
            //    weekStart: 1,
            //    todayBtn:  1,
            //    autoclose: 1,
            //    todayHighlight: 1,
            //    startView: $scope.startView,
            //    pickerPosition: "bottom-left",
            //    minView:minView,
            //    maxView:maxView,
            //    forceParse: 0,
            //    format: format
            //});

            $scope.clear = function () {
                $element.children().children().val('');
                $scope.inputValue = '';
                $scope.show = true;
            }

            $scope.set_val = function () {
                $scope.inputValue = $element.children().children().val();
                $scope.show = false;
            }

            $scope.click_date = function () {
                $element.children().children().click()
            }


            //清空
            var watch1 = $scope.$watch('inputValue',function(){
                if($scope.inputValue==''||$scope.inputValue==undefined){
                    $scope.clear();
                }
            });



        }]
    }
});