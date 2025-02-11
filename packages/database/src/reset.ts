import { reset } from "drizzle-seed";

import { dbNoSchema } from ".";
import * as schema from "./schema";

async function main() {
  console.log("Database reset started");
  await reset(dbNoSchema, schema);
}

main();
