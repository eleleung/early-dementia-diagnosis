import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular";

import { AppComponent } from "./app.component";
import {AppService} from "./services/app.service";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, NativeScriptHttpModule],
  providers: [AppService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
