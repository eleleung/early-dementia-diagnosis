"use strict";
/**
 * Created by caitlinwoods on 18/5/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
const security_service_1 = require("./security.service");
const global_1 = require("../global");
let PhotoService = class PhotoService {
    constructor(http, securityService) {
        this.http = http;
        this.securityService = securityService;
    }
    uploadPicture(photo) {
        let url = global_1.GlobalVariable.BASE_API_URL + "/pictures/SendPicture";
        let headers = this.securityService.loggedInHeader();
        return this.http.post(url, JSON.stringify(photo), { headers: headers }).map(res => res.json());
    }
};
PhotoService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, security_service_1.SecurityService])
], PhotoService);
exports.PhotoService = PhotoService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG8tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBob3RvLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUdILHdDQUF5QztBQUN6Qyx3Q0FBNEM7QUFFNUMsaUNBQStCO0FBQy9CLGdDQUE4QjtBQUM5Qix5REFBbUQ7QUFDbkQsc0NBQXlDO0FBR3pDLElBQWEsWUFBWSxHQUF6QjtJQUVJLFlBQW9CLElBQVUsRUFBVSxlQUFnQztRQUFwRCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWlCO0lBQ3hFLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBVTtRQUNwQixJQUFJLEdBQUcsR0FBRyx1QkFBYyxDQUFDLFlBQVksR0FBRyx1QkFBdUIsQ0FBQTtRQUMvRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakcsQ0FBQztDQUNKLENBQUE7QUFWWSxZQUFZO0lBRHhCLGlCQUFVLEVBQUU7cUNBR2lCLFdBQUksRUFBMkIsa0NBQWU7R0FGL0QsWUFBWSxDQVV4QjtBQVZZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGNhaXRsaW53b29kcyBvbiAxOC81LzE3LlxuICovXG5cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cCwgSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5cbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvZG9cIjtcbmltcG9ydCB7U2VjdXJpdHlTZXJ2aWNlfSBmcm9tIFwiLi9zZWN1cml0eS5zZXJ2aWNlXCI7XG5pbXBvcnQge0dsb2JhbFZhcmlhYmxlfSBmcm9tIFwiLi4vZ2xvYmFsXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQaG90b1NlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwLCBwcml2YXRlIHNlY3VyaXR5U2VydmljZTogU2VjdXJpdHlTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgdXBsb2FkUGljdHVyZShwaG90bzogYW55KSB7XG4gICAgICAgIGxldCB1cmwgPSBHbG9iYWxWYXJpYWJsZS5CQVNFX0FQSV9VUkwgKyBcIi9waWN0dXJlcy9TZW5kUGljdHVyZVwiXG4gICAgICAgIGxldCBoZWFkZXJzID0gdGhpcy5zZWN1cml0eVNlcnZpY2UubG9nZ2VkSW5IZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgSlNPTi5zdHJpbmdpZnkocGhvdG8pLCB7aGVhZGVyczogaGVhZGVyc30pLm1hcChyZXMgPT4gcmVzLmpzb24oKSk7XG4gICAgfVxufVxuXG4iXX0=