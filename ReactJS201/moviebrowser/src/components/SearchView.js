import Hero from './Hero.js';
import { Link, useParams } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import Poster from './Poster.js'

const MovieCard = ({ movie }) => {
    // const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    const detailUrl = `/movies/${movie.id}`;

    return (
        <div className="col-lg-3 col-md-3 col-2 my-5">
            <div className="card">
                <Poster url={/*posterUrl*/"./pic.png" } className="card-img-top" altText={movie.original_title} />
                <div className="card-body">
                    <h5 className="card-title">{movie.original_title}</h5>
                    <Link to={detailUrl} className="btn btn-primary">View details</Link>
                </div>
            </div>
        </div>
    )
}

const SearchView = ({ searchResults }) => {
    const { searchQuery } = useParams()
    const title = `You are searching for ${searchQuery}`

    // const queryText = `Results for: ${searchQuery}`;
    const resultsHtml = searchResults.map((obj, i) => {
        return (<MovieCard key={i} movie={obj}/>)
    })


    return (
        <>
            <Hero text={title}/>
            <div className="container">
                <div className="row">
                    {resultsHtml}
                </div>
            </div>
        </>
    );
}

export default SearchView;