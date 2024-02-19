import Hero from './Hero.js';
import Poster from './Poster.js'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const MovieView = () => {
    const { id } = useParams();
    const [ movieDetails, setMovieDetails ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    // const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    const posterUrl = 'https://picfiles.alphacoders.com/190/190986.jpg'
    const [ backdropUrl, setBackdropUrl ] = useState('');
    const [ movieGenres, setMovieGenres ] = useState([]);
    // console.log(id);
    //TODO: deal with null path
    const updateMovieGenres = () => {
        if (movieDetails != null) {
            
        }
    }
    useEffect(() => {
        const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=your-api-key-here&language=en-US`
        fetch(movieUrl)
            .then(response => response.json())
            .then(movieData => {
                setMovieDetails(movieData)
                console.log(movieData)
                setIsLoading(false)
                setBackdropUrl(`https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`)
            })
            setMovieDetails(
                {
                    "adult": false,
                    "backdrop_path": "/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg",
                    "belongs_to_collection": {
                        "id": 10,
                        "name": "Star Wars Collection",
                        "poster_path": "/gq5Wi7i4SF3lo4HHkJasDV95xI9.jpg",
                        "backdrop_path": "/d8duYyyC9J5T825Hg7grmaabfxQ.jpg"
                    },
                    "budget": 11000000,
                    "genres": [
                        {
                            "id": 12,
                            "name": "Adventure"
                        },
                        {
                            "id": 28,
                            "name": "Action"
                        },
                        {
                            "id": 878,
                            "name": "Science Fiction"
                        }
                    ],
                    "homepage": "http://www.starwars.com/films/star-wars-episode-iv-a-new-hope",
                    "id": 11,
                    "imdb_id": "tt0076759",
                    "original_language": "en",
                    "original_title": "Star Wars",
                    "overview": "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
                    "popularity": 112.643,
                    "poster_path": "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                    "production_companies": [
                        {
                            "id": 1,
                            "logo_path": "/o86DbpburjxrqAzEDhXZcyE8pDb.png",
                            "name": "Lucasfilm Ltd.",
                            "origin_country": "US"
                        },
                        {
                            "id": 25,
                            "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
                            "name": "20th Century Fox",
                            "origin_country": "US"
                        }
                    ],
                    "production_countries": [
                        {
                            "iso_3166_1": "US",
                            "name": "United States of America"
                        }
                    ],
                    "release_date": "1977-05-25",
                    "revenue": 775398007,
                    "runtime": 121,
                    "spoken_languages": [
                        {
                            "english_name": "English",
                            "iso_639_1": "en",
                            "name": "English"
                        }
                    ],
                    "status": "Released",
                    "tagline": "A long time ago in a galaxy far, far away...",
                    "title": "Star Wars",
                    "video": false,
                    "vote_average": 8.204,
                    "vote_count": 19067
                }
            )
            // console.log(movieDetails)
            console.log("genres:", movieDetails.original_title)
            // updateMovieGenres()
            setIsLoading(false)
    }, [id]);

    // useEffect(() => {
    //     updateMovieGenres()
    //     console.log(movieDetails)
    // }, [movieDetails])

    function renderMovieDetails() {
        if(isLoading) {
            return <Hero text="Loading..." />
        }
        if(movieDetails) {
            //include: poster, name, overview, runtime, release date, genre(s), rating
            let genres = ""
            movieDetails['genres'].forEach((value, i) => {
                if (i > 0) {
                    genres += ' • '
                }
                genres += value.name
            })

            const hours = parseInt(movieDetails['runtime'] / 60)
            const mins = movieDetails['runtime'] % 60

            const rating = (Math.round(movieDetails['vote_average'] * 10) / 10).toFixed(1)


            return ( 
                <>
                    <Hero text={movieDetails.original_title} backdrop={/*backdropUrl*/""} />
                    <div className="container my-5">
                        <div className="row">
                            <div className="col-md-3">
                                {/*posterUrl*/}
                                <Poster url={posterUrl} className="img-fluid shadow rounded mb-5" altText={movieDetails.original_title} />
                            </div>
                            <div className="col-md-9">
                                <h2>{movieDetails.original_title}</h2>
                                <h5 className="text-secondary">{genres}</h5>
                                <p className="lead my-4">{movieDetails.overview}</p>
                                <div className="container px-4 text-center my-5 d-none d-lg-block">
                                    <div className="row gx-5">
                                        <div className="col">
                                            <p className="border border-2 border-primary mx-auto bg-primary-subtle rounded-pill py-3">
                                                Released: {movieDetails.release_date}
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p className="border border-2 border-danger bg-danger-subtle rounded-pill py-3">
                                                {hours} hours, {mins} minute(s)
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p className="border border-2 border-success bg-success-subtle rounded-pill py-3">
                                                Rating: {rating}/10
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container text-center d-lg-none px-5 p-sm-0">
                        <div className="row gx-md-5">
                            <div className="col-12 col-sm-6 col-md-4">
                                <p className="border border-2 border-primary mx-auto bg-primary-subtle rounded-pill py-3">
                                    Released: {movieDetails.release_date}
                                </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <p className="border border-2 border-danger bg-danger-subtle rounded-pill py-3">
                                    {hours} hours, {mins} minute(s)
                                </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <p className="border border-2 border-success bg-success-subtle rounded-pill py-3">
                                    Rating: {rating}/10
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }

    return renderMovieDetails()
}

export default MovieView;