import { IconName } from '@fortawesome/free-solid-svg-icons';

export type Icon = Partial<FAIcon & ImageIcon>;

export type FAIcon = { fa: IconName };
export type ImageIcon = { img: string };
