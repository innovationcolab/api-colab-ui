import React from 'react';
import Config from './Config.jsx';

const Title = () => {
  const url = `https://oauth.oit.duke.edu/oauth/authorize.php?${Config.getQueryString()}`;
  return (
    <div>
      <h1>title page</h1>
      <a href={url}>Login with Duke OAuth</a>
    </div>
  );
};

export default Title;
