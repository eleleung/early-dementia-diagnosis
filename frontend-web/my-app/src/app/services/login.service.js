"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var globals_1 = require('../globals');
var LoginService = (function () {
    function LoginService(http) {
        this.http = http;
    }
    LoginService.prototype.sendCredentials = function (model) {
        var tokenUrl = globals_1.GlobalVariable.BASE_API_URL + '/user/login';
        var headers1 = new http_1.Headers({ 'Content-Type': 'application/json' });
        return this.http.post(tokenUrl, JSON.stringify(model), { headers: headers1 });
    };
    LoginService.prototype.sendToken = function (token) {
        var userUrl = globals_1.GlobalVariable.BASE_API_URL + '/secure/user/users';
        var headers2 = new http_1.Headers({ 'Authorization': 'Bearer ' + token });
        return this.http.get(userUrl, { headers: headers2 });
    };
    LoginService.prototype.checkLogin = function () {
        if (localStorage.getItem("user") != "" && localStorage.getItem("token") != "") {
            return true;
        }
        else {
            return false;
        }
    };
    LoginService.prototype.logout = function () {
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
    };
    LoginService.prototype.resetPassword = function (email) {
        var tokenUrl = globals_1.GlobalVariable.BASE_API_URL + '/user/resetPassword';
        var headers1 = new http_1.Headers({ 'Content-Type': 'application/json' });
        return this.http.post(tokenUrl, email, { headers: headers1 });
    };
    LoginService = __decorate([
        core_1.Injectable()
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
