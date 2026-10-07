
import "../App.css"
import NavBar from "../utils/NavBar"
import VideoCard from "../utils/VideoCards"
import { Link } from "react-router-dom";

export default function LandingPage(){
    return (
        <main>
        <NavBar />
      <section className="hero">
        <div className="hero-content" id="home">
          <div className="copy">
            <p className="eyebrow">CONNECT FROM ANYWHERE</p>
            <h1>VIDEO<br />CONFERENCING</h1>
            <p className="description">
              Meet your team, share ideas, and stay connected with smooth,
              reliable video calls designed for modern teams.
            </p>
            <Link to={'/login'}>
            <button>GET STARTED</button>
            </Link>
          </div>

          <div className="visual" aria-label="Video conferencing illustration">
            <div className="blob blob-one" />
            <div className="blob blob-two" />
            <div className="stripe-circle stripe-one" />
            <div className="stripe-circle stripe-two" />

            <div className="connection-dots">
              <i /><i /><i /><i /><i />
              <i /><i /><i /><i /><i />
            </div>

            <VideoCard
              className="card-one"
              person=" Alex"
              role="TEAM CALL"
              color="#bde8e0"
            />
            <VideoCard
              className="card-two"
              person=" Maya"
              role="DESIGN REVIEW"
              color="#f8c967"
            />
            <VideoCard
              className="card-three"
              person=" Sam"
              role="REMOTE MEETING"
              color="#f5d8cb"
            />

            <div className="ground" />
          </div>
        </div>
      </section>

      
    </main>
    )
}