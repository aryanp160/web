// src/components/SignOut.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i> Sign Out
      </button>
    </div>
  );
};

export default SignOut;
