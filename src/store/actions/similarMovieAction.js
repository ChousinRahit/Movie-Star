import axios from 'axios';
import { SIMILAR_MOVIES } from './types';
import { API_KEY, API_URL } from '../../config';
import fetchItems from '../../utils/fetchItems';

export const getSimilarMovies = movie_id => async dispatch => {
  const endpoint = `${API_URL}movie/${movie_id}/similar?api_key=${API_KEY}&language=en-US`;
  try {
    const { movies } = await fetchItems(endpoint);
    // Sorting by vote_average and slicing to 6 movies
    let sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
    if (movies.length > 6) {
      sortedMovies = sortedMovies.slice(0, 6);
    }
    dispatch({
      type: SIMILAR_MOVIES,
      payload: sortedMovies
    });
  } catch (err) {
    console.log('[simiAc]', err);
  }
};
