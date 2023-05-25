import { Component } from '@angular/core';
import {Map, CRS} from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private map: Map;
  private zoom: number;
  public circle: any;
  public selectedCRS: any = CRS.EPSG3857;

  public CRSs = [
    { value: CRS.EPSG3395, text: CRS.EPSG3395.code },
    { value: CRS.EPSG3857, text: CRS.EPSG3857.code },
    { value: CRS.EPSG4326, text: CRS.EPSG4326.code },
    { value: CRS.EPSG900913, text: CRS.EPSG900913.code },
    { value: CRS.Earth, text: 'Earth' },
    { value: CRS.Simple, text: 'Simple' },
  ]
  
  receiveMap(map: Map) {
    this.map = map;
  }

  receiveZoom(zoom: number) {
    this.zoom = zoom;
  }

  onMapBaseChange(e: any) {
    console.log(e.target.value);
    this.selectedCRS = this.CRSs.find(crs => crs.text === e.target.value)?.value || CRS.EPSG3857;
  }

  getLayersAsArray() {
    const arr: any[] = [];
    this.map.eachLayer(l => arr.push(l));
    console.log("Layers: ", arr);
    console.log("Layer Count: ", arr.length);
    return arr;
  }

  
}
