import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Movie from '../Movies/movie';
import Loading from '../Loading';
import { getGenreId } from '../../utils/genres';
import {
  getMoviesWithGenre,
  getMoviesWithSearchKeywords
} from '../../store/actions';

const SearchedResults = () => {
  // Selecting state from redux store
  const {
    quriedMovies,
    loading,
    pageLoading,
    lastPageReached,
    errors
  } = useSelector(state => state.movies);

  const { nullMovies } = errors;

  // console.log('aaaaaaaaaa', lastPageReached);

  // instance of react-redux dispatch hook
  const dispatch = useDispatch();

  // component state to hold the page data and some flags
  const [page, setPage] = useState({
    withQuery: 1,
    withGenre: 1,
    withLang: 1,
    withYear: 1
  });

  const [queryMode, setQueryMode] = useState('');
  const [queryItem, setQueryItem] = useState('');

  // router hook to know the current location
  const location = useLocation();
  const history = useHistory();
  // getting the query from url
  const queryObj = location.search.split('=');

  const prevQueryItemRef = useRef();
  useEffect(() => {
    setQueryMode(queryObj[0].substr(1));
    console.log('-----------setting queryMode');
    prevQueryItemRef.current = queryItem;
    setQueryItem(queryObj[1]);
    console.log('-----------setting queryItem');
  });

  const prevQuery = prevQueryItemRef.current;

  console.log('prevQuery', prevQuery);

  // just for fun - if query is empty, showing results for 'empty' ☺
  if (queryObj[0] === '?q' && !queryObj[1]) {
    queryObj[1] = 'empty';
  }

  const prevQueryTerm = usePrevious(queryItem);

  useEffect(() => {
    // if (prevQueryTerm !== queryItem) {
    //   setPage({ withQuery: 1, withGenre: 1, withLang: 1, withYear: 1 });
    //   console.log('-----------setting Page');
    // }
    let reqParams = {
      keyword: null,
      genre: null,
      lang: null,
      year: null
    };

    switch (queryMode) {
      case 'q':
        // setIsWithQuery(true);
        reqParams.keyword = queryItem;
        // dispatch(getMoviesWithSearchKeywords(queryItem, page.withQuery));
        break;
      case 'genre':
        // setIsWithQuery(false);
        // dispatch(getMoviesWithGenre(getGenreId(queryItem), page.withGenre));
        // console.log(queryItem);
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
    let option = 0; // 0 - for new Search keyword , 1 - for load more
    if (prevQuery === queryObj[1]) {
      option = 1;
    }

    dispatch(getMoviesWithSearchKeywords(reqParams, page, option));
  }, [queryItem, page]);

  // useEffect(() => {
  //   console.log('{{{{{{{{{{{{{{{{{{{COMP DID MOUNT')
  //   setPage({ withQuery: 1, withGenre: 1, withLang: 1, withYear: 1 });
  // }, [queryItem]);

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
    let pageObj = {};

    switch (queryMode) {
      case 'q':
        pageObj = {
          withQuery: page.withQuery + 1,
          withGenre: 1,
          withLang: 1,
          withYear: 1
        };
        break;
      case 'genre':
        pageObj = {
          withQuery: 1,
          withGenre: page.withGenre + 1,
          withLang: 1,
          withYear: 1
        };
        break;
      case 'lang':
        pageObj = {
          withQuery: 1,
          withGenre: 1,
          withLang: page.withLang + 1,
          withYear: 1
        };
        break;
      case 'year':
        pageObj = {
          withQuery: 1,
          withGenre: 1,
          withLang: 1,
          withYear: page.withYear + 1
        };
        break;
      default:
        break;
    }

    setPage(pageObj);
    console.log('-----------setting Page');
  };

  // console.log(page);
  // console.log(
  // 'PAGE OBJJJJJJJJJJJnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
  // page
  // );

  console.log('[PAGE]', page);
  console.log('[queryItem]', queryItem);
  console.log('[queryItem]', queryItem);

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
