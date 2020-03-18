import React from 'react';
import Header from './components/Header';
import Movies from './components/Movies';
import MovieInfo from './components/MovieInfo';
import Footer from './components/Footer';
import SearchedResults from './components/SearchResults';
import ScrollMemory from 'react-router-scroll-memory';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <ScrollMemory />
        <Header />
        <Switch>
          <Route path="/Movie-Star" exact component={Movies} />
          <Route path="/Movie-Star/search" exact component={SearchedResults} />
          <Route path="/Movie-Star/:movieId" exact component={MovieInfo} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
