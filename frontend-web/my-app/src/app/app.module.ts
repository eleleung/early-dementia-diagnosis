import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {L_SEMANTIC_UI_MODULE} from 'angular2-semantic-ui';

import {AppComponent} from './app.component';
import {HashLocationStrategy, LocationStrategy, CommonModule} from "@angular/common";
import {LoginService} from "./services/login.service";
import {AuthGuard} from "./auth-guard";
import {LoginComponent} from "./pages/login/login.component";
import {SidePanelComponent} from "./side-panel/side-panel.component";
import {routing} from "./routes";
import {HomeComponent} from "./pages/home/home.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SidePanelComponent,
        HomeComponent
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
        L_SEMANTIC_UI_MODULE
    ],
    providers: [AuthGuard, LoginService,
        {provide: LocationStrategy, useClass: HashLocationStrategy}],

    bootstrap: [AppComponent]
})
export class AppModule {
}
