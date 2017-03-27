import {HomeComponent} from "./pages/home/home-component";
import {LoginComponent} from "./pages/login/login-component";

/**
 * Created by EleanorLeung on 25/03/2017.
 */

export const routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {path: "home", component: HomeComponent}
]
