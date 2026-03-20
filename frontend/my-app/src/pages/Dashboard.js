import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                navigate("/");
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Event Dashboard</h2>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div style={styles.content}>
                {userData ? (
                    <>
                        <h2>Welcome, {userData.name}! 👋</h2>
                        <p style={styles.role}>You are logged in as: <b>{userData.role}</b></p>
                        {userData.role === "organizer" ? (
                            <button style={styles.actionBtn}
                                onClick={() => navigate("/create-event")}>
                                + Create New Event
                            </button>
                        ) : (
                            <button style={styles.actionBtn}
                                onClick={() => navigate("/events")}>
                                Browse Events
                            </button>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
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
    logoutBtn: {
        padding: "8px 16px", background: "white",
        color: "#4f46e5", border: "none", borderRadius: "5px",
        cursor: "pointer", fontWeight: "bold"
    },
    content: { padding: "40px", textAlign: "center" },
    role: { color: "#666", marginBottom: "20px" },
    actionBtn: {
        padding: "12px 30px", background: "#4f46e5",
        color: "white", border: "none", borderRadius: "8px",
        fontSize: "16px", cursor: "pointer"
    }
};