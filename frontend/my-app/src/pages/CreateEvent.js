import React,{useState} from "react";
import {db} from "../Firebase";
import {collection,addDoc} from "firebase/firestore";

export default function CreateEvent(){
    const[title,setTitle]=useSate("");
    const[date,setDate]=useSate("");
    const[location,setLocation]=useSate("");
    const[seats,setSeat]=useState("");
    const[desc,setdesc] =Usesate("");

    const handleSubmit=async()=>{
        try{
            await addDoc(collection(db,"event"),{
                title,
                date,
                location,
                seats:Number(seats),
                description:desc,
                registered:0,
            });
            alert("Event Created!");
        }catch(err){
            alert(err.message);
        }
    };
    return(
        <div>
            <h2>Create Event</h2>
            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
            <input type="date" onChange={(e)=> setDate(e.target.value)} />
            <input placeholder="location" onChange={(e)=> setDate(e.target.value)} />
            <input placeholder="seats" onChange={(e) =>setLocation(e.target.value)}/>
            <textarea placeholder="Description"
            onChange={(e) => setdesc(e.target.value)}/>
            <button onClick={handleSubmit}>Create</button>
        </div>
    );
}