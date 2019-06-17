import React, { useEffect, useState } from 'react';
import { Header, Auth, Modal } from '../index';
import { withFirebase } from '../Firebase';
import pizzaMan from '../../pizza-man.png';

const Home = ({ firebase }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.getAuthStateChanged(async currentUser => {
      const userData = await firebase.getUserFromDb(currentUser.uid);
      await setUser(userData);
      setLoading(false);
    });
  }, [firebase.getCurrentUser]);

  return (
    <div id="home">
      <Header />
      <div id="home-bottom">
        {
          loading
            ? <div className="loading-image-container"><img className="loading-image" src={pizzaMan} alt="pizza-man" /></div>
            : user
              ? (
                <div id="home-user">
                  <span id="home-user-welcome">Welcome, {user.displayName}</span>
                  <div id="home-user-stats">
                    <span>Quick stats</span>
                    <span>Visited: {user.pizzeriasVisited.length}</span>
                    <span>On the list: {user.pizzeriasToVisit.length}</span>
                  </div>
                </div>
              )
              : <Auth />
        }
      </div>
    </div>
  )
}

export default withFirebase(Home);