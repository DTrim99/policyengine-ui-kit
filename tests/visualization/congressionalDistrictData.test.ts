import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import geo119 from '../../src/visualization/data/congressionalDistrictsGeo.json';
import geo120 from '../../src/visualization/data/congressionalDistrictsGeo120.json';
import hex119 from '../../src/visualization/data/congressionalDistrictsHex.json';
import hex120 from '../../src/visualization/data/congressionalDistrictsHex120.json';
import type { GeoJSONFeatureCollection } from '../../src/visualization/types';

const ids = (collection: unknown) =>
  (collection as GeoJSONFeatureCollection).features.map((f) => f.properties.DISTRICT_ID as string);

// The states whose hexes The Downballot moved in hexmap v3.2 (2026).
const HEX_MOVED = new Set(['CA', 'FL', 'NC', 'OH', 'TN', 'TX', 'UT']);

describe('120th Congress district data', () => {
  it('has the same district IDs as the 119th boundaries, one shape each', () => {
    expect(ids(geo120)).toHaveLength(437);
    expect(new Set(ids(geo120)).size).toBe(437);
    expect(new Set(ids(geo120))).toEqual(new Set(ids(geo119)));
  });

  it('marks every boundary as the 120th Congress with Census codes', () => {
    for (const f of (geo120 as GeoJSONFeatureCollection).features) {
      expect(f.properties.CONGRESS).toBe(120);
      expect(f.properties.CDSESSN).toBe('120');
      expect(f.properties.GEOIDFQ).toBe(`5002000US${f.properties.STATEFP}${f.properties.CD120FP}`);
    }
  });

  it('writes at-large districts and DC as -01, as the API does', () => {
    const byId = new Map((geo120 as GeoJSONFeatureCollection).features.map((f) => [f.properties.DISTRICT_ID, f]));
    expect(byId.get('AK-01')?.properties.CD120FP).toBe('00');
    expect(byId.get('DC-01')?.properties.CD120FP).toBe('98');
    expect(byId.has('PR-98')).toBe(true);
  });

  it('has a hex for every district and keeps the hexes of states The Downballot did not move', () => {
    expect(new Set(ids(hex120))).toEqual(new Set(ids(hex119)));
    const old = new Map((hex119 as GeoJSONFeatureCollection).features.map((f) => [f.properties.DISTRICT_ID, f]));
    for (const f of (hex120 as GeoJSONFeatureCollection).features) {
      const state = f.properties.STATEAB as string;
      if (!HEX_MOVED.has(state)) {
        expect(f.geometry).toEqual(old.get(f.properties.DISTRICT_ID)?.geometry);
      }
    }
  });

  it('lists the same districts in the key table as on the map, excluding Puerto Rico', () => {
    const csv = readFileSync(
      resolve(__dirname, '../../data-sources/congressional-districts/cd120/district_keys_cd120.csv'),
      'utf8',
    );
    const [header, ...rows] = csv.trim().split(/\r?\n/);
    const column = header.split(',').indexOf('district_id');
    const tableIds = new Set(rows.map((r) => r.split(',')[column]));
    const mapIds = new Set(ids(geo120).filter((id) => id !== 'PR-98'));
    expect(tableIds.size).toBe(436);
    expect(tableIds).toEqual(mapIds);
  });
});
