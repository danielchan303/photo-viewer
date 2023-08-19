import { LayerService } from './../../layer.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import interact from 'interactjs';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements AfterViewInit {
  @ViewChild('box') box!: ElementRef;
  @Input() image!: string;

  myStyle: any = {
    transform: '',
    'background-color': 'yellow',
  };

  constructor(private layerService: LayerService) {}

  ngAfterViewInit(): void {
    let rotation = 0;
    let position = { x: 0, y: 0 };
    let currentScale = 1;
    let initalScale = 1;
    let scaleCenter = { x: 0, y: 0 };

    let transform = [
      `translate(-50%, -50%)`,
      `translate(${position.x}px, ${position.y}px)`,
      `scale(${currentScale})`,
      `translate(50%, 50%) rotate(${rotation}deg) translate(-50%, -50%)`,
    ];
    this.myStyle.transform = transform.join(' ');

    const slide = interact(this.box.nativeElement, {
      maxPerElement: Infinity,
    });
    slide.draggable({
      enabled: true,
      inertia: true,
    });
    slide.gesturable({
      enabled: true,
    });
    // slide.on('dragstart', (event) => {
    //   event.target.gesturable = false;
    // });
    slide.on('dragstart down', (event) => {
      const interaction = event.interaction;
      this.layerService.moveToTop(this.image);
    });
    slide.on('dragmove', (event) => {
      position.x += event.dx;
      position.y += event.dy;
      transform[1] = `translate(${position.x}px, ${position.y}px)`;
      this.myStyle.transform = transform.join(' ');
      console.log('new tranform', event);
    });

    let centerShift = '';
    slide.on('gesturestart', (event) => {
      const targetDimension = event.target.getBoundingClientRect();
      const transformWidth = targetDimension.width;
      const transformHeight = targetDimension.height;

      const lastCenterX = scaleCenter.x;
      const lastCenterY = scaleCenter.y;

      scaleCenter.x =
        ((event.box.x.toFixed(2) - targetDimension.left) / transformWidth) *
        100;
      scaleCenter.y =
        ((event.box.y.toFixed(2) - targetDimension.top) / transformHeight) *
        100;
      // if (scaleCenter.x !== 0 && scaleCenter.y !== 0) {
      //   centerShift = `translate(${(scaleCenter.x - lastCenterX) * -1}%, ${
      //     (scaleCenter.y - lastCenterY) * -1
      //   }%)`;
      // }
    });
    let lastScale = '';
    slide.on('gesturemove', (event) => {
      // translate
      position.x += event.dx;
      position.y += event.dy;
      transform[1] = `translate(${position.x}px, ${position.y}px)`;

      // scale
      const newValue = initalScale * event.scale;
      if (newValue > 0.5) {
        currentScale = newValue;

        transform[2] = `${lastScale} translate(${scaleCenter.x}%, ${
          scaleCenter.y
        }%) scale(${event.scale}) translate(${scaleCenter.x * -1}%, ${
          scaleCenter.y * -1
        }%) ${centerShift}`;
      }

      // rotation
      rotation += event.da;
      transform[3] = `translate(50%, 50%) rotate(${rotation}deg) translate(-50%, -50%)`;
      this.myStyle.transform = transform.join(' ');
    });
    slide.on('gestureend', (event) => {
      initalScale = currentScale;
      lastScale = transform[2];
    });
  }
}
