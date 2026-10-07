import { useState, useContext, useEffect } from "react";
import "../LoginStyle.css";
import NavBar from "../utils/NavBar";
import Illust from "../utils/Illust";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Authentication() {
    const [show, setShow] = useState(false);

    const [username, SetUsername] = useState();
    const [password, SetPassword] = useState();
    const [name, SetName] = useState();
    const [error, SetError] = useState();
    const [messages, SetMessages] = useState();

    const { handleRegister } = useContext(AuthContext)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            SetMessages()
            SetError()
        }, 4000)
        return () => clearTimeout(timer);
    }, [messages, error])

    const submit = async () => {
        try {

            let result = await handleRegister(name, username, password);
            console.log(result)
            SetMessages(result);
        }
        catch (error) {
            const errorMsg = error.response?.data?.message || error.message
            SetError(errorMsg)
        }
    }


    return (
        <>
            < NavBar />
            <main className="page">

                <section className="shell">
                    <div className="form-panel">
                        <div className="form-area">
                            <p className="eyebrow">WELCOME ABOARD</p>
                            <h1>Let's get<br />you connected.</h1>
                            <p className="subtext">Sign up  for Create your meetings, conversations.</p>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                submit()
                            }}>
                                <label htmlFor="FullName">Full Name &nbsp;&nbsp;&nbsp;
                                    <span>
                                        {messages && <p style={{ "color": "green", "display": "inline" }}>{messages}</p>}
                                        {error && <p style={{ "color": "red", "display": "inline" }}>{error}</p>}
                                    </span></label>
                                <input id="FullName" type="text" placeholder="Ayan Kar" required name="FullName" onChange={(e) => SetName(e.target.value)} />
                                <label htmlFor="username">Username</label>

                                <input id="username" type="text" placeholder="ayankar" required name="username" onChange={(e) => SetUsername(e.target.value)} />
                                <div className="pass-label">
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="pass-wrap">
                                    <input id="password" type={show ? "text" : "password"} name="password" placeholder="Enter your password" required onChange={(e) => SetPassword(e.target.value)} />
                                    <button type="button" className="show" onClick={() => setShow(!show)}>{show ? "HIDE" : "SHOW"}</button>
                                </div>
                                <label className="remember"><input type="checkbox" /> <span>Remember me</span></label>
                                <button className="login-btn" type="submit">SIGN UP</button>
                            </form>
                            <p className="signup">Already have an account? <Link to={"/auth"}>Sign In</Link></p>
                        </div>
                    </div>
                    <div className="visual-panel"><Illust /></div>
                </section></main>
        </>
    )

}