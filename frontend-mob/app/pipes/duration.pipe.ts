/**
 * Created by nathanstanley on 23/4/17.
 */
import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns the time display in mm:ss of a duration
 */
@Pipe({name: 'durationPipe'})
export class DurationPipe implements PipeTransform {
    transform(value: number): string {
        let secs: number = value % 60;
        let mins: number = Math.round(value / 60);
        return ((mins < 10) ? (mins == 0 ? "00" : "0" + mins) : mins) + ":"
            + ((secs < 10) ? (secs == 0 ? "00" : "0" + secs) : secs);
    }
}