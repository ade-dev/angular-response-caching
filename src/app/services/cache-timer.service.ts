import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheTimerService {

  constructor() { }

  private isTimerStarted: boolean = false;
  private expiryTime: Date = new Date();

  startTimer(): void {
    const timerDuration: number = 30;
    if (!this.isTimerStarted) {
      this.expiryTime.setMinutes(this.expiryTime.getMinutes() + timerDuration);
      this.isTimerStarted = true;
    }
  }

  resetTimer(): void {
    this.isTimerStarted = false;
  }

  getCountDown(): number {
    return this.expiryTime.getTime() - new Date().getTime();
  }
}
