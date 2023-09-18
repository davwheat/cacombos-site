import Modulation from '@api/Models/Modulation';

export default function friendlyQamConverter(qam: (Modulation | undefined)[] | false | null): string {
  if (!qam) return '?';

  const q = qam?.map((q) => q?.toString() ?? '?').join(' / ');

  return q;
}
