import { ITournamentData } from 'store/slices';

interface IGroupedData {
  id: string;
  title: string;
  items: ITournamentData[];
}

export const groupByDate = (data: ITournamentData[]): IGroupedData[] => {
  const sortedTournaments = data
    .slice()
    .sort((a: { expectedDate: string }, b: { expectedDate: string }) => {
      const dateA = new Date(a.expectedDate);
      const dateB = new Date(b.expectedDate);

      return dateA.getTime() - dateB.getTime();
    });

  return sortedTournaments.reduce((acc: IGroupedData[], tournament: ITournamentData) => {
    const date = new Date(tournament.expectedDate).toLocaleDateString();
    const index = acc.findIndex((group) => group.title === date);

    if (index !== -1) {
      acc[index].items.push(tournament);
    } else {
      acc.push({ title: date, items: [tournament], id: tournament.id });
    }

    return acc;
  }, []);
};
