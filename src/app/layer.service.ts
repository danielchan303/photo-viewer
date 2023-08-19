import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  info = '';
  element: any;

  layers = [
    'https://images.unsplash.com/photo-1682687220777-2c60708d6889?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1691380303000-b0288f54bf61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1692283747616-b2209a722203?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1691466381512-86e980d851bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  ];

  constructor() {}

  moveToTop(image: string) {
    const originalIndex = this.layers.findIndex((value) => value === image);
    this.layers.splice(originalIndex, 1);
    this.layers.push(image);
  }

  getMatrix(element, transform) {
    // Create a dummy element to apply the transform
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.style.position = 'absolute';
      this.element.style.top = '-9999px';
      document.body.appendChild(this.element);
    }

    // Apply the transform to the dummy element
    this.element.style.transform = transform;

    // Get the computed style of the element
    const style = window.getComputedStyle(this.element);
    console.log('style.transform', transform, style.transform);

    return style.transform;
  }
}
