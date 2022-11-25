export default function friendlyQamConverter(qam: string | null): string {
  return qam?.replace(/qam$/i, ' QAM') ?? '';
}
