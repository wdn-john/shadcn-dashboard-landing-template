export interface GeocodeResponse {
  items: GeocodeItem[];
}

interface GeocodeItem {
  title: string;
  id: string;
  resultType: string;
  houseNumberType: string;
  address: Address;
  position: Position;
  access: Position[];
  mapView: MapView;
  scoring: Scoring;
}

interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  street: string;
  postalCode: string;
  houseNumber: string;
}

interface Position {
  lat: number;
  lng: number;
}

interface MapView {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Scoring {
  queryScore: number;
  fieldScore: FieldScore;
}

interface FieldScore {
  city: number;
  streets: number[];
  houseNumber: number;
}
