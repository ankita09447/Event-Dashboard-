import React, { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

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
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to your account</p>

                <label style={styles.label}>Email</label>
                <input
                    style={styles.input}
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label style={styles.label}>Password</label>
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button style={styles.button} onClick={handleLogin}>
                    Login
                </button>

                <div style={styles.divider}>
                    <span style={styles.dividerLine}></span>
                    <span style={styles.dividerText}>OR</span>
                    <span style={styles.dividerLine}></span>
                </div>

                <button style={styles.googleButton} onClick={handleGoogleLogin}>
                     Sign in with Google
                </button>

                <p style={styles.signupText}>
                    Don't have an account? <a href="/signup" style={styles.link}>Sign up</a>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#eef2f7"
    },
    box: {
        background: "white",
        padding: "50px 45px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        width: "450px"
    },
    title: {
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "700",
        color: "#222",
        marginBottom: "6px"
    },
    subtitle: {
        textAlign: "center",
        color: "#888",
        fontSize: "15px",
        marginBottom: "30px"
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#444",
        marginBottom: "6px"
    },
    input: {
        width: "100%",
        padding: "13px 15px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "15px",
        boxSizing: "border-box",
        outline: "none"
    },
    button: {
        width: "100%",
        padding: "13px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "5px"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        margin: "20px 0"
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        background: "#ddd"
    },
    dividerText: {
        margin: "0 12px",
        color: "#aaa",
        fontSize: "13px"
    },
    googleButton: {
        background: "#46a0e5",
        width: "100%",
        padding: "13px",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer"
    },
    signupText: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
        fontSize: "14px"
    },
    link: {
        color: "#4CAF50",
        fontWeight: "600",
        textDecoration: "none"
    }
};