import { useAuth } from ".../src/context/AuthContext";
import {useRouter} from "next/router";
import { useEffect } from "react";

export default function HomePage() {
  const {user, supabase } = useAuth();
  const router = useRouter();
  
  useEffect(()=> {
    if (user === null) {
      router.push("/auth");
    }
  }, [user, router]);

  if (user === undefined) {
    return <p className="p-10">Loading...</p>;
  }

async function handleLogout() {
  await supabase.auth.signOut();
}

return (
  <div className="p-10">
    <h1>Welcome, {user.email} </h1>
    <button
      onClick={handleLogout}
      className="bg-blue-500 text-white px-4 mt-4 rounded"
    >
      Logout 
    </button>
  </div>
);}