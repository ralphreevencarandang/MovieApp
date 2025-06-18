
import Header from './component/Header';
import { useState , useEffect} from "react";
import Search from './component/Search';
import MovieCard from './component/MovieCard';
import { Spinner } from "flowbite-react";
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';


// Base API ng TMDB
const API_BASE_URL = 'https://api.themoviedb.org/3';

//import the API KEY from .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Second Parameters for fetch method
const API_OPTIONS = {
  method: "GET",
  headers: {
    // What kind of data the we will accept in our application
    accept: 'application/json',
    //Bearer then your API KEY 
    Authorization: `Bearer ${API_KEY}`,
  }
}

function App() {

    const [searchTerm, setSearchTerm] = useState('');
    // Dito s-store yung mga search term na nadebounced
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    
    // This is for displaying error message
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [loading,setLoading] = useState(true);

    // Trending Movies State
    const [trendingMovies, setTrendingMovies] = useState([]);

    // Every mag babago yung search term ng 500ms s-store niya debouncedSearchTerm yubng searchTerm
    useDebounce(
      ()=>{
      
        setDebouncedSearchTerm(searchTerm)},
        500,
        [searchTerm]);
      
      //  Function to fetch the trending movies
    const loadTrendingMovies  = async () => {
      try{
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
      }catch(error){
        console.log('Error Fetching Trending Movies', error)
      }
    }
    

    // Create a async function to fetch the movie from API
    const fetchMovies = async (query)=> {
      try{
          const endpoint = query 
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
          // Fetch is allowing you to request HTTPS request in API
          const res = await fetch(endpoint, API_OPTIONS);

          if(!res.ok){
            throw new Error("Failed to fetch movies ");
          }
          const data = await res.json();

          // If mag error yung data is mag t-throw siya ng error at iseset ang movie list into empty array
          if(data.Response == 'False'){
              setErrorMessage(data.Error || 'Failed to fetch movies');
              setMovieList([])
          }
          // Since yung mga data ay nasa result key ng OBject
          setMovieList(data.results);
          

          // Check if my query or may results
          if(query && data.results.length > 0){
            await updateSearchCount(query, data.results[0]);

          }

      }catch(error){
        console.error(`Error Fetching Movies: ${error}`)
        setErrorMessage('Error Fetching Movies Please Try Again Later');
      }finally{
        setLoading(false)
      }
    }

    // Once the components mounts it will call the fetchMovies function
    useEffect(()=>{
      // yung query sa fetch movie function
      fetchMovies(debouncedSearchTerm);
      // Kada mag babago yung search term if-fetch niya yung movies
    }, [debouncedSearchTerm]);

    // Once na mag mount yung components id-display niya yung mga trending movies
    useEffect(()=>{
      loadTrendingMovies();
    },[]);


  return (
    <>
      <main>
          <div className="pattern">
              <div className="wrapper">
                  <Header/>
                  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>    

                  {/*  Check if the trending movies is not null else display the section*/}
                  {trendingMovies.length > 0 && (
                    <section className='trending'>
                      <h2>Trending Movies</h2>
                      <ul>
                        {trendingMovies.map((movie, index) => (
                          // These data is from the database
                          <li key={movie.$id}>
                              <p>{index + 1}</p>
                              <img src={movie.poster_url} alt={movie.title} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className='all-movies'>
                      <h2>All Movies</h2>
                      {/* If nag l-loading pa siya or di pa tapos ifetch the spinner will show up */}
                      {loading ? (
                          <Spinner/>
                        ): 
                        // if nag false na yung loading c-check niya naman kung may error
                        errorMessage ? (
                            <p className='text-red-500'>{errorMessage}</p>
                        ) : (
                          // if walang error im-map niya na yung Movie Card
                        <ul>
                            {movieList.map( (movie) => 
                              <MovieCard key={movie.id} movie={movie}/>
                            )}

                          
                        </ul>
                        )}
                        
                  </section>  
              </div>
          </div>
      </main>
    </>
  )
}

export default App
