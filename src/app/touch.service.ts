import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TouchService {
  constructor() {}

  register(
    element: HTMLElement,
    option?: {
      onDown: (event) => void;
      onOneFingerMove: (event) => void;
      onTwoFingerMove: (event) => void;
    }
  ) {
    const { onDown, onOneFingerMove, onTwoFingerMove } = option;
    let isMouseDrag = false;

    let startX = 0;
    let startY = 0;

    let dx = 0;
    let dy = 0;

    const getX = (event: any) => {
      let sum = 0;

      if (!event?.targetTouches) {
        console.log('no taret Touches');
        return event.pageX;
      }

      for (let i = 0; i < event.targetTouches.length; i++) {
        sum += event.targetTouches[i].pageX;
      }

      return sum / event.targetTouches.length;
    };

    const getY = (event) => {
      let sum = 0;

      if (!event?.targetTouches) {
        return event.pageY;
      }

      for (let i = 0; i < event.targetTouches.length; i++) {
        console.log('loop');
        sum += event.targetTouches[i].pageY;
      }

      return sum / event.targetTouches.length;
    };

    const handle_pinch_zoom = (event) => {
      console.log('handle_pinch_zoom');
      // max 2 fingers
      if (event?.targetTouches && event?.targetTouches?.length > 2) {
        console.log('max 2 fingers');

        return;
      }
      // must be dragged
      if (!event.targetTouches && !isMouseDrag) {
        console.log('must be dragged');

        return;
      }

      // calculate dx, dy
      dx = getX(event) - startX; // + move right, - move left
      dy = getY(event) - startY;

      // set new startX, startY
      startX = getX(event);
      startY = getY(event);

      if (event.targetTouches === undefined) {
        onOneFingerMove({ dx, dy });
      }

      switch (event.targetTouches?.length) {
        case 1:
          onOneFingerMove({
            dx,
            dy,
          });
          break;
        case 2:
          onTwoFingerMove({
            dx,
            dy,
          });
          break;
      }
    };

    let touchStartTimeout;
    const touchStart = (event) => {
      event.preventDefault();

      if (!event.targetTouches) {
        isMouseDrag = true;
      }

      startX = getX(event);
      startY = getY(event);

      // if the user makes simultaneous touches, multiple event will be fire, with 1 touch, with 2 touch
      clearTimeout(touchStartTimeout);
      touchStartTimeout = setTimeout(() => {
        console.log('touch start', event);
        console.log('startX', startX, 'startY', startY);

        if (onDown) {
          onDown(event);
        }
      }, 0);
    };

    const moveHandler = (event) => {
      event.preventDefault();
      console.log('touch move', event);
      handle_pinch_zoom(event);
    };

    const endHandler = (event) => {
      event.preventDefault();
      console.log('touch end', event);

      if (!event.targetTouches) {
        isMouseDrag = false;
      }

      if (!event.targetTouches || event.targetTouches?.length === 0) {
        // if movedrag end, or touch end
        startX = 0;
        startY = 0;
        dx = 0;
        dy = 0;
      } else if (event.targetTouches?.length === 1) {
        // handle remove finger jump
        startX = getX(event);
        startY = getY(event);
      }
    };

    // mouse effect
    element.onmousedown = touchStart;
    element.onmousemove = moveHandler;
    element.onmouseup = endHandler;

    // touch screen effect
    element.ontouchstart = touchStart;
    element.ontouchmove = moveHandler;
    element.ontouchcancel = endHandler;
    element.ontouchend = endHandler;
  }
}
