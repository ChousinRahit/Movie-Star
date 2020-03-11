import React from 'react';

//-------------------------------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

//-------------------------------
const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__logo">
        <FontAwesomeIcon className="footer__logo__icon" icon={faFilm} />
        <h1>
          MOVIE <span className="footer__text__star">Star</span>
        </h1>
      </div>

      <div className="footer__contact">
        <h2>Stay In Touch</h2>
        <ul>
          <li>
            <a>2428kcr@gmail.com</a>
          </li>
          <li>98441443228 / 8217454919</li>
          <li> z √ ○ ò ≡</li>
        </ul>
      </div>
      <div className="footer__themoviedb">
        <div className="themovieorg__logo"></div>
        This product uses the TMDb API but is not endorsed or certified by TMDb.
      </div>
    </footer>
  );
};

export default Footer;
