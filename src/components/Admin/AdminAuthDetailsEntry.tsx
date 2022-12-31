import { useState } from 'react';
import { useRecoilState } from 'recoil';

import Section from '@components/Design/Section';
import Button from '@components/Inputs/Button';
import TextBox from '@components/Inputs/TextBox';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';

import EyeOffOutlineIcon from 'mdi-react/EyeOffOutlineIcon';
import EyeOutlineIcon from 'mdi-react/EyeOutlineIcon';

export interface AdminAuthDetailsEntryProps {
  sectionProps?: Partial<React.ComponentProps<typeof Section>>;
}

export default function AdminAuthDetailsEntry({ sectionProps }: AdminAuthDetailsEntryProps) {
  const [showToken, setShowToken] = useState(false);
  const [apiAuthDetails, setAdminAuthDetails] = useRecoilState(AdminAuthDetailsAtom);

  return (
    <Section darker usePadding {...sectionProps}>
      <h2 className="text-louder">Authentication</h2>

      <TextBox
        value={apiAuthDetails.token}
        onInput={(token) => {
          setAdminAuthDetails((v) => ({ ...v, token }));
        }}
        style={showToken ? {} : { fontFamily: 'sans-serif' }}
        label="Token"
        helpText="Enter your token. Without this, you cannot save changes. This will be saved and auto-filled next time you load the website. Do not enter this on a public computer."
        type={showToken ? 'text' : 'password'}
        endAdornment={
          <Button
            onClick={() => {
              setShowToken((v) => !v);
            }}
            css={{ padding: 0, width: 48, height: 36, alignItems: 'center', justifyContent: 'center' }}
          >
            {showToken ? <EyeOutlineIcon /> : <EyeOffOutlineIcon />}
          </Button>
        }
      />
    </Section>
  );
}
