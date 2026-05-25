import { create } from "zustand";
import type maplibregl from "maplibre-gl";

type MapStore = {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map | null) => void;
};

const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));

export { useMapStore };