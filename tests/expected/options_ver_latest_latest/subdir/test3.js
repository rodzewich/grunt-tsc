/// <reference path="test2.ts" />
var test3;
(function (test3) {
    class Test3 extends test2.Test2 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }
    test3.Test3 = Test3;
})(test3 || (test3 = {}));
