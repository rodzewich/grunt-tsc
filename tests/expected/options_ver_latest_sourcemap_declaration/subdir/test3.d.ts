/// <reference path="test2.d.ts" />
declare module test3 {
    interface MyTestInterface3 extends test1.MyTestInterface1 {
        getProp2(): string;
    }
    class Test3 extends test2.Test2 implements MyTestInterface3 {
        constructor();
    }
}
