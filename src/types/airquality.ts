type Station = {
  eoi: string;
  name: string;
  latitude: number;
  longitude: number;
  height: number;
  kommune: { name: string; areacode: string };
  grunnkrets?: { name: string; areacode: string };
  delomrade?: { name: string; areacode: string };
};

type AQIVariable = { value: number; units: string };

type AQITimeEntry = {
  from: string;
  to: string;
  variables: {
    AQI?: AQIVariable;
    no2_concentration?: AQIVariable;
    pm10_concentration?: AQIVariable;
    pm25_concentration?: AQIVariable;
    o3_concentration?: AQIVariable;
    so2_concentration?: AQIVariable;
  };
};

type StationAQIData = {
  meta: {
    reftime: string;
    location: { name: string; longitude: number; latitude: number; areacode: string };
    superlocation?: { name: string; path: string; areaclass: string };
  };
  data: { time: AQITimeEntry[] };
};

export type { Station, AQIVariable, AQITimeEntry, StationAQIData };