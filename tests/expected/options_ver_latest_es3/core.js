var test1;
(function (test1) {
    var Test1 = (function () {
        function Test1() {
            this.prop1 = '123';
            this.prop2 = '123';
            this.setProp1('123');
            this.setProp2('123');
        }
        Test1.prototype.getProp1 = function () {
            return this.prop1;
        };
        Test1.prototype.setProp1 = function (value) {
            this.prop1 = value;
        };
        Test1.prototype.getProp2 = function () {
            return this.prop2;
        };
        Test1.prototype.setProp2 = function (value) {
            this.prop2 = value;
        };
        Test1.factory = function () {
            return new Test1();
        };
        return Test1;
    })();
    test1.Test1 = Test1;
})(test1 || (test1 = {}));
/// <reference path="../test1.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var test2;
(function (test2) {
    var Test2 = (function (_super) {
        __extends(Test2, _super);
        function Test2() {
            _super.call(this);
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
        return Test2;
    })(test1.Test1);
    test2.Test2 = Test2;
})(test2 || (test2 = {}));
/// <reference path="test2.ts" />
var test3;
(function (test3) {
    var Test3 = (function (_super) {
        __extends(Test3, _super);
        function Test3() {
            _super.call(this);
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
        return Test3;
    })(test2.Test2);
    test3.Test3 = Test3;
})(test3 || (test3 = {}));
