import React from 'react';
import { userContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';

export default function Profile() {
  const { user } = useContext(UserContext);
  return (
    <div>
      <h1>Profile</h1>
      {!!user && (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}!</p>
        </div>
      )}
    </div>
  );
}
