import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {ReactiveFormsModule} from '@angular/forms';
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {NativeScriptHttpModule} from "nativescript-angular";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./pages/home/home-component";
import {AppService} from "./services/app.service";
import {LoginService} from "./services/login-service";
import {RegisterService} from "./services/register-service";
import {routes} from "./app.routes";
import {LoginComponent} from "./pages/login/login-component";

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, NativeScriptHttpModule, NativeScriptFormsModule, ReactiveFormsModule, NativeScriptRouterModule,
            NativeScriptRouterModule.forRoot(routes), RouterModule],
  providers: [AppService, LoginService, RegisterService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
