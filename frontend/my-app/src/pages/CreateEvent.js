import React, { useState } from "react";
import { db, auth } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [seats, setSeats] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            await addDoc(collection(db, "events"), {
                title, date, location,
                totalSeats: Number(seats),
                seatsLeft: Number(seats),
                description,
                organizerId: auth.currentUser.uid,
                createdAt: new Date()
            });
            alert("Event created successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Event Dashboard</h2>
                <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
                    Back
                </button>
            </div>
            <div style={styles.content}>
                <div style={styles.box}>
                    <h2 style={styles.title}>Create New Event</h2>
                    <input style={styles.input} placeholder="Event Title"
                        onChange={(e) => setTitle(e.target.value)} />
                    <input style={styles.input} type="date"
                        onChange={(e) => setDate(e.target.value)} />
                    <input style={styles.input} placeholder="Location"
                        onChange={(e) => setLocation(e.target.value)} />
                    <input style={styles.input} type="number" placeholder="Total Seats"
                        onChange={(e) => setSeats(e.target.value)} />
                    <textarea style={styles.textarea} placeholder="Event Description"
                        onChange={(e) => setDescription(e.target.value)} />
                    <button style={styles.button} onClick={handleCreate}>
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", background: "#f0f2f5" },
    navbar: {
        background: "#4f46e5", padding: "16px 30px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center"
    },
    logo: { color: "white", margin: 0 },
    backBtn: {
        padding: "8px 16px", background: "white",
        color: "#4f46e5", border: "none", borderRadius: "5px",
        cursor: "pointer", fontWeight: "bold"
    },
    content: { display: "flex", justifyContent: "center", padding: "40px" },
    box: {
        background: "white", padding: "40px", borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "400px"
    },
    title: { textAlign: "center", marginBottom: "20px" },
    input: {
        width: "100%", padding: "10px", marginBottom: "15px",
        borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px",
        boxSizing: "border-box"
    },
    textarea: {
        width: "100%", padding: "10px", marginBottom: "15px",
        borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px",
        boxSizing: "border-box", height: "100px"
    },
    button: {
        width: "100%", padding: "10px", background: "#4f46e5",
        color: "white", border: "none", borderRadius: "5px",
        fontSize: "16px", cursor: "pointer"
    }
};