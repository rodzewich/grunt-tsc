/// <reference path="../test1.ts" />
var test2;
(function (test2) {
    class Test2 extends test1.Test1 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }
    test2.Test2 = Test2;
})(test2 || (test2 = {}));
