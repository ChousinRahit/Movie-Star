import React, { useEffect } from 'react';
import Movie from './movie';
import Loader from '../Loading';
import Hero from '../Hero';
import { getMovies, loadMore } from '../../store/actions';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { LOADING } from '../../store/actions/types';

const Movies = () => {
  let { movies, loading } = useSelector(state => state.movies);
  let { errors } = useSelector(state => state.error);

  const history = useHistory();

  if (errors.nullMovies) {
    history.push('/noResy');
  }

  console.log(window.screen.width);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const onClickLoadMore = () => {
    dispatch(loadMore('popular'));
  };

  return (
    <div>
      <Hero heroMovie={movies[10]} />
      <div className="movies">
        {movies.map(movie => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
      {loading && <Loader />}
      <div className="movies__load-more">
        <button className="btn btn-white" onClick={onClickLoadMore}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default Movies;
