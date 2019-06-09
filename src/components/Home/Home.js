import React, { useEffect, useState } from 'react';
import { Header, Auth } from '../index';
import { withFirebase } from '../Firebase';
import pizzaMan from '../../pizza-man.png';

const Home = ({ firebase }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.getAuthStateChanged(async user => {
      await setUser(user);
      setLoading(false);
    });
  });

  return (
    <div id="home">
      <Header />
      <div id="home-bottom">
        {
          loading
            ? <div className="loading-image-container"><img className="loading-image" src={pizzaMan} /></div>
            : user
              ? <span>Welcome, {user.displayName}</span>
              : <Auth />
        }
      </div>
    </div>
  )
}

export default withFirebase(Home);