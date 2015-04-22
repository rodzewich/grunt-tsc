/// <reference path="test2.ts" />

module test3 {

    export interface MyTestInterface3 extends test1.MyTestInterface1 {
        getProp2(): string;
    }

    export class Test3 extends test2.Test2 implements MyTestInterface3 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }

}