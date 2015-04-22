module test1 {

    export interface MyTestInterface1 {
        getProp1(): string;
    }

    export class Test1 implements MyTestInterface1 {

        private prop1: string = '123';
        private prop2: string = '123';

        constructor() {
            this.setProp1('123');
            this.setProp2('123');
        }

        public getProp1(): string {
            return this.prop1;
        }

        private setProp1(value: string): void {
            this.prop1 = value;
        }

        public getProp2(): string {
            return this.prop2;
        }

        private setProp2(value: string): void {
            this.prop2 = value;
        }

        static factory(): Test1 {
            return new Test1();
        }

    }

}