import { Address } from "./Address";
import { Position } from "./Position";
import { Access } from "./Access";
import { MapView } from "./MapView";

export type Item = {
  title: string;
  id: string;
  resultType: string;
  houseNumberType: string;
  address: Address;
  position: Position;
  access: Access[];
  distance: number;
  mapView: MapView;
};

export type ItemsResponse = {
  items: Item[];
};