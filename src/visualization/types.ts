export type MapVisualizationType = 'geographic' | 'hex';

/**
 * The Congress whose district boundaries a US district map draws. Draw the boundaries the
 * data was computed on: 119th-Congress results on the 119th map, 120th on the 120th.
 */
export type CongressNumber = 119 | 120;

export interface ChoroplethDataPoint {
  geoId: string;
  label: string;
  value: number;
}

export interface HexMapDataPoint {
  id: string;
  label: string;
  value: number;
  x: number;
  y: number;
}

export interface ColorScaleConfig {
  colors: string[];
  symmetric?: boolean;
}

export interface ColorRange {
  min: number;
  max: number;
}

export interface ChoroplethMapConfig {
  width?: number;
  height?: number;
  colorScale?: ColorScaleConfig;
  projectionConfig?: Record<string, unknown>;
  defaultFill?: string;
  borderColor?: string;
  borderWidth?: number;
  showColorBar?: boolean;
  formatValue?: (value: number) => string;
}

export interface HexMapConfig {
  hexSize?: number;
  gap?: number;
  colorScale?: ColorScaleConfig;
  showLabels?: boolean;
  labelFontSize?: number;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][] | number[][][][];
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  [key: string]: unknown;
}
