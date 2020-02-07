import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  onReachBottom(callback: () => void): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      callback();
    }
  }

  isElementOverflowing(element: HTMLElement): boolean {
    let isOverflowing = false;

    let rect: DOMRect = element.getBoundingClientRect();
    if (rect.right === 0) {
      element.removeAttribute('hidden');

      rect = element.getBoundingClientRect();
      isOverflowing = this.isElementOverflowing(element);

      element.setAttribute('hidden', 'hidden');
    }
    else if (rect.right + 90 > window.screen.width) {
      isOverflowing = true;
    }

    return isOverflowing;
  }
}
