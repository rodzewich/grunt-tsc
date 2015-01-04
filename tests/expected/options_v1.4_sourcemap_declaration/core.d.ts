declare module test1 {
    class Test1 {
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
    class Test2 extends test1.Test1 {
        constructor();
    }
}
declare module test3 {
    class Test3 extends test2.Test2 {
        constructor();
    }
}
