import { Button, IconButton, Stack } from "@mui/material";
import { Popover } from "@components/Popover";
import FilterIcon from "@mui/icons-material/FilterAltOutlined";
import { FormElements } from "@components/forms/FormElements";
import { FormContainerProps } from "@components/forms/FormContainer";

type FilterType =
    'Autocomplete' |
    'CheckboxButtonGroup' |
    'Checkbox' |
    'DatePickerJalali' |
    'DatePicker' |
    'DateTimePicker' |
    'MobileDatePicker' |
    'TimePicker' |
    'MultiSelect' |
    'Password' |
    'PasswordRepeat' |
    'RadioButton' |
    'Select' |
    'Slider' |
    'Switch' |
    'Textarea' |
    'TextField' |
    'ToggleButtonGroup';

interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  componentProps?: any;
  rules?: any;
}

export interface FilterPopupProps extends Omit<FormContainerProps<any>, "onSuccess"> {
  fields: FilterField[];
  onSubmit: FormContainerProps['onSuccess']
}

export const FilterPopup = (props: FilterPopupProps) => {
  const {fields = [], onSubmit} = props;

  const generateField = (fieldProps: FilterField) => {
    const {type, componentProps, name, ...rest} = fieldProps;
    const componentsMap: Record<FilterType, any> = {
      Autocomplete: FormElements.Autocomplete,
      CheckboxButtonGroup: FormElements.CheckboxButtonGroup,
      Checkbox: FormElements.Checkbox,
      DatePickerJalali: FormElements.DatePickerJalali,
      DatePicker: FormElements.DatePicker,
      DateTimePicker: FormElements.DateTimePicker,
      MobileDatePicker: FormElements.MobileDatePicker,
      TimePicker: FormElements.TimePicker,
      MultiSelect: FormElements.MultiSelect,
      Password: FormElements.Password,
      PasswordRepeat: FormElements.PasswordRepeat,
      RadioButton: FormElements.RadioButton,
      Select: FormElements.Select,
      Slider: FormElements.Slider,
      Switch: FormElements.Switch,
      Textarea: FormElements.Textarea,
      TextField: FormElements.TextField,
      ToggleButtonGroup: FormElements.ToggleButtonGroup,
    }
    const Field = componentsMap[type];
    return <Field key={name} name={name} {...rest} {...componentProps}/>
  }

  return (
      <Popover>
        <Popover.Toggle>
          <IconButton><FilterIcon/></IconButton>
        </Popover.Toggle>
        <Popover.Content>
          <FormElements.Container onSuccess={onSubmit}>
            <Stack sx={{minWidth: '250px'}} p={1.5} spacing={2}>
              {
                fields.map(field => generateField(field))
              }
              <Button type="submit">اعمال فیلتر</Button>
            </Stack>
          </FormElements.Container>
        </Popover.Content>
      </Popover>
  )
}
