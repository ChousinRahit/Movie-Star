import React, { useEffect, Fragment } from 'react';
import Hero from '../Hero';
import Loading from '../Loading';
import { lang } from '../../utils/langs';
import { useSelector, useDispatch } from 'react-redux';
import { getMovie, getCredits, getSimilarMovies } from '../../store/actions';
import Cast from './cast';
import Movie from '../Movies/movie';

const MovieIfo = ({ match }) => {
  const dispatch = useDispatch();
  const { movie, loading = true, credits } = useSelector(state => state.movies);
  const { simiMovies } = useSelector(state => state.simiMovies);

  useEffect(() => {
    dispatch(getMovie(match.params.movieId));
    dispatch(getCredits(match.params.movieId));
    dispatch(getSimilarMovies(match.params.movieId));
    window.scroll(0, 0);
  }, [getMovie, getCredits, match.params.movieId]);

  const genres = movie.genres?.map(g => g.name);

  const loadingDiv = (
    <div className="loadingDiv">
      <Loading />
    </div>
  );

  let creditInfo = [
    {
      label: 'Language',
      value: `${lang[movie.original_language] || 'Unknown'}`
    },
    {
      label: 'Rating',
      value: `${movie.vote_average || 'Unknown'}`
    },
    {
      label: 'Budget',
      value: movie.budget
        ? `$ ${new Intl.NumberFormat('en-IN', {
            maximumSignificantDigits: 3
          }).format(movie.budget)}`
        : 'Unkown'
    },
    {
      label: 'Revenue',
      value: movie.revenue
        ? `$ ${new Intl.NumberFormat('en-IN', {
            maximumSignificantDigits: 3
          }).format(movie.revenue)}`
        : 'Unkown'
    },
    { label: 'Release Date', value: movie.release_date },
    { label: 'Status', value: movie.status },
    {
      label: 'Runtime',
      value: `${Math.floor(movie.runtime / 60)} hours - ${movie.runtime %
        60} mins`
    }
  ];

  if (movie.title !== movie.original_title) {
    creditInfo = [
      ...creditInfo,
      { label: 'Original Title', value: movie.original_title }
    ];
  }

  const getCreditInfo = each => (
    <li>
      <h2>
        {each.label}
        <span className="credits__info-values">{each.value || 'Unknown'}</span>
      </h2>
    </li>
  );
  return (
    <div>
      {loading ? (
        loadingDiv
      ) : (
        <div className="movieInfo">
          <Hero heroMovie={movie} genres={genres} tagline={movie.tagline} />

          <div className="credits">
            <div className="credits__cast-word">CAST</div>
            <section className="credits__cast">
              {credits?.map(people => (
                <Cast
                  profile_path={people.profile_path}
                  name={people.name}
                  character={people.character}
                  id={people.id}
                  key={people.id}
                />
              ))}
            </section>
          </div>

          <div className="credits__info">
            <h2 className="credits__info-word">INFO</h2>
            <ul>{creditInfo.map(each => getCreditInfo(each))}</ul>
          </div>
          <div>
            <h2 className="credits__similar-word">Similar Movies</h2>
          </div>
          <div className="movies">
            {simiMovies.map(mov => (
              <Movie key={mov.id} movie={mov} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieIfo;
