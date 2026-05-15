"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        const userData = Array.isArray(data) ? data : data;
        setUser(userData);
      });
  }, []);

  const sidebarLinks = [
    { name: "🏢 Inicio", href: "/dashboard" },
    { name: "🏢 Compañías", href: "/dashboard/companies" },
    { name: "📊 V-Values", href: "/dashboard/vvalues" },
    { name: "🚢 V-Sales", href: "/dashboard/vsales" },
    { name: "📋 Order Book", href: "/dashboard/ob" },
    { name: "📉 Shorts", href: "/dashboard/shorts" },
    { name: "⚙️ Mi Perfil", href: "/dashboard/profile" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      <nav style={navStyle}>
        <h2
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
            color: "#1a73e8",
            fontWeight: "bold",
          }}
        >
          🚢 Shipping SaaS
        </h2>

        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          {sidebarLinks.map((link) => (
            <li key={link.href} style={{ marginBottom: "5px" }}>
              <Link href={link.href} style={linkStyle}>
                {link.name}
              </Link>
            </li>
          ))}

          <li style={{ marginTop: "30px" }}>
            <Link
              href="/dashboard/support"
              style={{
                textDecoration: "none",
                color: "#1a73e8",
                fontWeight: "bold",
                border: "1px solid #1a73e8",
                textAlign: "center",
                display: "block",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              💬 Ayuda y Soporte
            </Link>
          </li>
        </ul>

        {/* SECCIÓN DE USUARIO SIMPLIFICADA (SIN PAÍS) */}
        <div
          style={{
            borderTop: "1px solid #eee",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={avatarStyle}>
            {user?.image ? (
              <img
                src={user.image}
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>

          <div
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}
          >
            {user?.name}
          </div>

          <LogoutButton />
        </div>
      </nav>

      <main style={{ flex: 1, padding: "40px", marginLeft: "260px" }}>
        {children}
      </main>
    </div>
  );
}

const navStyle = {
  width: "260px",
  background: "#fff",
  borderRight: "1px solid #e0e0e0",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  height: "100vh",
};
const linkStyle = {
  textDecoration: "none",
  color: "#3c4043",
  fontSize: "15px",
  display: "block",
  padding: "10px",
  borderRadius: "8px",
};
const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#1a73e8",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
