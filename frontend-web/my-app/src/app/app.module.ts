import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {L_SEMANTIC_UI_MODULE} from 'angular2-semantic-ui';
import {Ng2DragDropModule} from 'ng2-drag-drop';
import {DndModule} from 'ng2-dnd';

import {AppComponent} from './app.component';
import {HashLocationStrategy, LocationStrategy, CommonModule} from '@angular/common';
import {LoginService} from './services/login.service';
import {AuthGuard} from './auth-guard';
import {LoginComponent} from './pages/login/login.component';
import {SidePanelComponent} from './side-panel/side-panel.component';
import {routing} from './routes';
import {OverviewComponent} from './pages/overview/overview.component';
import {PatientsComponent} from './pages/patients/patients.component';
import {TestsComponent} from './pages/tests/tests.component';
import {PatientService} from './services/patient.service';
import {SecurityService} from './services/security.service';
import {ChartsModule} from 'ng2-charts';
import {PatientComponent} from './pages/patient/patient.component';
import {CreateTestComponent} from './pages/tests/create-test/create-test.component';
import {TestService} from "./services/test.service";
import {CompletedPatientTestComponent} from "./pages/patient/completed-patient-tests/completed-patient-test.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SidePanelComponent,
        OverviewComponent,
        PatientsComponent,
        TestsComponent,
        PatientComponent,
        CreateTestComponent,
        CompletedPatientTestComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserModule,
        HttpModule,
        routing,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        L_SEMANTIC_UI_MODULE,
        ChartsModule,
        Ng2DragDropModule.forRoot(),
        DndModule.forRoot(),
    ],
    providers: [
        AuthGuard,
        LoginService,
        PatientService,
        SecurityService,
        TestService,
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],

    bootstrap: [AppComponent]
})
export class AppModule {
}
