import csgoicon from 'assets/images/gamesIcons/csgoicon.png';
import dotaicon from 'assets/images/gamesIcons/dotaicon.png';

type Data = {
  Games: { image: string; label: string; value: string }[];
  Formats: { value: string; label: string }[];
  Gamemodes: { value: string; label: string }[];
};

export const TOURNAMENTS_CONFIG: Data = {
  Games: [
    {
      image: csgoicon,
      label: 'CS:GO',
      value: 'CS:GO',
    },
    {
      image: dotaicon,
      label: 'Dota 2',
      value: 'Dota 2',
    },
  ],
  Formats: [{ value: 'Olympic system', label: 'Olympic system' }],
  Gamemodes: [
    { value: '1v1', label: '1v1' },
    { value: '2v2', label: '2v2' },
    { value: '5v5', label: '5v5' },
    { value: 'Wingman', label: 'Wingman' },
  ],
};
