import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheTimerService {

  durationInMins = 60;

  setTimestamp(): Date {
    return new Date();
  }

  isExpired(timestamp: Date): boolean {
    const timeNow = new Date().getTime();
    const duration = this.durationInMins * 60 * 1000;
    const expiryTime = timestamp.getTime() + duration;
    return (expiryTime > timeNow) ? false : true;
  }
}
