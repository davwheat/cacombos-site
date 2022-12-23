import RadioButtonGroup from '@components/Inputs/RadioButtonGroup';
import { AdminUploadFormType, ADMIN_UPLOAD_FORM_TYPE_OPTIONS } from '../AdminComboUploadFormPage';
import Colors from '@data/colors.json';

export interface SelectFormTypeProps {
  onChange: (value: AdminUploadFormType) => void;
  value: AdminUploadFormType;
}

export default function SelectFormType({ onChange, value }: SelectFormTypeProps) {
  return (
    <RadioButtonGroup
      css={{ background: Colors.lightGrey, marginTop: 24 }}
      groupLabel="Source data type"
      onChange={onChange}
      value={value}
      options={Object.entries(ADMIN_UPLOAD_FORM_TYPE_OPTIONS).map(([description]) => ({
        label: description,
        value: description as AdminUploadFormType,
      }))}
    />
  );
}
