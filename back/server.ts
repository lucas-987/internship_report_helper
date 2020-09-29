import { Application } from "https://deno.land/x/oak/mod.ts";
import { router } from './routes.ts';
import { db } from './dbconnection.ts';

await db.sync();

const host = "127.0.0.1";
const port = ":8080";
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen(host + port);