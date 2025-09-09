"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function ProfilePage() {
    const router = useRouter();
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
            }
        }
        checkUser();
    }, [router]);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.getUser();
            if (!user){
                window.location.href = "/auth";
                return;
            }
            
            const { data, error } = await supabase
                .from("profiles")
                .select("username, bio")
                .eq("id", user.id)
                .single();
            
            if (error && error.code !== "PGRST116") {
                console.error("Error fetching profile:", error);
            } else if (data) {
                setUsername(data.username || "");
                setBio(data.bio || "");
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    async function updateProfile(e) {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username, bio });

        if (error) {
        console.error("Error updating profile:", error);
        } else {
        alert("Profile saved!");
        }
    }

    if (loading) return <p>Loading...</p>;

    return( 
        <div className="p-6 max-w-md mx-auto">
            <h1 classname="text-2x1 font-bold mb-4">Edit Profile</h1>
            <form onSubmit={updateProfile} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block font-medium mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <div>
                    <label htmlFor="bio" className="block font-medium mb-1">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );    
}