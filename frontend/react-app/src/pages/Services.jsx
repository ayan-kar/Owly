import "../App.css"
import NavBar from "../utils/NavBar"
import { Link } from "react-router-dom"
export default function Services(){
    return (
        <>
        <NavBar />
        <section className="info" id="about">
        <p className="eyebrow">BUILT FOR PEOPLE</p>
        <h2>Everything you need to meet remotely.</h2>
        <div className="features" id="services">
          <article>
            <strong>01</strong>
            <h3>HD Video</h3>
            <p>Clear video and audio keep conversations natural and focused.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Screen Sharing</h3>
            <p>Present documents, prototypes, dashboards, or your entire screen.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Simple Messages</h3>
            <p>Start a chatting quickly with an interface that stays out of your way.</p>
          </article>
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">READY WHEN YOU ARE</p>
          <h2>Bring your next meeting online.</h2>
        </div>
        <button >
          <Link to={"/guest-login"}>
          START A MEETING WITH A CLICK
          </Link>
        </button>
      </section>
      </>
    )
}