/* eslint-disable */
import CloseIcon from '@mui/icons-material/Cancel';
import {
  Control,
  FieldError,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps
} from 'react-hook-form';
import {
  Checkbox,
  Chip,
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  InputLabelProps,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  useForkRef
} from '@mui/material';
import { useFormError } from './FormErrorProvider';
import { forwardRef, ReactNode, Ref } from 'react';
import { useTransform } from './useTransform';
import { utilsService } from '@utils/utilsService';

export type MultiSelectElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown,
> = Omit<SelectProps, 'value'> & {
  options: TValue[];
  label?: string;
  itemKey?: string;
  itemValue?: string;
  itemLabel?: string;
  rules?: UseControllerProps<TFieldValues, TName>['rules'];
  name: TName
  parseError?: (error: FieldError) => ReactNode;
  minWidth?: number;
  menuMaxHeight?: number;
  menuMaxWidth?: number;
  helperText?: ReactNode;
  showChips?: boolean;
  preserveOrder?: boolean;
  control?: Control<TFieldValues>;
  showCheckbox?: boolean;
  formControlProps?: Omit<FormControlProps, 'fullWidth' | 'variant'>;
  transform?: {
    input?: (value: PathValue<TFieldValues, TName>) => TValue[];
    output?: (event: SelectChangeEvent<unknown>, child: ReactNode) => PathValue<TFieldValues, TName>;
  }
  inputLabelProps?: Omit<InputLabelProps, 'htmlFor' | 'required'>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MultiSelectElement = forwardRef(<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: MultiSelectElementProps<TFieldValues, TName, TValue>,
    ref: Ref<HTMLDivElement>
) => {
  const {
    options,
    label = '',
    itemKey = 'id',
    itemValue = '',
    itemLabel = 'label',
    rules = {},
    parseError,
    name,
    menuMaxHeight = ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    menuMaxWidth = 250,
    minWidth = 120,
    helperText,
    showChips,
    preserveOrder,
    control,
    showCheckbox,
    formControlProps,
    inputRef,
    transform,
    inputLabelProps,
    ...rest
  } = props;

  const errorMsgFn = useFormError();
  const customErrorFn = parseError || errorMsgFn;

  const renderLabel = (item: any) => {
    return options.find((op) => {
      const optionVal = op[itemValue || itemKey] ?? op
      return optionVal === item
    })?.[itemLabel] ?? item
  }

  const {field, fieldState: {error}} = useController({
    name,
    rules: rules,
    disabled: rest.disabled,
    control
  })

  const {value, onChange} = useTransform<TFieldValues, TName, TValue[]>({
    value: field.value,
    onChange: field.onChange,
    transform: {
      input:
          typeof transform?.input === 'function'
              ? transform.input
              : (value) => {
                return Array.isArray(value)
                    ? value
                    : ([] as PathValue<TFieldValues, TName>)
              },
      output: transform?.output
    }
  })

  const handleInputRef = useForkRef(field.ref, inputRef);

  const renderHelperText = error
      ? typeof customErrorFn === 'function'
          ? customErrorFn(error)
          : error.message
      : helperText

  return (
      <FormControl
          {...formControlProps}
          style={{
            minWidth,
            ...formControlProps?.style,
          }}
          variant={rest.variant}
          fullWidth={rest.fullWidth}
          error={!!error}
          size={rest.size}
          ref={ref}>
        {label && (
            <InputLabel
                {...inputLabelProps}
                size={rest.size === 'small' ? 'small' : inputLabelProps?.size}
                error={!!error}
                htmlFor={rest.id || `select-multi-select-${name}`}
                required={!!rules.required}>
              {label}
            </InputLabel>
        )}
        <Select
            {...rest as any}
            id={rest.id || `select-multi-select-${name}`}
            multiple
            label={label || undefined}
            error={!!error}
            value={value}
            required={!!rules.required}
            onChange={onChange}
            onBlur={field.onBlur}
            MenuProps={{
              ...rest.MenuProps,
              slotProps: {
                ...rest.MenuProps?.slotProps,
                paper: {
                  ...(rest.MenuProps?.slotProps?.paper ?? {
                    style: {
                      maxHeight: menuMaxHeight,
                      width: menuMaxWidth,
                      ...(utilsService.propertyExists(
                              rest.MenuProps?.slotProps?.paper,
                              'style'
                          ) &&
                          typeof rest.MenuProps.slotProps.paper.style ===
                          'object' && {
                            ...rest.MenuProps.slotProps.paper.style,
                          }),
                    },
                  }),
                },
              },
            }}
            renderValue={
              typeof rest.renderValue === 'function'
                  ? rest.renderValue
                  : showChips
                      ? (selected) => (
                          <div style={{display: 'flex', flexWrap: 'wrap'}}>
                            {
                              (preserveOrder
                                      ? options.filter((option) => (selected as any[]).includes(option))
                                      : (selected as any[]) || []
                              ).map((selectedValue) => (
                                  <Chip
                                      key={selectedValue}
                                      label={renderLabel(selectedValue)}
                                      style={{display: 'flex', flexWrap: 'wrap'}}
                                      onDelete={() => {
                                        onChange((Array.isArray(value) ? value : []).filter((i: any) => i !== selectedValue))
                                      }}
                                      deleteIcon={
                                        <CloseIcon
                                            onMouseDown={(ev) => {
                                              ev.stopPropagation()
                                            }}
                                        />
                                      }/>
                              ))
                            }
                          </div>
                      )
                      : (selected) =>
                          Array.isArray(selected)
                              ? selected.map(renderLabel).join(', ')
                              : ''
            }
            inputRef={handleInputRef}>
          {options.map((item) => {
            const val: string | number = item[itemValue || itemKey] || item
            const isChecked = Array.isArray(value)
                ? value.some((v) => v === val)
                : false
            return (
                <MenuItem
                    key={val}
                    value={val}
                    sx={{
                      fontWeight: (theme) => isChecked ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular
                    }}>
                  {showCheckbox && <Checkbox checked={isChecked}/>}
                  <ListItemText primary={item[itemLabel] || item}/>
                </MenuItem>
            )
          })}
        </Select>
        {
            renderHelperText && (
                <FormHelperText error={!!error}>{renderHelperText}</FormHelperText>
            )
        }
      </FormControl>
  )
})
