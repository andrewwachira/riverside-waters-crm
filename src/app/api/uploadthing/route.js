import { createRouteHandler } from "uploadthing/next";
 
import { allFilesRouter} from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: allFilesRouter,
 
  // Apply an (optional) custom config:
  // config: { ... },
});