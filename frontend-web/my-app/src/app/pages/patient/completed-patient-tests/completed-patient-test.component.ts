import {Component, Input} from "@angular/core";
/**
 * Created by EleanorLeung on 26/10/17.
 */
@Component({
    selector: 'completed-patient-test',
    templateUrl: 'completed-patient-test.component.html',
})

export class CompletedPatientTestComponent {

    @Input() testResult: any;

    constructor() {
        console.log(this.testResult);
    }
}
