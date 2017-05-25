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
import {AudioService} from "./services/audio-service";
import {CarerService} from "./services/carer.service";
import {DurationPipe} from "./pipes/duration.pipe";
import {RegisterPatientFormComponent} from "./pages/forms/register-patient-component";
import {PatientListComponent} from "./pages/settings/patient-list-component";
import {PhotoComponent} from "./pages/photos/photo-component";
import {PhotoService} from "./services/photo-service";
import {RecordingComponent} from "./pages/recordings-list/record-component";

@NgModule({
  declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        TutorialComponent,
        SettingsComponent,
        InformationComponent,
        RecordingsListComponent,
        DurationPipe,
        RegisterPatientFormComponent,
        PatientListComponent,
        PhotoComponent,
        RecordingComponent
  ],
  bootstrap: [AppComponent],
  imports: [
      NativeScriptModule,
      NativeScriptHttpModule,
      NativeScriptFormsModule,
      ReactiveFormsModule,
      NativeScriptRouterModule,
      NativeScriptRouterModule.forRoot(routes),
      RouterModule
  ],
  providers: [
      LoginService,
      RegisterService,
      CarerService,
      SecurityService,
      AudioService,
      PhotoService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
