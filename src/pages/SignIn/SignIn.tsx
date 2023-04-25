import { FC } from 'react';

import { SignInForm } from 'components';
import { FormComponent } from 'components/shared';

const SignIn: FC = () => {
  return (
    <FormComponent>
      <SignInForm />
    </FormComponent>
  );
};

export default SignIn;
