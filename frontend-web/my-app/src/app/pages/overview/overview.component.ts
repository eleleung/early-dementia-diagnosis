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

    public doughnutChartData1: number[] = [350, 450, 100];
    public doughnutChartData2: number[] = [150, 700, 200];
    public doughnutChartData3: number[] = [600, 450, 100];
    public doughnutChartType = 'doughnut';
    public options = {
        legend: {
            display: false
        }
    };

    constructor(patientService: PatientService) {
    }
}
