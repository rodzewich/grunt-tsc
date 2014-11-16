module utils {

    export class Test1 {

        private prop1: string = '123';
        public prop2: string = '123';

        constructor() {

        }

        public getProp1(): string {
            return this.prop1;
        }

        private setProp1(): void {
            this.prop1 = '123';
        }

    }

}