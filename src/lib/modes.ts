import { Factory, Thermometer, Waves } from "lucide-react";

const MODES = [
  { key: "co2", href: "/co2", icon: Factory },
  { key: "temperature", href: "/temperature", icon: Thermometer },
  { key: "sealevel", href: "/sealevel", icon: Waves },
] as const;

export { MODES };