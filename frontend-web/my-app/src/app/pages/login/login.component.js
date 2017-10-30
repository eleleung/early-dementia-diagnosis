"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var loginModel_1 = require(".././loginModel");

var Login = (function () {
    function Login(loginService, router, userService) {
        this.loginService = loginService;
        this.router = router;
        this.userService = userService;
        this.model = new loginModel_1.LoginModel();
        this.messageClass = "";
        this.message = "";
        this.loading = false;
        window.scrollTo(0, 0);
    }
    Login.prototype.onSubmit = function () {
        var _this = this;
        this.loading = true;
        this.loginService.sendCredentials(this.model).subscribe(function (data) {
            localStorage.setItem("token", JSON.parse(JSON.stringify(data))._body);
            _this.loginService.sendToken(localStorage.getItem("token")).subscribe(function (data) {
                _this.userService.getUserByEmail(_this.model.email).subscribe(function (user) {
                    localStorage.setItem("user", JSON.parse(JSON.stringify(user))._body);
                    _this.model.email = "";
                    _this.model.password = "";
                    if (_this.userService.isAdmin()) {
                        _this.router.navigate(['/dashboard']);
                    }
                    else if (_this.userService.isTutor()) {
                        _this.router.navigate(['/timesheet']);
                    }
                    else {
                        _this.router.navigate(['/home']);
                    }
                    _this.loading = false;
                });
            });
        }, function (error) {
            _this.messageClass = "error";
            _this.message = "Error with login credentials, please check your email and password";
            _this.loading = false;
        });
    };
    Login.prototype.resetPassword = function () {
        var _this = this;
        this.loading = true;
        this.loginService.resetPassword(this.model.email).subscribe(function (data) {
            _this.messageClass = "success";
            _this.message = "An email has been sent with your temporary password";
            _this.loading = false;
        }, function (error) {
            _this.messageClass = "error";
            _this.message = "No user with that email address";
            _this.loading = false;
        });
    };
    Login = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'login.component.html',
        })
    ], Login);
    return Login;
}());
exports.Login = Login;
