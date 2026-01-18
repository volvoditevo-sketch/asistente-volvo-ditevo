
export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export interface QuickAction {
  label: string;
  prompt: string;
}

export type Category = 'VN' | 'OCASION';

export interface Vehicle {
  type: Category;
  title: string;
  price: string;
  year?: string;
  km?: string;
  fuel?: string;
  imageUrl: string;
  detailUrl: string;
}
