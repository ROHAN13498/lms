import { createNextRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export  for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  });