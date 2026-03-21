import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", result.user.uid), {
                name, email, role, createdAt: new Date()
            });
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Sign Up</h2>
                <input style={styles.input} placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)} />
                <input style={styles.input} type="email" placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input style={styles.input} type="password" placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />
                <select style={styles.input}
                    onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="organizer">Organizer</option>
                </select>
                <button style={styles.button} onClick={handleSignup}>
                    Sign Up
                </button>
                <p style={{ textAlign: "center", marginTop: "15px" }}>
                    Already have an account? <a href="/">Login</a>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex", justifyContent: "center",
        alignItems: "center", height: "100vh", background: "#f0f2f5"
    },
    box: {
        background: "white", padding: "40px", borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "350px"
    },
    title: { textAlign: "center", marginBottom: "20px" },
    input: {
        width: "100%", padding: "10px", marginBottom: "15px",
        borderRadius: "5px", border: "1px solid #982525", fontSize: "14px",
        boxSizing: "border-box"
    },
    button: {
        width: "100%", padding: "10px", background: "#46e590",
        color: "white", border: "none", borderRadius: "5px",
        fontSize: "16px", cursor: "pointer"
    }
};