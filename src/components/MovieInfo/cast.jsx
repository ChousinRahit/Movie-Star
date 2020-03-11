import React from 'react';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../config';
import NoImage from '../../img/noimages.png';

const Cast = ({ profile_path, name, character, id }) => {
  const imgSrc = profile_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${profile_path}`
    : NoImage;
  return (
    <div className="cast__wrapper">
      <img className="cast__img" src={imgSrc} />
      <div className="cast__name">
        <h2>{name}</h2>
        {character && <p>as</p>}
        <h3>{character}</h3>
      </div>
    </div>
  );
};

export default Cast;
