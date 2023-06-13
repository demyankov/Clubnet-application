import csgoicon from 'assets/images/gamesIcons/csgoicon.png';
import dotaicon from 'assets/images/gamesIcons/dotaicon.png';

type Games = { image: string; label: string; value: string }[];

export const GAMES: Games = [
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
];
