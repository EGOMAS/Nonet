import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function signUp(email, password) {
  const {data, error} = await supabase.auth.signUp({email, password});
  if (error) {
    if (
      error.message.includes("already registered") ||
      error.code==="user_already_exists"
    ) {
      return {error: "exists"};
    }
    return {error: error.message};
  }
  return {data};
}

export async function signIn(email, password) {
  const {data, error} = await supabase.auth.signInWithPassword({email, password});
  if (error) {
    return {data};
  }
}

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup"); // start with signup
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  async function handleAuth(e) {
    e.preventDefault();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (
          error.message.includes("already registered") ||
          error.code === "user_already_exists"
        ) {
          setMessage("Account already exists. Please log in instead.");
          setMode("login");
          return;
        }
        setMessage(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
        if (data.user) {
          await supabase.from("profiles").insert({ id: data.user.id });
          setProfile({ id: data.user.id });
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login successful!");
        if (data.user) {
          const userProfile = await getProfile(data.user.id);
          setProfile(userProfile);
          router.push("/"); // redirect after login
        }
      }
    }
  }

  async function getProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
    return data;
  }

  // Redirect logged-in users away from /auth
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/"); 
      }
    }
    checkUser();
  }, [router]);

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
              Don’t have an account?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          )}
        </p>

        {message && <p style={{ color: "red" }}>{message}</p>}

        {profile && (
          <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
            <h2>Profile</h2>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}