/// <reference path="../test1.d.ts" />
declare module test2 {
    class Test2 extends test1.Test1 {
        constructor();
    }
}
