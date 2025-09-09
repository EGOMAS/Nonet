import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(req){
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && req.nextUrl.pathname.startsWith("/profile")){
        const redirectUrl = new URL("/auth", req.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*", "/dashboard/:path*"], 
};