import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Login from "../pages/Login";
import WorkoutList from "./WorkoutList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((r) => {
      if (r.ok) {
        r.json().then((data) => setUser(data.user));
      }
    });
  }, []);

  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  }

  if (!user) return <Login onLogin={onLogin} />;

  return (
    <>
      <NavBar setUser={setUser} />
      <main>
        <p>You are logged in!</p>
        <WorkoutList />
      </main>
    </>
  );
}

export default App;
