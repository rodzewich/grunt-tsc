declare module test1 {
    interface MyTestInterface1 {
        getProp1(): string;
    }
    class Test1 implements MyTestInterface1 {
        private prop1;
        private prop2;
        constructor();
        getProp1(): string;
        private setProp1(value);
        getProp2(): string;
        private setProp2(value);
        static factory(): Test1;
    }
}
declare module test2 {
    interface MyTestInterface2 extends test1.MyTestInterface1 {
        getProp2(): string;
    }
    class Test2 extends test1.Test1 implements MyTestInterface2 {
        constructor();
    }
}
declare module test3 {
    interface MyTestInterface3 extends test1.MyTestInterface1 {
        getProp2(): string;
    }
    class Test3 extends test2.Test2 implements MyTestInterface3 {
        constructor();
    }
}
