import React, { useState, useEffect } from "react";

/**
 * Simple demo hotel booking App component
 * File: src/App.js
 */

const sampleRooms = [
    { id: 1, name: "Deluxe Twin", price: 120, beds: 2 },
    { id: 2, name: "Superior Double", price: 150, beds: 1 },
    { id: 3, name: "Suite", price: 250, beds: 3 },
];

export default function App() {
    const [rooms] = useState(sampleRooms);
    const [cart, setCart] = useState([]);
    const [guestName, setGuestName] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || null);

    useEffect(() => {
        const saved = localStorage.getItem("demo_booking_cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("demo_booking_cart", JSON.stringify(cart));
    }, [cart]);

    function addBooking() {
        const room = rooms.find((r) => r.id === Number(selectedRoomId));
        if (!guestName.trim() || !room) return;
        const booking = {
            id: Date.now(),
            guest: guestName.trim(),
            roomId: room.id,
            roomName: room.name,
            price: room.price,
            date: new Date().toLocaleString(),
        };
        setCart((c) => [booking, ...c]);
        setGuestName("");
    }

    function removeBooking(id) {
        setCart((c) => c.filter((b) => b.id !== id));
    }

    const total = cart.reduce((sum, b) => sum + b.price, 0);

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <header>
                <h1>Demo Booking Hotel</h1>
                <p>Chọn phòng và đặt ngay — demo nhỏ bằng React.</p>
            </header>

            <section style={{ display: "flex", gap: 24 }}>
                <div style={{ flex: 1 }}>
                    <h2>Phòng khả dụng</h2>
                    <ul style={{ paddingLeft: 0 }}>
                        {rooms.map((r) => (
                            <li key={r.id} style={{ listStyle: "none", marginBottom: 12, border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
                                <strong>{r.name}</strong>
                                <div>Giá: ${r.price} • Beds: {r.beds}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ width: 320 }}>
                    <h2>Đặt phòng</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label>
                            Tên khách:
                            <input value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                        </label>

                        <label>
                            Chọn phòng:
                            <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                                {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} — ${r.price}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button onClick={addBooking} style={{ padding: "10px 12px", marginTop: 8 }}>
                            Đặt ngay
                        </button>
                    </div>

                    <h3 style={{ marginTop: 20 }}>Đơn đặt (tại chỗ)</h3>
                    {cart.length === 0 ? (
                        <div>Chưa có đặt phòng</div>
                    ) : (
                        <ul style={{ paddingLeft: 0 }}>
                            {cart.map((b) => (
                                <li key={b.id} style={{ listStyle: "none", marginBottom: 10, border: "1px solid #f1f1f1", padding: 8, borderRadius: 6 }}>
                                    <div style={{ fontWeight: 600 }}>{b.roomName}</div>
                                    <div style={{ fontSize: 13 }}>{b.guest} — ${b.price} — <span style={{ color: "#666" }}>{b.date}</span></div>
                                    <button onClick={() => removeBooking(b.id)} style={{ marginTop: 8, padding: "6px 8px" }}>
                                        Hủy
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div style={{ marginTop: 12, fontWeight: 700 }}>Tổng: ${total}</div>
                </div>
            </section>
        </div>
    );
}