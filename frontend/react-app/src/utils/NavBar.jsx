import '../App.css'
import { Link } from 'react-router-dom';
export default function NavBar (){
    return (
    
    <nav className="navbar">
          <a className="brand" href="#">
            <span className="brand-mark">
                <img src="/owly.ico" alt="noImg" className="owlyico"/>
            </span>
            <span>OWLY</span>
          </a>

          <div className="nav-links">
            <Link to="/guest-login">Guest Login</Link>
            <Link to="/home">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>   
    );
}