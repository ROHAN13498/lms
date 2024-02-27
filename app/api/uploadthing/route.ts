import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export  for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  });