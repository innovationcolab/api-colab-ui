import React from 'react';
import Config from './Config.jsx';

const Title = () => {
  const url = `https://oauth.oit.duke.edu/oauth/authorize.php?${Config.getQueryString()}`;
  return (
    <div className="row">
        <div className="col-sm-4 col-sm-offset-4 title">
					
                    <img src="images/appreglogo.png" alt="app registration logo" />
                    <p>To access the Co-Lab's data APIs, you'll need to register your application and get a key.  </p>
                    <a href={url} className="netid-login"> </a>
                   
				
        </div>
    </div>
  );
};

export default Title;
