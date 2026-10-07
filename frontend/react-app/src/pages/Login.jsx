import React, { useState, useEffect } from "react";
import "../LoginStyle.css";
import NavBar from "../utils/NavBar";
import Illust from "../utils/Illust";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Authentication() {
    const [show, setShow] = useState(false);
    const [username, SetUsername] = useState();
    const [password, SetPassword] = useState();

    const [error, SetError] = useState();
    const [messages, SetMessages] = useState();

    const { HandleLogin } = React.useContext(AuthContext)

    useEffect(() => {
        const timer = setTimeout(() => {
            SetError();
            SetMessages();
        }, 4000)
        return () => clearTimeout(timer);
    }, [error, messages])

    const submit = async () => {
        try {
            // event.preventDefault()
            let result = await HandleLogin(username, password);
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
                            <p className="eyebrow">WELCOME BACK</p>
                            <h1>Let's get<br />you connected.</h1>
                            <p className="subtext">Sign in to continue to your meetings, conversations, and team.</p>
                            <form method="POST" onSubmit={(event) => {
                                event.preventDefault();
                                submit()
                            }}>
                                <label htmlFor="username">Username  &nbsp;&nbsp;&nbsp;
                                    <span className="message-container">
                                        {messages && <p style={{ "color": "green", "display": "inline" }}>{messages}</p>}
                                        {error && <p style={{ "color": "red", "display": "inline" }}>{error}</p>}
                                    </span></label>
                                <input id="username" type="text" placeholder="ayankar" name="username"
                                    onChange={
                                        (e) => SetUsername(e.target.value)
                                    } required />
                                <div className="pass-label">
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="pass-wrap">
                                    <input id="password" type={show ? "text" : "password"}
                                        placeholder="Enter your password" required name="password" onChange={
                                            (e) => SetPassword(e.target.value)
                                        } />
                                    <button type="button" className="show" onClick={() => setShow(!show)}>{show ? "HIDE" : "SHOW"}</button>

                                </div>
                                <label className="remember"><input type="checkbox" /> <span>Remember me</span></label>
                                <button className="login-btn" type="submit">SIGN IN</button>
                            </form>
                            <p className="signup">Don't have an account? <Link to={'/register'}>Create One</Link></p>
                        </div>
                    </div>
                    <div className="visual-panel"><Illust /></div>
                </section></main>
        </>
    )

}