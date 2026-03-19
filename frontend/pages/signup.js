import React,{useState} from "react";
import {createUserWithEmailAndPassword} from "Firebase/auth";
import {auth} from "../Firebase";

export default function Signup() {
    const[email , setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleSignup=async()=>{
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            alert("User Created !");
        }catch (err){
            alert(err.message);
        }
    };
    return(
        <div>
            <h2>Signup</h2>
            <input placeholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
                <input type="password" placeholder="Password"
                onChange={(e)=> setPassword(e.target.value)}/>
                <button onlick={handleSignup}>Signup</button>
            
        </div>
    )
}
