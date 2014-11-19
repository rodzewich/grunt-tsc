/// <reference path="../test1.ts" />

module test2 {

    export class Test2 extends test1.Test1 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }

}