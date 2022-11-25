export default function modulationTransformer(mod: string | null): string | null {
  if (mod === null) {
    return null;
  }

  switch (mod.toLowerCase()) {
    case 'qpsk':
      return 'QPSK';

    case '16qam':
    case 'qam16':
      return '16qam';

    case '64qam':
    case 'qam64':
      return '64qam';

    case '256qam':
    case 'qam256':
      return '256qam';

    case '1024qam':
    case 'qam1024':
      return '1024qam';

    default:
      return mod;
  }
}
