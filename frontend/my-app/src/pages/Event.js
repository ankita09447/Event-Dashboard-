import React, { useEffect, useState } from "react";
import { db, auth } from "../Firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, where, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function Events() {
    const [events, setEvents] = useState([]);
    const [toast, setToast] = useState("");
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        fetchEvents();
        fetchMyRegistrations();
        fetchUserName();
    }, []);
    
    const fetchUserName = async () => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserName(docSnap.data().name);
            }
        }
    };

    const fetchEvents = async () => {
        const snapshot = await getDocs(collection(db, "events"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(list);
    };

    const fetchMyRegistrations = async () => {
        const user = auth.currentUser;
        if (user) {
            const q = query(collection(db, "registrations"),
                where("userId", "==", user.uid));
            const snapshot = await getDocs(q);
            const ids = snapshot.docs.map(d => d.data().eventId);
            setRegisteredEvents(ids);
        }
    };

    const handleRegister = async (event) => {
        const user = auth.currentUser;
        if (!user) { navigate("/"); return; }
        if (event.seatsLeft <= 0) {
            showToast("Sorry! No seats left ");
            return;
        }
        try {
            await addDoc(collection(db, "registrations"), {
                userId: user.uid,
                eventId: event.id,
                eventTitle: event.title,
                registeredAt: new Date()
            });
            await updateDoc(doc(db, "events", event.id), {
                seatsLeft: event.seatsLeft - 1
            });
            setRegisteredEvents([...registeredEvents, event.id]);
            setEvents(events.map(e => e.id === event.id ?
                { ...e, seatsLeft: e.seatsLeft - 1 } : e));
            showToast("Successfully Registered! ");
        } catch (err) {
            showToast("Something went wrong!");
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const colors = ["#760d87", "#0891b2", "#059669", "#d97706", "#dc2626"];

    return (
        <div style={styles.page}>
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    ...styles.toast,
                    background: toast.includes("") ? "#059669" : "#dc2626"
                }}>
                    {toast}
                </div>
            )}

            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.logo}> Event Dashboard</h2>
                <div style={styles.navRight}>
                    <span style={styles.navName}>
                         {auth.currentUser?.displayName || auth.currentUser?.email}
                    </span>
                    <button style={styles.navBtn}
                        onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>
                    <button style={styles.navBtn}
                        onClick={() => navigate("/my-registrations")}>
                        My Registrations
                    </button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Banner */}
            <div style={styles.banner}>
                <h2 style={styles.bannerTitle}>Upcoming Events </h2>
                <p style={styles.bannerSub}>Browse and register for events</p>
            </div>

            {/* Events Grid */}
            <div style={styles.content}>
                {events.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <h3 style={{ color: "#999" }}>No events available yet!</h3>
                        <p style={{ color: "#bbb" }}>Check back later</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {events.map((event, index) => {
                            const isRegistered = registeredEvents.includes(event.id);
                            const isFull = event.seatsLeft <= 0;
                            const fillPercent = ((event.totalSeats - event.seatsLeft)
                                / event.totalSeats) * 100;

                            return (
                                <div key={event.id} style={styles.card}>
                                    {/* Card Top Color Bar */}
                                    <div style={{
                                        ...styles.cardTop,
                                        background: colors[index % colors.length]
                                    }}>
                                        <h3 style={styles.cardTitle}>{event.title}</h3>
                                        <span style={styles.badge}>
                                            {isFull ? "FULL" : `${event.seatsLeft} seats left`}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div style={styles.cardBody}>
                                        <p style={styles.info}> {event.date}</p>
                                        <p style={styles.info}> {event.location}</p>
                                        <p style={styles.desc}>{event.description}</p>

                                        {/* Progress Bar */}
                                        <div style={styles.progressBg}>
                                            <div style={{
                                                ...styles.progressFill,
                                                width: `${fillPercent}%`,
                                                background: colors[index % colors.length]
                                            }} />
                                        </div>
                                        <p style={styles.progressText}>
                                            {event.totalSeats - event.seatsLeft} / {event.totalSeats} registered
                                        </p>

                                        {/* Register Button */}
                                        <button
                                            style={{
                                                ...styles.registerBtn,
                                                background: isRegistered ? "#e2e8f0" :
                                                    isFull ? "#fee2e2" :
                                                        colors[index % colors.length],
                                                color: isRegistered || isFull ? "#888" : "white",
                                                cursor: isRegistered || isFull ? "not-allowed" : "pointer"
                                            }}
                                            onClick={() => !isRegistered && !isFull &&
                                                handleRegister(event)}
                                            disabled={isRegistered || isFull}>
                                            {isRegistered ? " Already Registered" :
                                                isFull ? " Fully Booked" : "Register Now"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {

    // ─── Layout & Page ───────────────────────────────────────
    page: {
        minHeight: "100vh",
        background: "#f1f5f9",
    },

    content: {
        padding: "30px 40px",
    },

    // ─── Toast Notification ──────────────────────────────────
    toast: {
        position: "fixed",
        top: "20px",
        right: "20px",
        color: "white",
        padding: "14px 24px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },

    // ─── Navbar ──────────────────────────────────────────────
    navbar: {
        background: "#4f46e5",
        padding: "16px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        color: "white",
        margin: 0,
    },
    navRight: {
        display: "flex",
        gap: "12px",
    },
    navName: {
        color: "white",
        fontSize: "14px",
    },
    navBtn: {
        padding: "8px 16px",
        background: "rgba(255,255,255,0.2)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "6px",
        cursor: "pointer",
    },
    logoutBtn: {
        padding: "8px 16px",
        background: "white",
        color: "#4f46e5",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    // ─── Hero Banner ─────────────────────────────────────────
    banner: {
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        padding: "30px 40px",
    },
    bannerTitle: {
        color: "white",
        margin: "0 0 8px 0",
        fontSize: "24px",
    },
    bannerSub: {
        color: "rgba(255,255,255,0.8)",
        margin: 0,
    },

    // ─── Empty State ─────────────────────────────────────────
    emptyBox: {
        background: "white",
        padding: "60px",
        textAlign: "center",
        borderRadius: "12px",
    },

    // ─── Card Grid ───────────────────────────────────────────
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
    },
    card: {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    },

    // Card Top
    cardTop: {
        padding: "20px",
    },
    cardTitle: {
        color: "white",
        margin: "0 0 8px 0",
        fontSize: "18px",
    },
    badge: {
        background: "#e42172",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
    },

    // Card Body
    cardBody: {
        padding: "20px",
    },
    info: {
        color: "#555",
        margin: "6px 0",
        fontSize: "14px",
    },
    desc: {
        color: "#888",
        fontSize: "13px",
        fontStyle: "italic",
        margin: "10px 0",
    },

    // Progress Bar
    progressBg: {
        background: "#e2e8f0",
        borderRadius: "10px",
        height: "8px",
        margin: "12px 0 4px",
    },
    progressFill: {
        height: "8px",
        borderRadius: "10px",
    },
    progressText: {
        color: "#888",
        fontSize: "12px",
        margin: "0 0 12px",
    },

    // Register Button
    registerBtn: {
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
    },

};