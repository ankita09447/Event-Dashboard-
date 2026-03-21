import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                    const userRole = docSnap.data().role;
                    if (userRole === "organizer") {
                        const q = query(collection(db, "events"),
                            where("organizerId", "==", user.uid));
                        const querySnapshot = await getDocs(q);

                        const eventList = await Promise.all(
                            querySnapshot.docs.map(async (eventDoc) => {
                                const regQuery = query(
                                    collection(db, "registrations"),
                                    where("eventId", "==", eventDoc.id)
                                );
                                const regSnapshot = await getDocs(regQuery);
                                return {
                                    id: eventDoc.id,
                                    ...eventDoc.data(),
                                    registrationCount: regSnapshot.size
                                };
                            })
                        );
                        setEvents(eventList);
                    } else {
                        navigate("/events");
                    }
                }
            } else {
                navigate("/");
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            await deleteDoc(doc(db, "events", eventId));
            setEvents(events.filter(e => e.id !== eventId));
        }
    };

    return (
        <div style={styles.page}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.logo}> Event Dashboard</h2>
                <div style={styles.navRight}>
                    <span style={styles.navName}>👤 {userData?.name}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Welcome Banner */}
            <div style={styles.banner}>
                <div>
                    <h2 style={styles.bannerTitle}>Welcome back, {userData?.name}! </h2>
                    <p style={styles.bannerSub}>Manage your events from your dashboard</p>
                </div>
                <button style={styles.createBtn}
                    onClick={() => navigate("/create-event")}>
                    + Create New Event
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {/* Stats Row */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <h1 style={styles.statNumber}>{events.length}</h1>
                        <p style={styles.statLabel}>Total Events</p>
                    </div>
                    <div style={styles.statCard}>
                        <h1 style={styles.statNumber}>
                            {events.reduce((a, e) => a + (e.registrationCount || 0), 0)}
                        </h1>
                        <p style={styles.statLabel}>Total Seats</p>
                    </div>
                    <div style={styles.statCard}>
                        <h1 style={styles.statNumber}>
                            {events.reduce((a, e) => a + ((e.totalSeats - e.seatsLeft) || 0), 0)}
                        </h1>
                        <p style={styles.statLabel}>Registrations</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={styles.divider}>
                    <span style={styles.dividerText}>Your Events</span>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <h3 style={{ color: "#999" }}>No events yet!</h3>
                        <p style={{ color: "#bbb" }}>Click "Create New Event" to add your first event</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {events.map((event, index) => (
                            <div key={event.id} style={styles.card}>
                                {/* Card Header */}
                                <div style={{
                                    ...styles.cardHeader,
                                    background: index % 3 === 0 ? "#760d87" :
                                        index % 3 === 1 ? "#0891b2" : "#059669"
                                }}>
                                    <h3 style={styles.cardTitle}>{event.title}</h3>
                                    <span style={styles.seatsBadge}>{event.seatsLeft} seats left</span>
                                </div>
                                {/* Card Body */}
                                <div style={styles.cardBody}>
                                    <p style={styles.cardInfo}> <b>Date:</b> {event.date}</p>
                                    <p style={styles.cardInfo}> <b>Location:</b> {event.location}</p>
                                    <p style={styles.cardInfo}> <b>Total Seats:</b> {event.totalSeats}</p>
                                    <p style={styles.cardInfo}> <b>Registrations:</b> {event.registrationCount || 0}</p>
                                    <p style={styles.cardDesc}>{event.description}</p>
                                    {/* Progress Bar */}
                                    <div style={styles.progressBg}>
                                        <div style={{
                                            ...styles.progressFill,
                                            width: `${((event.totalSeats - event.seatsLeft) / event.totalSeats) * 100}%`
                                        }} />
                                    </div>
                                    <p style={styles.progressText}>
                                        {event.totalSeats - event.seatsLeft} / {event.totalSeats} registered
                                    </p>
                                </div>
                                {/* Card Footer */}
                                <div style={styles.cardFooter}>
                                    <button style={styles.deleteBtn}
                                        onClick={() => handleDelete(event.id)}>
                                         Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Layout & Page ───────────────────────────────────────────
const styles = {
    page: {
        minHeight: "100vh",
        background: "#f1f5f9",
    },

    // ─── Navbar ───────────────────────────────────────────────
    navbar: {
        background: "#0d88cf",
        padding: "16px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },
    logo: {
        color: "white",
        margin: 0,
        fontSize: "20px",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    navName: {
        color: "white",
        fontSize: "14px",
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

    // ─── Hero Banner ──────────────────────────────────────────
    banner: {
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        padding: "30px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
    createBtn: {
        padding: "12px 24px",
        background: "white",
        color: "#6964c7",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        whiteSpace: "nowrap",
    },

    // ─── Main Content Area ────────────────────────────────────
    content: {
        padding: "30px 40px",
    },

    // ─── Stats Row ────────────────────────────────────────────
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "30px",
    },
    statCard: {
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    statNumber: {
        color: "#e42172",
        margin: "0 0 8px 0",
        fontSize: "36px",
    },
    statLabel: {
        color: "#888",
        margin: 0,
        fontSize: "14px",
    },

    // ─── Section Divider ──────────────────────────────────────
    divider: {
        display: "flex",
        alignItems: "center",
        margin: "10px 0 24px",
    },
    dividerText: {
        background: "#4f46e5",
        color: "white",
        padding: "6px 20px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "bold",
    },

    // ─── Empty State ──────────────────────────────────────────
    emptyBox: {
        background: "white",
        padding: "60px",
        textAlign: "center",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    // ─── Card Grid ────────────────────────────────────────────
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
        transition: "transform 0.2s",
    },
    cardHeader: {
        padding: "20px",
        color: "white",
    },
    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "18px",
    },
    seatsBadge: {
        background: "rgba(254, 38, 38, 0.25)",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
    },

    // Card Body
    cardBody: {
        padding: "20px",
    },
    cardInfo: {
        color: "#555",
        margin: "6px 0",
        fontSize: "14px",
    },
    cardDesc: {
        color: "#888",
        fontSize: "13px",
        margin: "10px 0",
        fontStyle: "italic",
    },

    // Progress Bar
    progressBg: {
        background: "#e2e8f0",
        borderRadius: "10px",
        height: "8px",
        margin: "12px 0 4px",
    },
    progressFill: {
        background: "#0d88cf",
        height: "8px",
        borderRadius: "10px",
        transition: "width 0.3s",
    },
    progressText: {
        color: "#888",
        fontSize: "12px",
        margin: 0,
    },

    // Card Footer
    cardFooter: {
        padding: "12px 20px",
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "flex-end",
    },
    deleteBtn: {
        padding: "8px 16px",
        background: "#fef2f2",
        color: "#ef4444",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
    },
};