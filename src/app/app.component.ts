import { Component } from '@angular/core';
import { LayerService } from './layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'photo-viewer';

  constructor(public layerService: LayerService) {}
}
