import React, { useState } from 'react';
import { Input } from '../index';
import { withFirebase } from '../Firebase';
import useAuth from '../../hooks/useAuth';

const Auth = ({ firebase }) => {
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const firebaseAuth = async (email, password, username) => {
    try {
      isSignUp
        ? await firebase.doSignUp(email, password, username)
        : await firebase.doSignInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  // Keys must match name attributes of Input fields
  const initialState = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: ''
  };

  const { inputs, handleSubmit, handleChange } = useAuth(firebaseAuth, initialState);

  return (
    <form id="auth-form" onSubmit={handleSubmit}>
      {
        isSignUp
          ? <Input
            name="username"
            value={inputs.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
          />
          : null
      }
      <Input
        name="email"
        value={inputs.email}
        onChange={handleChange}
        type="text"
        placeholder="Email Address"
      />
      <Input
        name="passwordOne"
        value={inputs.passwordOne}
        onChange={handleChange}
        type="password"
        placeholder="Password"
      />
      {
        isSignUp
          ? <Input
            name="passwordTwo"
            value={inputs.passwordTwo}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
          />
          : null
      }
      {error.length ? <span className="form-error">{error}</span> : null}
      <div id="auth-form-footer">
        <button id="auth-form-submit-button" type="submit">{isSignUp ? 'Sign Up' : 'Log in'}</button>
        {
          isSignUp
            ? <span>Already have an account? <span id="auth-form-footer-redirect" onClick={() => setIsSignUp(false)}>Log in!</span></span>
            : <span>Don't have an account? <span id="auth-form-footer-redirect" onClick={() => setIsSignUp(true)}>Sign up!</span></span>
        }
      </div>
    </form>
  );
}

export default withFirebase(Auth);