import { useState } from 'react';

const useAuth = (submitCallback, initialState) => {
  const [inputs, setInputs] = useState(initialState);

  const handleSubmit = async evt => {
    try {
      evt && evt.preventDefault();
      await submitCallback(inputs.email, inputs.passwordOne, inputs.username);
      setInputs(initialState);
    } catch (err) {
      console.log('err');
    }
  };

  const handleChange = evt => {
    evt.persist();
    setInputs({ ...inputs, [evt.target.name]: evt.target.value });
  }

  return {
    inputs,
    handleSubmit,
    handleChange,
  }
}

export default useAuth;