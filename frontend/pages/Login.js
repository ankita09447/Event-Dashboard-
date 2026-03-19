import React,{useState} from "react";
import {signInwithEmailAndPassword} from "Firebase/auth";
import {auth} from "../Firebase";
import {useNavigate} from "react-router-dom";
export default function login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const handlelogin=async()=>{
        try{
            await signInwithEmailAndPassword(auth,email,password);
            navigate("/dashboard");
        }
        catch(err){
            alert(err.message);
        }

    };
    return (
        <div>
            <h2>Login</h2>
            <input placholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
            <input type="password" placeholder="Password"
                onChange={(e)=> setPassword(e.target.value)}/>
                <button onclick={handleLogin}>Login</button>
        </div>
    );
}