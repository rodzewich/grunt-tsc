/// <reference path="test2.ts" />

module test3 {

    export class Test3 extends test2.Test2 {
        constructor() {
            super();
            console.log('extends');
            console.log('prop1', this.getProp1());
            console.log('prop2', this.getProp2());
        }
    }

}