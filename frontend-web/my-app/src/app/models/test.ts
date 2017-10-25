import {User} from './user';

/**
 * Created by EleanorLeung on 25/05/2017.
 */

export class Test {
    _id: string;
    name: string;
    description: string;
    components: TestComponent[];
    dateCreated: Date;
    creator: User;
}

export class TestComponent {
    type: string;
    instruction: string;
    content: string;
}
