/**
 * Created by nathanstanley on 25/4/17.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {PatientService} from "../../services/patient.service";

@Component({
    selector: 'overview',
    templateUrl: 'overview.component.html',
})

export class OverviewComponent {

    public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    public doughnutChartData:number[] = [350, 450, 100];
    public doughnutChartType:string = 'doughnut';
    public options = {
        legend: {
            display: false
        }
    };

    constructor(patientService: PatientService) {
    }
}
