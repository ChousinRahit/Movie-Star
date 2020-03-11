import { NULL_MOVIES } from '../actions/types';
const initialState = {
  errors: { nullMovies: false, netWorkError: false }
};

const errorsReducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case NULL_MOVIES:
      let newState = {
        ...state,
        errors: { ...state.errors, nullMovies: true }
      };
      return newState;
    default:
      return state;
  }
};

export default errorsReducer;
