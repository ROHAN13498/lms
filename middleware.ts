import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes:["/api/courses/dedddec0-747c-45fc-b906-151ffec7d45e/chapter/9920e575-9a87-40c2-90f3-c86d7a9eefef"]
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};