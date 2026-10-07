
import React from "react";
import { useNavigate } from "react-router-dom"
import httpStatus from "http-status"
import axios from "axios"
import { useState } from "react";


export const AuthContext = React.createContext({})

const client = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})


export const AuthProvider = ({ children }) => {


    const navigate = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })
            if (request.status === httpStatus.CREATED) {
                return request.data.message
            }
        } catch (error) {
            throw error;
        }
    }
    const HandleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            })
            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token)
                // navigate("/home")
            }
        } catch (error) {
            throw error;
        }
    }
    const [userData, setUserData] = useState(AuthContext);
    const data = {
        userData, setUserData, handleRegister, HandleLogin
    }
    return (
        <AuthContext.Provider value={data} >
            {children}
        </AuthContext.Provider>
    )
}