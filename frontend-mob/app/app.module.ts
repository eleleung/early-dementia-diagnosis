import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {ReactiveFormsModule} from '@angular/forms';
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {NativeScriptHttpModule} from "nativescript-angular";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./pages/home/home-component";
import {LoginService} from "./services/login-service";
import {RegisterService} from "./services/register-service";
import {routes} from "./app.routes";
import {LoginComponent} from "./pages/login/login-component";
import {TutorialComponent} from "./pages/tutorial/tutorial-component";
import {SettingsComponent} from "./pages/settings/settings-component";
import {InformationComponent} from "./pages/information/information-component";
import {RecordingsListComponent} from "./pages/recordings-list/recordings-list-component";
import {SecurityService} from "./services/security.service";
import {CarerService} from "./services/carer.service";
import {DurationPipe} from "./pipes/duration.pipe";

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, TutorialComponent, SettingsComponent, InformationComponent,
                RecordingsListComponent, DurationPipe],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, NativeScriptHttpModule, NativeScriptFormsModule, ReactiveFormsModule, NativeScriptRouterModule,
            NativeScriptRouterModule.forRoot(routes), RouterModule],
  providers: [LoginService, RegisterService, CarerService, SecurityService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
