import { StateCreator } from 'zustand';

export type GenericStateCreator<T> = StateCreator<T, [], [], T>;
