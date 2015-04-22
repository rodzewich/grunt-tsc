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
