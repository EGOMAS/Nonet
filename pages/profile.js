"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function ProfilePage() {
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("");
    
    async function updateProfile(e) {
        e.preventDefault();
        const { data, error} = await supabase
            .from("profiles")
            .upsert({ username, bio, id: (await supabase.auth.getUser()).data.user.id })
            if (error) console.error(error);
            else console.log("Profile updated:", data);

        }
    return( 
        <div className="p-6 max-w-md mx-auto">
            <h1 classname="text-2x1 font-bold mb-4"> Edit Profile</h1>
            <form onSubmit={updateProfile} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block font-medium mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <div>
                    <label htmlFor="bio" className="block font-medium mb-1">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                </button>
            </form>
        </div>
    )    
    
    }