import React, { useState, useEffect, Fragment } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilm } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
//-------------------------------

// import logo from '../../img/logo1.png';
import { getMoviesWithSearchKeywords, getMovies } from '../../store/actions';

//-------------------------------

const Header = () => {
  //-------------------------------
  // Drawer state and logic
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [queryYear, setQueryYear] = useState('');
  const [isCategoriesShowing, setIsCategoriesShowing] = useState(false);
  const [isYearFieldInvalid, setIsYearFieldInvalid] = useState(false);
  //-------------------------------

  const history = useHistory();

  const dispatch = useDispatch();

  let drawerClass = ['drawer'];
  let drawerContentClass = ['drawer-content'];
  if (isDrawerOpen) {
    drawerClass.push('drawer__open');
    drawerContentClass.push('drawer-content__open');
  }

  //-------------------------------

  // Disableing scroll when menu is open
  useEffect(() => {
    let overflow;
    if (isDrawerOpen) {
      overflow = 'hidden';
    } else {
      overflow = 'unset';
    }
    document.body.style.overflow = overflow;
  }, [isDrawerOpen]);

  //-------------------------------

  const onYearSubmitClick = e => {
    if (e.target.value.length < 4) {
      setIsYearFieldInvalid(true);
    }
    e.preventDefault();
    if (queryYear >= 1881) history.push(`/search?year=${queryYear}`);
  };

  const Links = (
    <Fragment>
      <li className="header__nav-list-item" onClick={() => history.push('/')}>
        <a href="/">Popular</a>
      </li>
      <li
        className="header__nav-list-item"
        onMouseOver={() => setIsCategoriesShowing(true)}
        onMouseLeave={() => setIsCategoriesShowing(false)}
      >
        <a className="header__nav-list-item_categories">Categories</a>
        <div
          onMouseOver={() => setIsCategoriesShowing(true)}
          className={
            isCategoriesShowing
              ? 'header__nav-list-item_categories_list'
              : ['header__nav-list-item_categories_list', 'displayNone'].join(
                  ' '
                )
          }
        >
          <ul className="header__nav-list-item_categories_sublist">
            <h3>Genre</h3>
            <li>
              <Link to="/search?genre=action">Action</Link>
            </li>
            <li>
              <Link to="/search?genre=adventure">Adventure</Link>
            </li>
            <li>
              <Link to="/search?genre=animation">Animation</Link>
            </li>

            <li>
              <Link to="/search?genre=comedy">Comedy</Link>
            </li>
            <li>
              <Link to="/search?genre=crime">Crime</Link>
            </li>
            <li>
              <Link to="/search?genre=documentary">Documentary</Link>
            </li>
            <li>
              <Link to="/search?genre=drama">Drama</Link>
            </li>
            <li>
              <Link to="/search?genre=family">Family</Link>
            </li>
            <li>
              <Link to="/search?genre=fantasy">Fantasy</Link>
            </li>
            <li>
              <Link to="/search?genre=history">History</Link>
            </li>
            <li>
              <Link to="/search?genre=horror">Horror</Link>
            </li>
            <li>
              <Link to="/search?genre=sci-fri">Sci-Fri</Link>
            </li>
            <li>
              <Link to="/search?genre=thriller">Thriller</Link>
            </li>
            <li>
              <Link to="/search?genre=war">War</Link>
            </li>
            <li>
              <Link to="/search?genre=western">Western</Link>
            </li>
          </ul>
          <ul className="header__nav-list-item_categories_sublist-2">
            <h3>Popular Languages</h3>
            <li>
              <Link to="/search?lang=en">English</Link>
            </li>
            <li>
              <Link to="/search?lang=hi">Hindi</Link>
            </li>
            <li>
              <Link to="/search?lang=kn">Kannada</Link>
            </li>
            <li>
              <Link to="/search?lang=te">Telugu</Link>
            </li>
            <li>
              <Link to="/search?lang=cn">Chinese</Link>
            </li>
            <li>
              <Link to="/search?lang=ko">Korean</Link>
            </li>
          </ul>
          <div>
            <h3>Year</h3>
            <form>
              <input
                className="yearInput"
                maxLength="4"
                placeholder="year"
                value={queryYear}
                onChange={e =>
                  setQueryYear(e.target.value.match(/^\d+$/) && e.target.value)
                }
              />

              <button
                onClick={e => onYearSubmitClick(e)}
                className="btn btn-yearInput"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </li>

      <li className="header__nav-list-item">
        <a href="#footer">About</a>
      </li>
    </Fragment>
  );

  // const onChangeSearchInput = e => {
  //   e.preventDefault();
  //   const value = e.target.value;
  //   setSearchKey(value);
  //   if (!value) {
  //     dispatch(getMovies());
  //   }
  //   dispatch(getMoviesWithSearchKeywords(value));
  // };
  const onMenuIconClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const onSubmitSearch = e => {
    e.preventDefault();
    e.target.children[0].blur();
    if (searchKey) {
      setIsDrawerOpen(false);
      history.push(`/search?q=${searchKey}`);
    }
  };
  return (
    <header>
      <section className="header">
        <div className="header__logo-wrapper" onClick={() => history.push('/')}>
          <h1 className="header__heading">
            MOVIE <span className="header__text__star">Star</span>
          </h1>
          <FontAwesomeIcon className="header__logo" icon={faFilm} />
        </div>
        <form className="search" onSubmit={e => onSubmitSearch(e)}>
          <input
            type="text"
            className="search__input"
            placeholder="Search Movies"
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
          />
          <button type="submit" className="search__button">
            <FontAwesomeIcon className="search__icon" icon={faSearch} />
          </button>
        </form>
        <nav className="header__nav">
          <ul className="header__nav-list">{Links}</ul>
        </nav>
        <input
          type="checkbox"
          checked={isDrawerOpen}
          onChange={e => setIsDrawerOpen(!isDrawerOpen)}
          id="menurad"
          className="header__menu-radio"
        />
        <div className="header__menu-icon" onClick={onMenuIconClick}>
          <label>
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
      </section>
      <aside className={drawerClass.join(' ')}>
        <div className={drawerContentClass.join(' ')}>
          <form className="drawer-search" onSubmit={e => onSubmitSearch(e)}>
            <input
              type="text"
              className="drawer-search__input"
              placeholder="Search Movies"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />

            <button className="drawer-search__button">
              <FontAwesomeIcon
                className="drawer-search__icon"
                icon={faSearch}
              />
            </button>
          </form>
          <nav className="drawer-header__nav">
            <ul className="drawer-header__nav-list">{Links}</ul>
          </nav>
        </div>
      </aside>
    </header>
  );
};

export default Header;
