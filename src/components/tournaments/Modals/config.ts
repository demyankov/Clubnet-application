type Data = {
  Formats: { value: string; label: string }[];
  Gamemodes: { value: string; label: string }[];
};

export const TOURNAMENTS_CONFIG: Data = {
  Formats: [{ value: 'Olympic system', label: 'Olympic system' }],
  Gamemodes: [
    { value: '1v1', label: '1v1' },
    { value: '2v2', label: '2v2' },
    { value: '5v5', label: '5v5' },
    { value: 'Wingman', label: 'Wingman' },
  ],
};
