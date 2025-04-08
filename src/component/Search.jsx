import {search} from '../assets/images'

export default function Search ({searchTerm, setSearchTerm }){
    return(
        <div className="search">
            <div>
                <img src={search} alt="search" />
                <input type="text"  placeholder='Search through thousands of movies' 
                value={searchTerm} onChange={event => setSearchTerm(event.target.value)}/>
            </div>
         
        </div>
    );
}