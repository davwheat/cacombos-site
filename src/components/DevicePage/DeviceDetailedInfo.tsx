import { useContext } from 'react';

import Section from '@components/Design/Section';

import { DevicePageContext } from './DevicePage';

import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsUtc);

function DeviceDetailedInfo() {
  const device = useContext(DevicePageContext);

  const modem = device?.modem() || undefined;

  return (
    <Section>
      <h2 className="text-loud">Device info</h2>

      <table
        css={{
          margin: '16px 0',
          border: '2px solid black',
          borderCollapse: 'collapse',
          maxWidth: '100%',
          width: 450,
          minWidth: 'fit-content',

          '& tr': {
            borderBottom: '2px solid black',
          },

          '& td': {
            padding: '8px 12px',

            '&:first-of-type': {
              background: 'black',
              color: 'white',
              fontWeight: 'bold',
            },
          },
        }}
      >
        <tbody>
          <tr>
            <td>Modem</td>
            <td>{modem?.name()}</td>
          </tr>
          <tr>
            <td>Released</td>
            <td>{dayjs.utc(device?.releaseDate()).format('DD MMMM YYYY')}</td>
          </tr>
          <tr>
            <td>Added to site</td>
            <td>{dayjs.utc(device?.createdAt()).format('DD MMMM YYYY')}</td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

export default DeviceDetailedInfo;
