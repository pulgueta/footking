import { seed } from "drizzle-seed";

import { dbNoSchema } from "./config";
import * as schema from "./schema";

async function main() {
  console.log("Database seed started");
  await seed(dbNoSchema, schema).refine((f) => ({
    user: {
      count: 20,
      columns: {
        phoneNumber: f.phoneNumber({ template: "############" }),
      },
      with: {
        fields: 10,
      },
    },
    field: {
      count: 5,
      columns: {
        availability: f.json({
          arraySize: 7,
        }),
      },
    },
  }));
}

main();
