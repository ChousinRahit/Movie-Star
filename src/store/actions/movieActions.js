import axios from 'axios';
import {
  GETMOVIES,
  LOADING,
  LOADMORE,
  GETMOVIE,
  GETCREDITS,
  GETMOVIES_WITH_QUERY,
  GETMOVIE_WITH_GENRE,
  PAGELOADING,
  NULL_MOVIES,
  LAST_PAGE_REACHED
} from './types';
import { API_KEY, API_URL } from '../../config';
import fetchItems from '../../utils/fetchItems';

export const getMovies = searchKeyword => async dispatch => {
  const sessionPopMovies = sessionStorage.getItem('popMovies');
  const sessionPopPage = sessionStorage.getItem('popPage');

  if (sessionPopMovies && sessionPopPage) {
    let movies = JSON.parse(sessionPopMovies);
    dispatch({
      type: GETMOVIES,
      payload: [movies, parseInt(sessionPopPage)]
    });
  } else {
    dispatch({
      type: LOADING
    });
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    const res = await fetchItems(endpoint);
    const { movies, page } = res;
    // console.log(res);
    if (!res) {
      return dispatch({
        type: NULL_MOVIES
      });
    }

    dispatch({
      type: GETMOVIES,
      payload: [movies, page]
    });
  }
};

export const loadMore = () => async (dispatch, getState) => {
  dispatch({
    type: LOADING
  });

  const prevPage = getState().movies.page.popular;
  const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${prevPage +
    1}`;
  const { movies, page } = await fetchItems(endpoint);
  dispatch({
    type: LOADMORE,
    payload: [movies, page]
  });
};

export const getMovie = movieId => async dispatch => {
  dispatch({
    type: LOADING
  });
  const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;

  try {
    const movie = await axios.get(endpoint);
    dispatch({
      type: GETMOVIE,
      payload: movie.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const getCredits = movieId => async dispatch => {
  const endpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;

  const res = await axios.get(endpoint);
  dispatch({
    type: GETCREDITS,
    payload: res.data
  });
};

// Handling both search with new Search keyword and/or Load more for same keyword
export const getMoviesWithSearchKeywords = (reqParams, page, option) => async (
  dispatch,
  getState
) => {
  page === 1
    ? dispatch({
        type: PAGELOADING
      })
    : dispatch({
        type: LOADING
      });

  console.log(reqParams);

  let endpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US`;
  let type = '';

  for (let [key, value] of Object.entries(reqParams)) {
    if (value) {
      switch (key) {
        case 'keyword':
          endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${value}&page=${page.withQuery}`;
          type = GETMOVIES_WITH_QUERY;
          break;
        case 'genre':
          endpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${value}&page=${page.withGenre}`;
          type = GETMOVIE_WITH_GENRE;
          break;
        case 'lang':
          endpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&with_original_language=${value}&page=${page.withLang}`;
          type = GETMOVIES_WITH_QUERY;
          break;
        case 'year':
          endpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&primary_release_year=${value}&page=${page.withYear}`;
          type = GETMOVIES_WITH_QUERY;
          break;
        default:
          break;
      }
    }
  }

  console.log(endpoint);

  // const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${reqParams.keyword ||
  //   ''}&with_genres=${reqParams.genre}&page=${page}`;
  const res = await axios.get(endpoint);

  // console.log(res);
  let movies = res.data.results;
  const totalPages = res.data.total_pages;

  if (movies.length === 0) {
    dispatch({
      type: NULL_MOVIES
    });
  }

  // console.log('pppppppp', totalPages, page);

  // Using page state to know what is the request for (new search or Laod more)
  const prevPage = getState().movies.page.withQuery;

  // Sorting movies on the vote_average
  movies.sort((a, b) => b.vote_average - a.vote_average);

  dispatch({
    type,
    payload: [movies, page],
    option
  });

  console.log(totalPages, page);
  for (let v in page) {
    if (totalPages <= page[v]) {
      dispatch({
        type: LAST_PAGE_REACHED
      });
    }
  }
};

export const getMoviesWithGenre = (genreId, page) => async (
  dispatch,
  getState
) => {
  page === 1
    ? dispatch({
        type: PAGELOADING
      })
    : dispatch({
        type: LOADING
      });

  const endpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`;
  const res = await axios.get(endpoint);
  const totalPages = res.data.total_pages;
  let movies = res.data.results;

  // Using page state to know what is the request for (new Genre click or Laod more)
  const prevPage = getState().movies.page.withGenre;

  // option to
  let option = 0; // 0 - for new Genre click , 1 - for load more
  if (prevPage !== page) {
    option = 1;
  }
  // Sorting movies on the vote_average
  movies.sort((a, b) => b.vote_average - a.vote_average);

  dispatch({
    type: GETMOVIE_WITH_GENRE,
    payload: [movies, page],
    option
  });

  if (totalPages <= page) {
    dispatch({
      type: LAST_PAGE_REACHED
    });
  }
};

// https://api.themoviedb.org/3/search/movie?api_key=a6ee910303db76c7dfd31dcee2af9349&language=en-US&primary_release_year=2019
// https://api.themoviedb.org/3/discover/movie?api_key=a6ee910303db76c7dfd31dcee2af9349&language=en-US&primary_release_year=2018
