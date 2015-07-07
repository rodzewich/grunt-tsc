/// <reference path="../test1.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
