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
