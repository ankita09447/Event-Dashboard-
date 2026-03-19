import React,{useEffect,useState} from "react";
import {db} from "../Firebase";
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc
} from "firebase/firestore";
export default function Dashboard(){
    const[event,setEvent]=useState([]);
    useEffect(() => {
        const unsub=onSnapshot(collection(db,"event"),(snapshot)=>{
            const data=snapshot.docs.map(doc=>({
                 id:doc.id,
                 ...doc.data()
            }));
           setEvents(data);
        });
        return()=>unsub();
    },[]);
    const handleDelete=async(id)=>{
        await delete(doc(db,"event",id));
    };
    return (
        <div>
            <h2>Dashboard</h2>
            {events.map(event=>(
                <div key={event.id} style={{border:"1px solid",margin:"10px"}}>
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                    <p>Registered:{event.registered}</p>
                    <button onClick={() => handleDelete(event.id)}>delete</button>

                </div>
            ))}
            
        </div>
    );
}
