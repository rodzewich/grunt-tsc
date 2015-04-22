/// <reference path="../test1.d.ts" />
declare module test2 {
    interface MyTestInterface2 extends test1.MyTestInterface1 {
        getProp2(): string;
    }
    class Test2 extends test1.Test1 implements MyTestInterface2 {
        constructor();
    }
}
