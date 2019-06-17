import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div id="header">
      <div id="header-title-container">
        <span id="header-title">Pizza Diary</span>
      </div>
      <div id="header-navbar">
        <NavLink to="/map">Find your next slice</NavLink>
      </div>
    </div>
  );
}

export default Header;
