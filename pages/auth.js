import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup"); // start with signup
  const [message, setMessage] = useState("");

  async function handleAuth(e) {
    e.preventDefault();

    // This block lines 18 - 34 checks if the user is signing in or signing up. It uses supabase's authentication function to log in with email and password (same for signing up) if it doesn't log in, it'll send an error message made by supabase
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Thank you for signing up! Check your email for confirmation.");
        if (data.user) {
          await supabase.from("profiles").insert({ id: data.user.id });
        }
     }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Login successful!");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <h1>{mode === "signup" ? "Sign Up" : "Login"}</h1>
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{mode === "signup" ? "Sign Up" : "Login"}</button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          )}
        </p>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
}
