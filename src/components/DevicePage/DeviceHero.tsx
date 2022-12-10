import Colors from '@data/colors.json';
import Hero from '@components/Design/Hero';
import dayjs from 'dayjs';

import type Device from '@api/Models/Device';

export interface DeviceHeroProps {
  device?: Device;
  loading?: boolean;
  error?: boolean;
}

export default function DeviceHero({ device, error = false, loading = false }: DeviceHeroProps) {
  if (error) {
    return (
      <Hero firstElement size="large" color={Colors.primaryRed}>
        <h1 className="text-louder">Failed to load</h1>
      </Hero>
    );
  }

  if (loading) {
    return (
      <Hero firstElement size="large" color={Colors.neutralGrey}>
        <h1 className="text-louder">Fetching device info...</h1>
      </Hero>
    );
  }

  if (!device) {
    return (
      <Hero firstElement size="large" color={Colors.primaryRed}>
        <h1 className="text-louder">Device not found</h1>
      </Hero>
    );
  }

  return (
    <Hero firstElement size="normal" color={Colors.primaryBlue}>
      <h1 className="text-louder">
        {device.manufacturer()} {device.deviceName()} ({device.modelName()})
      </h1>
      <p role="doc-subtitle" className="text-loud">
        Released {dayjs(device.releaseDate()).format('D MMMM YYYY')}
      </p>
    </Hero>
  );
}
