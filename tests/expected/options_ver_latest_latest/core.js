var test1;
(function (test1) {
    class Test1 {
        constructor() {
            this.prop1 = '123';
            this.prop2 = '123';
            this.setProp1('123');
            this.setProp2('123');
        }
        getProp1() {
            return this.prop1;
        }
        setProp1(value) {
            this.prop1 = value;
        }
        getProp2() {
            return this.prop2;
        }
        setProp2(value) {
            this.prop2 = value;
        }
        static factory() {
            return new Test1();
        }
    }
    test1.Test1 = Test1;
})(test1 || (test1 = {}));
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
