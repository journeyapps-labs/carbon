import { MouseEvent } from 'react';
import { MapProperty } from '@journeyapps-labs/carbon-core';

export interface DropDownItem {
  label: string;
  action: () => any;
  icon?: string;
  color?: string;
}

interface ShowDropDownEvent {
  items: DropDownItem[];
  event: MouseEvent;
}

export enum InputType {
  TEXT = 'text'
}

interface ShowInputEvent {
  event: MouseEvent;
  initialValue: string;
  type: InputType;
  desc: string;
}

export interface BooleanDropDownItem extends Omit<DropDownItem, 'action'> {
  enabled: boolean;
  key: string;
}

interface ShowCheckboxDropDownEvent {
  event: MouseEvent;
  values: BooleanDropDownItem[];
}

export interface RenderingEngineContext {
  showDropDown: (event: ShowDropDownEvent) => any;
  showInput: (event: ShowInputEvent) => Promise<string | null>;
  showCheckboxDropDown: (event: ShowCheckboxDropDownEvent) => Promise<string[] | null>;
  showMapEditor?: (event: MapProperty) => Promise<any>;
}
