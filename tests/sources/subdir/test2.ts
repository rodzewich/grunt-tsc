/// <reference path="../test1.ts" />

module test2 {

    export interface MyTestInterface2 extends test1.MyTestInterface1 {
        getProp2(): string;
    }

    export class Test2 extends test1.Test1 implements MyTestInterface2 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }

}