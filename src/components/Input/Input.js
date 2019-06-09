import React from 'react';
import classNames from 'classnames';

const Input = props => {
  const { error, onChange, placeholder, name, type, value } = props;

  return (
    <div className="input-container">
      <input
        autoComplete="do-not"
        className={classNames('input', {'input-field-error': error})}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {
        error
          ? <p className="input-error">{error}</p>
          : null
      }
    </div>
  )
}

export default Input;