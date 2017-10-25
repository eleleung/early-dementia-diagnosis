/**
 * Created by EleanorLeung on 7/10/17.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TestService} from "../../../services/test.service";

@Component({
    selector: 'create-test',
    templateUrl: 'create-test.component.html',
    styleUrls: ['../../../../assets/css/styles.css', '../../../../assets/css/semantic.css']
})

export class CreateTestComponent {

    private testComponents = [];
    private testName = '';
    private saved = false;
    private error = false;
    private date = new Date();

    constructor(private router: Router, private testService: TestService) {
        this.testName = this.date.toDateString();
    }

    addQuestionAnswer() {
        const component = {
            type: 'question',
            instruction: '',
            content: ''
        };
        component.instruction = 'Example: What is the date today?';

        this.testComponents.push(component);
    }

    addDrawing() {
        const component = {
            type: 'image',
            instruction: '',
            content: ''
        };
        component.instruction = 'Example: Draw a clock';

        this.testComponents.push(component);
    }

    addRecordSpeech() {
        const component = {
            type: 'audio',
            instruction: '',
            content: '',
        };
        component.instruction = 'Example: Press record and read the text aloud';
        component.content = 'A quick brown fox jumps over the lazy dog';

        this.testComponents.push(component);
    }

    deleteComponent(index) {
        // confirm delete

        this.testComponents.splice(index, 1);
    }

    saveTest() {
        console.log(this.testComponents);
        this.testService.saveTest(this.testComponents, this.testName).subscribe(
            response => {
                if (response.success) {
                    this.saved = true;
                    this.testComponents = [];
                    this.testName = this.date.toDateString();
                }
                else {
                    this.saved = false;
                    this.error = true;
                }
            },
            error => {
                console.log(error);
                this.error = true;
            }
        );
    }
}
