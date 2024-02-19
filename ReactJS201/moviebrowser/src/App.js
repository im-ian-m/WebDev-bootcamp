import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import SearchView from './components/SearchView';
import MovieView from './components/MovieView';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    // fetchSearchResults(searchQuery)
    if(searchQuery) {
      /* fetch(`https://api.themoviedb.org/3/search/movie?api_key=your-api-key-here&language=en-US&query=${searchQuery}&page=1&include_adult=false`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSearchResults(data.results)
        })*/

      setSearchResults([{'original_title': 'originalTitle1', 'id': 1}, {'original_title': 'originalTitle2', 'id': 2}])
    }
  }, [searchQuery])

  window.onload = (e) => {
    const path = window.location.pathname
    const match = path.search(/^\/search\/.*/)
    if(match === 0) {
      setSearchQuery(path.substring(8))

      // fetchSearchResults()
    }
  }

  function handleSubmit(e) {
    if(searchText) {
      e.preventDefault()
      setSearchQuery(searchText)
      navigate(`/search/${searchText}`)
      // fetchSearchResults()  
    }
  }

  return (
    <div>
      <Navbar searchText={searchText} setSearchText={setSearchText} handleSubmit={handleSubmit} />
      <Routes>
        <Route path='/' exact element={<HomeView />} />
        <Route path='/about' element={<AboutView />} />
        <Route path='/search/:searchQuery'
          element={
            <SearchView searchResults={searchResults} searchQuery={searchQuery} />
          }
        />
        <Route path='/movies/:id' element={<MovieView />} />
      </Routes>
    </div>
  );
}

export default App;
