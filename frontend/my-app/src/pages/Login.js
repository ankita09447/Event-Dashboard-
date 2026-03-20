import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Login</h2>
                <input style={styles.input} placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input style={styles.input} type="password" placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />
                <button style={styles.button} onClick={handleLogin}>Login</button>
                <button style={styles.googleButton} onClick={handleGoogleLogin}>
                    Sign in with Google
                </button>
                <p style={{ textAlign: "center" }}>
                    Don't have an account? <a href="/signup">Signup</a>
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
        borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px",
        boxSizing: "border-box"
    },
    button: {
        width: "100%", padding: "10px", background: "#4CAF50",
        color: "white", border: "none", borderRadius: "5px",
        fontSize: "16px", cursor: "pointer"
    },
    googleButton: {
        width: "100%", padding: "10px",
        background: "white", color: "#333", border: "1px solid #ddd",
        borderRadius: "5px", fontSize: "16px", cursor: "pointer",
        marginTop: "10px"
    }
};