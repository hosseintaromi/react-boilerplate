/* eslint-disable */
import { TextField, TextFieldProps, useForkRef } from '@mui/material';
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { useFormError } from './FormErrorProvider';
import { ChangeEvent, forwardRef, ReactNode, Ref } from 'react';
import { useTransform } from './useTransform';
import { Editor } from "@tinymce/tinymce-react";

export type TextFieldElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown,
> = Omit<TextFieldProps, 'name'> & {
  rules?: UseControllerProps<TFieldValues, TName>['rules'];
  name: TName;
  parseError?: (error: FieldError) => ReactNode;
  control?: Control<TFieldValues>;
  component?: typeof TextField;
  transform?: {
    input?: (value: PathValue<TFieldValues, TName>) => TValue;
    output?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => PathValue<TFieldValues, TName>;
  }
}

export const EditorElement = forwardRef(<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: TextFieldElementProps<TFieldValues, TName, TValue>,
    ref: Ref<HTMLDivElement>
) => {
  const {
    rules = {},
    parseError,
    type,
    name,
    control,
    inputRef,
    transform,
    ...rest
  } = props

  const errorMsgFn = useFormError();
  const customErrorFn = parseError || errorMsgFn;

  const {field, fieldState: {error}} = useController({
    name,
    control,
    disabled: rest.disabled,
    rules
  })

  const {value, onChange} = useTransform<TFieldValues, TName, TValue>({
    value: field.value,
    onChange: field.onChange,
    transform: {
      input:
          typeof transform?.input === 'function'
              ? transform.input
              : (value) => value || ('' as TValue),
      output:
          typeof transform?.output === 'function'
              ? transform.output
              : (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = event.target.value
                return (type === 'number' && value ? +value : value) as PathValue<TFieldValues, TName>
              }
    }
  })

  const handleInputRef = useForkRef(field.ref, inputRef);

  return (
      <Controller
          name={name}
          control={control}
          rules={{
            required: 'Veuillez insérer le text',
          }}
          render={() => (
              <Editor
                  apiKey='z2w1e67pasf9aysay4vbsh4mght29ydv48z857n8gni0lkax'
                  initialValue={value as any}
                  onChange={onChange}
                  init={{
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body {direction: rtl; font-family: vazirmatn}'
                  }}
              />
              // <TextFieldComponent
              //     {...rest}
              //     name={field.name}
              //     value={value}
              //     onChange={(event) => {
              //       onChange(event)
              //       if (typeof rest.onChange === 'function') {
              //         rest.onChange(event)
              //       }
              //     }}
              //     onBlur={field.onBlur}
              //     required={!!rules.required}
              //     type={type}
              //     error={!!error}
              //     helperText={
              //       error
              //           ? typeof customErrorFn === 'function'
              //               ? customErrorFn(error)
              //               : error.message
              //           : rest.helperText
              //     }
              //     ref={ref}
              //     inputRef={handleInputRef}
              // />
          )}
      />
  )
})
