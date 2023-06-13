import { t } from 'i18next';

type FormErrors<T> = {
  [key in keyof T]: string | null;
};

export function requiredFieldsGenerator<T extends object>(values: T): FormErrors<T> {
  const validationObject: FormErrors<T> = {} as FormErrors<T>;

  Object.keys(values).forEach((key) => {
    validationObject[key as keyof T] = values[key as keyof T]
      ? null
      : t('modals.requiredField');
  });

  return validationObject;
}
