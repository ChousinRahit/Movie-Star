import React from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { lang } from '../../utils/langs';
import { genres, getGenre, getGenreId } from '../../utils/genres';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { MobileView, BrowserView } from 'react-device-detect';
import NoImage from '../../img/no_image.jpg';
import truncate from '../../utils/textTruncate';

import { useDispatch } from 'react-redux';
const Movie = ({ movie }) => {
  const dispatch = useDispatch();

  return (
    <div className="movies__movie">
      {/*<Link to={`/${movie.id}`}>
        <LazyLoadImage
          effect="blur"
          className="movies__movie__tumb"
          src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
        />
      </Link>*/}
      <Link to={`/${movie.id}`}>
        <img
          // effect="blur"
          className="movies__movie__tumb"
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
              : NoImage
          }
        />
      </Link>

      <div className="movies__movie_txt">
        <Link
          to={`/${movie.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h1 className="movies__movie_txt_name">
            {truncate(30, movie.title)}
            <span className="movies__movie_year">
              {new Date(movie.release_date).getFullYear().toString()}
            </span>
          </h1>
          <BrowserView>
            <p className="movies__movie_txt_desc">
              {truncate(160, movie.overview)}
            </p>
          </BrowserView>

          <MobileView>
            <p className="movies__movie_txt_desc">
              {truncate(80, movie.overview)}
            </p>
          </MobileView>
        </Link>
        <div className="movies__movie_info">
          <ul className="movies__movie_info_genre">
            {movie?.genre_ids.map(id => (
              <li key={id}>
                <Link
                  to={`/Movie-Star/search?genre=${getGenre(id).toLowerCase()}`}
                  className="btn btn-text"
                >
                  {getGenre(id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="movies__movie_meta">
          <ul>
            <li>{truncate(15, lang[movie.original_language]) || 'Unknown'}</li>
            <li>
              <FontAwesomeIcon icon={faStarHalfAlt} />
              {movie.vote_average}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Movie;
