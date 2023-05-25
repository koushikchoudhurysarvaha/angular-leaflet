import { 
  Component, 
  OnDestroy, 
  Input, 
  Output, 
  EventEmitter, 
  OnChanges, 
  SimpleChanges 
} from '@angular/core';
import { 
  Map, Control, 
  MapOptions, 
  tileLayer, 
  latLng, 
  FeatureGroup, 
  featureGroup,
  Circle
} from 'leaflet';
import * as L from 'leaflet';

L.Edit.Circle = L.Edit.CircleMarker.extend({
  _createResizeMarker: function () {
    var center = this._shape.getLatLng(),
      resizemarkerPoint = this._getResizeMarkerPoint(center)

    this._resizeMarkers = []
    this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon))
  },

  _getResizeMarkerPoint: function (latlng: any) {
    var delta = this._shape._radius * Math.cos(Math.PI / 4),
      point = this._map.project(latlng)
    return this._map.unproject([point.x + delta, point.y - delta])
  },

  _resize: function (latlng: any) {
    var moveLatLng = this._moveMarker.getLatLng()
    var radius

    if (L.GeometryUtil.isVersion07x()) {
      radius = moveLatLng.distanceTo(latlng)
    }
    else {
      radius = this._map.distance(moveLatLng, latlng)
    }

    // **** This fixes the cicle resizing ****
    this._shape.setRadius(radius)

    this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape })
  }
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css',]
})
export class MapComponent implements OnDestroy, OnChanges {
  public static DEFAULT_SHAPE_OPACITY = 0.2;

  @Input() crs: L.CRS = L.CRS.EPSG3857;
  @Output() map$: EventEmitter<Map> = new EventEmitter;
  @Output() zoom$: EventEmitter<number> = new EventEmitter;

  public baseLayer = tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.7,
      maxZoom: 19,
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  )

  public options: MapOptions = {
    layers:[this.baseLayer],
    zoom:1,
    center:latLng(0,0),
    crs: this.crs
  };

  public defaultShapeOptions = {
    fillColor: '#D01F29',
    color: '#D01F29',
    weight: 2,
    opacity: 1,
    fillOpacity: MapComponent.DEFAULT_SHAPE_OPACITY,
  };

  public drawGroup: FeatureGroup = featureGroup();

  public drawOptions: Control.DrawConstructorOptions = {
    position: 'topright',
    edit: {
      featureGroup: this.drawGroup,
    },
    draw: {
      polygon: {
        allowIntersection: false, // Disable intersection for polygons
        drawError: {
          color: '#b00b00', // Set the error color when drawing polygons
          message: '<strong>Error:</strong> Cannot intersect polygons!', // Error message for intersection
        },
        shapeOptions: {...this.defaultShapeOptions}
      },
      circle: {
        shapeOptions: {...this.defaultShapeOptions}
      },
      polyline: false,
      rectangle: false,
      marker: false,
      circlemarker: false,
    },
  };

  public map: Map;
  public zoom: number;
  
  onDrawCreate(layer: any) {
    console.log(layer);
    if (layer instanceof Circle) {
      layer.setRadius(layer.getRadius());
    }    
    this.drawGroup.addLayer(layer);
  }

  ngOnDestroy() {
    this.map.clearAllEventListeners();
    this.map.remove();
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['crs']) {
      const change = changes['crs'];
      if (change.previousValue && change.currentValue) {
        this.map.options.crs = change.currentValue;
        this.map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            layer.redraw();
          }
        });
      }
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
    this.map.addLayer(this.drawGroup);
  }

  onMapZoomEnd(e: any) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }
}
