// @ts-nocheck
import { circle, MultiPolygon, Polygon as TurfPolygon } from '@turf/turf';
import { Circle, LatLng, Polygon } from 'leaflet';
import * as _ from 'lodash';
import { MapCircleDto, MapPolygonDto } from '../map.component';

export interface Coord {
  latitude: number;
  longitude: number;
}

export class ConverterHelper {
  static convertToCircle(layer: Circle): MapCircleDto {
    const center = layer.getLatLng();

    return {
      coordinates: [
        {
          latitude: center.lat,
          longitude: center.lng,
        },
      ],
      radius: layer.getRadius(),
      leafletId: (layer as any)._leaflet_id,
    } as MapCircleDto;
  }

  static convertFromCircle(mapCircleDto: MapCircleDto): Circle {
    return new Circle(new LatLng(mapCircleDto.coordinates[0].latitude, mapCircleDto.coordinates[0].longitude), mapCircleDto.radius, {});
  }

  static convertToPolygon(layer: Polygon): MapPolygonDto {
    const coords = layer.getLatLngs()[0];

    if (!_.isArray(coords)) {
      return null;
    }
    return this.convertCoordsToPolygon(coords as LatLng[], (layer as any)._leaflet_id);
  }

  static convertCoordsToPolygon(coords: LatLng[], leafletId: number) {
    const coordinates: Coord[] = [];
    let prev = null;
    let current = null;
    coords.forEach(coordinate => {
      current = coordinate;
      if (!this.isSamePoint(prev, current)) {
        coordinates.push({
          latitude: coordinate.lat,
          longitude: coordinate.lng,
        });
      }
      prev = current;
    });

    return {
      leafletId: leafletId,
      coordinates: coordinates,
    } as MapPolygonDto;
  }

  static convertFromPolygon(mapPolygonDto: MapPolygonDto): Polygon {
    return new Polygon<any>(mapPolygonDto.coordinates.map(value => new LatLng(value.latitude, value.longitude)));
  }

  static toGeojsonGeometry(area: Polygon | Circle): TurfPolygon | MultiPolygon {
    return area instanceof Circle ? this.toGeojsonCircle(area as Circle) : area.toGeoJSON().geometry;
  }

  static isSamePoint(point1: LatLng, point2: LatLng) {
    return !!(point1 && point2 && point1.lat === point2.lat && point1.lng === point2.lng);
  }

  private static toGeojsonCircle(area: Circle) {
    return circle(area.toGeoJSON(), area.getRadius(), { units: 'meters' }).geometry;
  }
}
