/// <reference path="test2.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
