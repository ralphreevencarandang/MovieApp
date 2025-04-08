import {hero} from '../assets/images'
import Search from './Search';

export default function Header() {
  return (
    <header>
        <img src={hero} alt="Hero Image" />
        <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without
            the Hassle
        </h1>
    </header>
  );
}
