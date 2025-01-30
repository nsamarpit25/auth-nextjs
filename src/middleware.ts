import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
   const path = request.nextUrl.pathname;

   // check if the path is public
   const isPublicPath = ["/login", "/signup"].includes(path);

   // get the token from the cookie
   const token = request.cookies.get("token")?.value || "";

   // redirect the user to home page if path is not public and toeken is present
   if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
   }

   // redirect the user to login page if path is not public and token is not present
   if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
   }
}

// match the paths
export const config = {
   matcher: ["/", "/profile", "/login", "/signup"],
};
