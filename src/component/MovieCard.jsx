
import {noMovie, star} from '../assets/images'
// Destruction the properties inside the movie it self
export default function MovieCard ({movie:{title,vote_average, poster_path, release_date, original_language}}){
    return(
        <>
            <div className="movie-card">
                {/* if nag e-exist ang poster path sa isang movie then irerender niya to else No Movie Poster ang irerender niyt */}
                <img src={poster_path ? `https:/image.tmdb.org/t/p/w500/${poster_path}` : noMovie} alt={title} />
              
                <div className='mt-4'>
                    <h3>{title}</h3>
                    <div className='content'>
                        <div className='rating'>
                            <img src={star} alt="Star Icon" />
                            {/* Confitional Rendering */}
                            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                            <span>⦁</span>
                            <p className='lang'>{original_language}</p>
                            <span>⦁</span>
                            <p className='year'>
                                {/* S-split niya yung date and s-store sa array and then kukunin lang yung zero index which is yung YEAR */}
                                {release_date ? release_date.split('-')[0] :'N/A'}
                            </p>

                          
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}