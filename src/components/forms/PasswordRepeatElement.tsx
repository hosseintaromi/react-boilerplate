import { PasswordElement, PasswordElementProps } from './PasswordElement';
import { FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { forwardRef, Ref } from 'react';

export type PasswordRepeatElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TConfirmPasswordName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TPasswordName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TConfirmPasswordValue = unknown,
> = PasswordElementProps<
    TFieldValues,
    TConfirmPasswordName,
    TConfirmPasswordValue
> & {
  passwordFieldName: TPasswordName;
  customInvalidFieldMessage?: string;
}

export const PasswordRepeatElement = forwardRef(<
    TFieldValues extends FieldValues = FieldValues,
    TConfirmPasswordName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TPasswordName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TConfirmPasswordValue = unknown,
>(
    props: PasswordRepeatElementProps<TFieldValues, TConfirmPasswordName, TPasswordName, TConfirmPasswordValue>, ref: Ref<HTMLDivElement>
) => {
  const {passwordFieldName, customInvalidFieldMessage, control, ...rest} = props;

  const pwValue = useWatch({name: passwordFieldName, control})

  return (
      <PasswordElement
          control={control as any}
          {...rest}
          ref={ref}
          rules={{
            validate: (value: string) => {
              return (
                  value === pwValue ||
                  (customInvalidFieldMessage ?? 'Password should match')
              )
            },
          }}
      />
  )
})
