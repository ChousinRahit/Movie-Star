import axios from 'axios';

const fetchItems = async endPoint => {
  try {
    const res = await axios.get(endPoint);
    console.log(res.data);

    const movies = res.data.results;
    const page = res.data.page;
    return { movies, page };
  } catch (err) {
    console.log(err);
  }
};

export default fetchItems;
