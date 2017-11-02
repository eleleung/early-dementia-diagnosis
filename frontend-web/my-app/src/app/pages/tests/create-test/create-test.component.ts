/**
 * Created by EleanorLeung on 7/10/17.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TestService} from '../../../services/test.service';

@Component({
    selector: 'create-test',
    templateUrl: 'create-test.component.html',
    styleUrls: ['../../../../assets/css/styles.css', '../../../../assets/css/semantic.css']
})

export class CreateTestComponent {

    private testComponents = [];
    private testName = '';
    private description = '';
    private saved = false;
    private error = false;
    private date = new Date();

    constructor(private router: Router, private testService: TestService) {
    }

    addQuestionAnswer() {
        const component = {
            type: 'question',
            instruction: '',
            content: ''
        };

        this.testComponents.push(component);
    }

    addDrawing() {
        const component = {
            type: 'image',
            instruction: '',
            content: ''
        };

        this.testComponents.push(component);
    }

    addRecordSpeech() {
        const component = {
            type: 'audio',
            instruction: '',
            content: '',
        };

        this.testComponents.push(component);
    }

    capitaliseFirstLetter(word) {
        const capital: string = word.charAt(0).toUpperCase();
        const remainder: string = word.substring(1);
        return capital.concat(remainder);
    }

    deleteComponent(index) {
        // confirm delete
        this.testComponents.splice(index, 1); // removes component at "index" from test component
    }

    saveTest() {

        for (let comp = 0; comp < this.testComponents.length; comp++) {
            if (this.testComponents[comp].instructions === '') {
                alert('One or more of your test cases contain no instructions. Test has not been added');
                this.saved = false;
                return;
            } else if (this.testComponents[comp].content === '') {
                alert('One or more of your test cases contain no content. Test has not been added');
                this.saved = false;
                return;
            }
        }
        this.testService.saveTest(this.testComponents, this.testName, this.description).subscribe(
            response => {
                if (response.success) {
                    this.saved = true;
                    this.testComponents = [];
                    this.testName = '';
                    this.description = '';
                } else {
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
