"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {users.map((u, i) => (
        <p key={i}>{u.username} - {u.role}</p>
      ))}
    </div>
  );
}