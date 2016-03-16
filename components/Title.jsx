import React from 'react';
import Config from './Config.jsx';

const Title = () => {
  const url = `https://oauth.oit.duke.edu/oauth/authorize.php?${Config.getQueryString()}`;
  return (
    <div className="row">
        <div className="col-sm-4 col-sm-offset-4 title">
                <div className="logobox">
					
                    <img src="images/appreglogo.png" alt="app registration logo" />
                    <a href={url} className="netid-login"> </a>
                   
				</div>

        </div>
    </div>
  );
};

export default Title;
