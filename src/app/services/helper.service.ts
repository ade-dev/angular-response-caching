import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  getId(url: string) {
    const id = url.slice(22);
    return id;
  }
}
