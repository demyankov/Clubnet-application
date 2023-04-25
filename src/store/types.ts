import { StateCreator } from 'zustand';

export type GenericStateCreator<T> = StateCreator<T, [], [], T>;

export interface IError {
  code: string;
  message: string;
  name: string;
}
