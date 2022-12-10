import CardLink from '@components/Links/CardLink';

import type Modem from '../../api/Models/Modem';

export interface ModemsListItemProps {
  modem: Modem;
}

export default function ModemsListItem({ modem }: ModemsListItemProps) {
  return (
    <li css={{ display: 'block', height: '100%' }}>
      <CardLink to={`/admin/modems/edit/${modem.uuid()}`} css={{ height: '100%' }}>
        <h3 className="text-loud" css={{ marginBottom: 0 }}>
          {modem.name()}
        </h3>

        {/* <dl css={{ marginTop: 'auto' }}>
          <ModemsListItemDescriptionValue name="Name" value={modem?.name() ?? 'Unknown'} />
        </dl> */}
      </CardLink>
    </li>
  );
}

interface ModemsListItemDescriptionValueProps {
  name: string;
  value: string;
}

function ModemsListItemDescriptionValue({ name, value }: ModemsListItemDescriptionValueProps) {
  return (
    <>
      <dt className="text-speak-up" css={{ marginTop: 8 }}>
        {name}
      </dt>
      <dd className="text-speak">{value}</dd>
    </>
  );
}
