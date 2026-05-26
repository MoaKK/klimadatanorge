import { CloudRain, Factory, MountainSnow, Thermometer, Waves } from "lucide-react";

const MODES = [
  { key: "co2", href: "/co2", icon: Factory },
  { key: "temperature", href: "/temperature", icon: Thermometer },
  { key: "sealevel", href: "/sealevel", icon: Waves },
  { key: "precipitation", href: "/precipitation", icon: CloudRain },
  { key: "glacier", href: "/glacier", icon: MountainSnow },
] as const;

export { MODES };