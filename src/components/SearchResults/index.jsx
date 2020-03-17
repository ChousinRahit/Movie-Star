import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Movie from '../Movies/movie';
import Loading from '../Loading';
import { getGenreId } from '../../utils/genres';
import {
  getMoviesWithSearchKeywords,
  getTheNextPage,
  setPageToInitial
} from '../../store/actions';

const SearchedResults = () => {
  // Selecting state from redux store
  const { loading, pageLoading, lastPageReached, errors, page } = useSelector(
    state => state.movies
  );

  const { quriedMovies } = useSelector(state => state.movies);

  const { nullMovies } = errors;

  // console.log('aaaaaaaaaa', lastPageReached);

  // instance of react-redux dispatch hook
  const dispatch = useDispatch();

  const [queryMode, setQueryMode] = useState('');
  const [queryItem, setQueryItem] = useState('');
  const [first, setFirst] = useState(true);

  // router hook to know the current location
  const location = useLocation();
  const history = useHistory();
  // getting the query from url
  const queryObj = location.search.split('=');

  const prevQueryItemRef = useRef();
  useEffect(() => {
    setQueryMode(queryObj[0].substr(1));
    // console.log('-----------setting queryMode');
    prevQueryItemRef.current = queryItem;
    setQueryItem(queryObj[1]);
    // console.log('-----------setting queryItem');
  }, [queryObj]);

  const prevQuery = prevQueryItemRef.current;

  // console.log('prevQuery', prevQuery);

  // just for fun - if query is empty, showing results for 'empty' ☺
  if (queryObj[0] === '?q' && !queryObj[1]) {
    queryObj[1] = 'empty';
  }

  const prevQueryTerm = usePrevious(queryItem);

  useEffect(() => {
    let reqParams = {
      keyword: null,
      genre: null,
      lang: null,
      year: null
    };

    switch (queryMode) {
      case 'q':
        reqParams.keyword = queryItem;
        break;
      case 'genre':
        reqParams.genre = getGenreId(queryItem);
        break;

      case 'lang':
        reqParams.lang = queryItem;
        break;
      case 'year':
        reqParams.year = queryItem;
        break;

      default:
        break;
    }

    // option to
    // let option = 0; // 0 - for new Search keyword , 1 - for load more
    // if (prevQuery === queryObj[1]) {
    //   option = 1;
    // }

    console.log(prevQuery !== queryObj[1] && !first);
    if (prevQuery !== queryObj[1] && !first) {
      dispatch(setPageToInitial);

      return;
    }
    dispatch(getMoviesWithSearchKeywords(reqParams, queryItem));
    console.log(reqParams, queryItem);
  }, [queryItem, page]);

  const ShowingResultsHeading = (
    <h1 className="search__results-heading">
      <FontAwesomeIcon icon={faSearch} />
      &nbsp; &nbsp; Showing Results for{' '}
      <span>
        {location.search.split('=')[0] === '?q'
          ? `Keyword ${queryObj[1]}`
          : `Genre ${queryObj[1]}`}
      </span>
    </h1>
  );

  // Load more button logic
  const onClickLoadMore = e => {
    e.preventDefault();

    // ------------------------------------ ACTION TO INCREASE PAGE NUMBER
    dispatch(getTheNextPage(queryMode));
  };

  // console.log('[queryItem]', queryItem);

  const loadingDiv = (
    <div className="loadingDiv">
      <Loading />
    </div>
  );

  if (nullMovies) {
    return (
      <div className="no_results">
        <h2>
          Sorry, we couldn't find any content for <span>"</span>
          {queryObj[1]}
          <span>"</span>
        </h2>

        <ul>
          <li>Check your spelling and try again</li>
          <li>Be less specific about long words</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div>{ShowingResultsHeading}</div>
      {pageLoading ? (
        loadingDiv
      ) : (
        <div>
          <div className="movies">
            {quriedMovies.map(movie => (
              <Movie key={movie.id} movie={movie} />
            ))}
          </div>
          {loading && <Loading />}
          {!lastPageReached && (
            <div className="movies__load-more">
              <button
                className="btn btn-white"
                onClick={e => onClickLoadMore(e)}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchedResults;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
