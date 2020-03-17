import {
  GETMOVIES,
  LOADMORE,
  LOADING,
  GETMOVIE,
  GETCREDITS,
  GETMOVIES_WITH_QUERY,
  GETMOVIE_WITH_GENRE,
  PAGELOADING,
  NULL_MOVIES,
  LAST_PAGE_REACHED,
  LOAD_MORE_PAGE_CHANGE,
  SET_QUERY_ITEM,
  SET_PAGE_TO_INITIAL
} from '../actions/types';

const initialState = {
  movies: [],
  page: { popular: 1, q: 1, genre: 1, lang: 1, year: 1 },
  loading: true,
  pageLoading: true,
  movie: {},
  credits: [],
  quriedMovies: [],
  queryItem: '',
  errors: { nullMovies: false, netWorkError: false },
  lastPageReached: false
};

export default function moviesReducer(state = initialState, action) {
  const { type, payload, option } = action;

  let newState = { ...state };
  switch (type) {
    case LOADING:
      return { ...state, loading: true };

    case PAGELOADING:
      return { ...state, pageLoading: true };
    case GETMOVIES:
      newState = {
        ...state,
        movies: payload[0],
        loading: false,
        page: { ...state.page, popular: payload[1] || state.page.popular }
      };
      sessionStorage.setItem('popMovies', JSON.stringify(payload[0]));
      sessionStorage.setItem(
        'popPage',
        JSON.stringify(payload[1] || state.page)
      );
      return newState;
    case LOADMORE:
      newState = {
        ...state,
        movies: state.movies.concat(payload[0]),
        loading: false,
        page: { ...state.page, popular: payload[1] || state.page.popular }
      };
      sessionStorage.setItem(
        'popMovies',
        JSON.stringify(state.movies.concat(payload[0]))
      );
      sessionStorage.setItem(
        'popPage',
        JSON.stringify(payload[1] || state.page)
      );
      return newState;

    case GETMOVIE:
      newState = { ...state, movie: payload, loading: false };
      return newState;

    case GETCREDITS:
      newState = {
        ...state,
        credits: payload.cast
      };
      return newState;

    case GETMOVIES_WITH_QUERY:
      const with_query = option
        ? [...state.quriedMovies, ...payload[0]]
        : payload[0];

      // console.log(option);
      newState = {
        ...state,
        quriedMovies: with_query,
        loading: false,
        pageLoading: false,
        lastPageReached: false,
        errors: { ...state.errors, nullMovies: !payload[0].length }
      };
      return newState;

    case GETMOVIE_WITH_GENRE:
      const with_genre = option
        ? [...state.quriedMovies, ...payload[0]]
        : payload[0];

      newState = {
        ...state,
        quriedMovies: with_genre,
        loading: false,
        pageLoading: false,
        lastPageReached: false
      };

      return newState;
    case NULL_MOVIES:
      newState = {
        ...state,
        errors: { ...state.errors, nullMovies: true }
      };
      return newState;

    case LAST_PAGE_REACHED:
      newState = {
        ...state,
        lastPageReached: true
      };
      return newState;
    case SET_QUERY_ITEM:
      newState = {
        ...state,
        queryItem: payload
      };
      return newState;
    case SET_PAGE_TO_INITIAL:
      newState = {
        ...state,
        page: { popular: state.page.popular, q: 1, genre: 1, lang: 1, year: 1 }
      };
      return newState;
    case LOAD_MORE_PAGE_CHANGE:
      console.log(
        '====================================================================================================================================================================='
      );
      newState = {
        ...state,
        page: {
          ...state.page,
          popular: state.page.popular,
          [payload]: state.page[payload] + 1
        }
      };
      return newState;
    default:
      return state;
  }
}
