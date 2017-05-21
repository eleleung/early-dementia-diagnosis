/**
 * Created by EleanorLeung on 21/05/2017.
 */
import {UploadItem}    from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
    constructor(file: any) {
        super();
        this.url = 'https://your.domain.here/your.endpoint';
        this.headers = { HeaderName: 'Header Value', AnotherHeaderName: 'Another Header Value' };
        this.file = file;
    }
}