import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {LoginService} from './services/login.service';

// Add the security roles which should be allowed to access each page
const routesSecurityRoles = {
    'home': ['all'],
    'login': ['all'],
    'patients': ['all'],
    'tests': ['all'],
    'patient': ['all'],
    'add-patient': ['all']
};

@Injectable()
export class AuthGuard implements CanActivate {

    // putting a LoginService here gives a No Provider for LoginService error
    constructor (private router: Router, private loginService: LoginService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('token');
        const user = this.loginService.user;

        if (token && token !== '' && user) {
            const validRoles = routesSecurityRoles[next.url[0].path];
            // TODO remove the below if and add security roles to users
            if (user.securityRoles == null) {
                return true;
            }
            for (const userRole of user.securityRoles) {
                for (const validRole of validRoles) {
                    if (userRole === validRole || validRole === 'all') {
                        return true;
                    }
                }
            }

        }
        this.router.navigate(['/login']);
        return false;
    }
}
