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
    const durationInMillis = this.durationInMins * 60 * 1000;
    const expiryTime = timestamp.getTime() + durationInMillis;
    return (expiryTime > timeNow) ? false : true;
  }
}
