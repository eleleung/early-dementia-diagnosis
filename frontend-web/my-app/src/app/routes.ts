import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth-guard';
import {LoginComponent} from "./pages/login/login.component";
import {HomeComponent} from "./pages/home/home.component";
import {PatientsComponent} from "./pages/patients/patients.component";
import {TestsComponent} from "./pages/tests/tests.component";

export const appRoutes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
    {path: 'patients', component: PatientsComponent, canActivate:[AuthGuard]},
    {path: 'tests', component: TestsComponent, canActivate:[AuthGuard]},
];

export const routing = RouterModule.forRoot(appRoutes); //Need to add AuthGuard in here somewhere
