import React, { useEffect, useState } from "react";
import { db, auth } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        const user = auth.currentUser;
        if (!user) { navigate("/"); return; }
        try {
            const q = query(collection(db, "registrations"),
                where("userId", "==", user.uid));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data()
            }));
            setRegistrations(list);

            const userDoc = await getDocs(query(
                collection(db, "users"),
                where("email", "==", user.email)
            ));
            if (!userDoc.empty) {
                setUserName(userDoc.docs[0].data().name);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const colors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626"];

    return (
        <div style={styles.page}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.logo}>🎯 Event Dashboard</h2>
                <div style={styles.navRight}>
                    <span style={styles.navName}>👤 {userName}</span>
                    <button style={styles.navBtn}
                        onClick={() => navigate("/events")}>
                        Browse Events
                    </button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Banner */}
            <div style={styles.banner}>
                <h2 style={styles.bannerTitle}>My Registrations 🎟️</h2>
                <p style={styles.bannerSub}>Events you have registered for</p>
            </div>

            {/* Content */}
            <div style={styles.content}>
                {loading ? (
                    <p style={styles.loading}>Loading your registrations...</p>
                ) : registrations.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <h3 style={{ color: "#999" }}>No registrations yet!</h3>
                        <p style={{ color: "#bbb" }}>Browse events and register for some!</p>
                        <button style={styles.browseBtn}
                            onClick={() => navigate("/events")}>
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={styles.count}>
                            You have registered for <b>{registrations.length}</b> event(s)
                        </p>
                        <div style={styles.grid}>
                            {registrations.map((reg, index) => (
                                <div key={reg.id} style={styles.card}>
                                    <div style={{
                                        ...styles.cardTop,
                                        background: colors[index % colors.length]
                                    }}>
                                        <h3 style={styles.cardTitle}>{reg.eventTitle}</h3>
                                        <span style={styles.badge}>✅ Registered</span>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <p style={styles.info}>
                                            📅 Registered on: {" "}
                                            {reg.registeredAt?.toDate ?
                                                reg.registeredAt.toDate().toLocaleDateString() :
                                                "N/A"}
                                        </p>
                                        <p style={styles.info}>🎫 Event ID: {reg.eventId}</p>
                                        <div style={styles.confirmedBox}>
                                            <span style={styles.confirmedText}>
                                                🎉 Your spot is confirmed!
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: "100vh", background: "#f1f5f9" },
    navbar: {
        background: "#4f46e5", padding: "16px 30px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center"
    },
    logo: { color: "white", margin: 0 },
    navRight: { display: "flex", gap: "12px", alignItems: "center" },
    navName: { color: "white", fontSize: "14px" },
    navBtn: {
        padding: "8px 16px",
        background: "rgba(255,255,255,0.2)", color: "white",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "6px", cursor: "pointer"
    },
    logoutBtn: {
        padding: "8px 16px", background: "white",
        color: "#4f46e5", border: "none", borderRadius: "6px",
        cursor: "pointer", fontWeight: "bold"
    },
    banner: {
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        padding: "30px 40px"
    },
    bannerTitle: { color: "white", margin: "0 0 8px 0", fontSize: "24px" },
    bannerSub: { color: "rgba(255,255,255,0.8)", margin: 0 },
    content: { padding: "30px 40px" },
    loading: { textAlign: "center", color: "#888", fontSize: "18px" },
    count: { color: "#555", marginBottom: "20px", fontSize: "15px" },
    emptyBox: {
        background: "white", padding: "60px",
        textAlign: "center", borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    browseBtn: {
        marginTop: "16px", padding: "12px 30px",
        background: "#4f46e5", color: "white", border: "none",
        borderRadius: "8px", fontSize: "15px", cursor: "pointer"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px"
    },
    card: {
        background: "white", borderRadius: "12px",
        overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
    },
    cardTop: { padding: "20px" },
    cardTitle: { color: "white", margin: "0 0 8px 0", fontSize: "18px" },
    badge: {
        background: "rgba(255,255,255,0.25)", color: "white",
        padding: "4px 10px", borderRadius: "20px", fontSize: "12px"
    },
    cardBody: { padding: "20px" },
    info: { color: "#555", margin: "8px 0", fontSize: "14px" },
    confirmedBox: {
        background: "#f0fdf4", padding: "12px",
        borderRadius: "8px", marginTop: "12px",
        border: "1px solid #bbf7d0"
    },
    confirmedText: { color: "#059669", fontWeight: "bold", fontSize: "14px" }
};