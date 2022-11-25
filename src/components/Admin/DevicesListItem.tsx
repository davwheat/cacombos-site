import React from 'react';
import dayjs from 'dayjs';
import type Device from '../../api/Models/Device';
import CardLink from '@components/Links/CardLink';

export interface DevicesListItemProps {
  device: Device;
}

export default function DevicesListItem({ device }: DevicesListItemProps) {
  const modem = device.modem() || null;

  return (
    <li>
      <CardLink to={`/admin/devices/edit/${device.uuid()}`}>
        <h3 className="text-loud">
          {device.deviceName()} ({device.modelName()})
        </h3>

        <dl>
          <DevicesListItemDescriptionValue name="Modem" value={modem?.name() ?? 'Unknown'} />
          <DevicesListItemDescriptionValue name="Release date" value={dayjs(device.releaseDate()).format('MMM YYYY')} />
        </dl>
      </CardLink>
    </li>
  );
}

interface DevicesListItemDescriptionValueProps {
  name: string;
  value: string;
}

function DevicesListItemDescriptionValue({ name, value }: DevicesListItemDescriptionValueProps) {
  return (
    <>
      <dt className="text-speak-up" css={{ marginTop: 8 }}>
        {name}
      </dt>
      <dd className="text-speak">{value}</dd>
    </>
  );
}
