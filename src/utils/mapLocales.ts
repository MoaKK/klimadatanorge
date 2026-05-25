import type { Locale } from "next-intl";

const nbMapLocale: Record<string, string> = {
  "AttributionControl.ToggleAttribution": "Vis/skjul attribuering",
  "AttributionControl.MapFeedback": "Tilbakemelding om kart",
  "FullscreenControl.Enter": "Gå til fullskjerm",
  "FullscreenControl.Exit": "Avslutt fullskjerm",
  "GeolocateControl.FindMyLocation": "Finn min posisjon",
  "GeolocateControl.LocationNotAvailable": "Posisjon ikke tilgjengelig",
  "Map.Title": "Kart",
  "NavigationControl.ResetBearing": "Tilbakestill retning mot nord",
  "NavigationControl.ZoomIn": "Zoom inn",
  "NavigationControl.ZoomOut": "Zoom ut",
  "ScaleControl.Meters": "m",
  "ScaleControl.Kilometers": "km",
  "CooperativeGesturesHandler.WindowsHelpText": "Bruk Ctrl + scroll for å zoome kartet",
  "CooperativeGesturesHandler.MacHelpText": "Bruk ⌘ + scroll for å zoome kartet",
  "CooperativeGesturesHandler.MobileHelpText": "Bruk to fingre for å flytte kartet",
};

const mapLocales: Record<Locale, Record<string, string>> = {
  nb: nbMapLocale,
  en: {},
};

export { mapLocales };