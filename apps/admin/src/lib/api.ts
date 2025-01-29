import { hcWithType } from "api/hc";

import type { SoccerField } from "@/types";

const publicEndpoints = [] as const;

function isPublicEndpoint(url: string | URL | Request) {
  const urlString = url instanceof Request ? url.url : url.toString();
  const parsedUrl = new URL(urlString);
  const path = parsedUrl.pathname;

  const normalizedPath = path.replace(new URL(process.env.API_URL ?? "").pathname, "");

  return publicEndpoints.some((ept) => normalizedPath === ept);
}

function createFetch(baseFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    try {
      if (isPublicEndpoint(input)) {
        return await baseFetch(input, init);
      }

      const token = localStorage.getItem("token");
      const headers = new Headers(init?.headers ?? {});

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return await baseFetch(input, { ...init, headers });
    } catch (error) {
      throw error;
    }
  };
}

export const { api } = hcWithType(process.env.PUBLIC_API_URL ?? "", {
  fetch: createFetch(fetch),
});

const fields: SoccerField[] = [
  {
    id: "1",
    name: "Sunny Valley Soccer Field",
    address: "123 Main St",
    state: "CA",
    availability: {
      Monday: { isAvailable: true, hours: "9:00 AM - 8:00 PM" },
      Tuesday: { isAvailable: true, hours: "9:00 AM - 8:00 PM" },
      Wednesday: { isAvailable: true, hours: "9:00 AM - 8:00 PM" },
      Thursday: { isAvailable: true, hours: "9:00 AM - 8:00 PM" },
      Friday: { isAvailable: true, hours: "9:00 AM - 10:00 PM" },
      Saturday: { isAvailable: true, hours: "8:00 AM - 10:00 PM" },
      Sunday: { isAvailable: true, hours: "8:00 AM - 8:00 PM" },
    },
  },
  {
    id: "2",
    name: "Downtown Soccer Complex",
    address: "456 Oak Avenue",
    state: "NY",
    availability: {
      Monday: { isAvailable: true, hours: "10:00 AM - 9:00 PM" },
      Tuesday: { isAvailable: true, hours: "10:00 AM - 9:00 PM" },
      Wednesday: { isAvailable: true, hours: "10:00 AM - 9:00 PM" },
      Thursday: { isAvailable: true, hours: "10:00 AM - 9:00 PM" },
      Friday: { isAvailable: true, hours: "10:00 AM - 11:00 PM" },
      Saturday: { isAvailable: true, hours: "9:00 AM - 11:00 PM" },
      Sunday: { isAvailable: true, hours: "9:00 AM - 9:00 PM" },
    },
  },
  {
    id: "3",
    name: "Riverside Soccer Grounds",
    address: "789 River Road",
    state: "TX",
    availability: {
      Monday: { isAvailable: true, hours: "8:00 AM - 7:00 PM" },
      Tuesday: { isAvailable: true, hours: "8:00 AM - 7:00 PM" },
      Wednesday: { isAvailable: true, hours: "8:00 AM - 7:00 PM" },
      Thursday: { isAvailable: true, hours: "8:00 AM - 7:00 PM" },
      Friday: { isAvailable: true, hours: "8:00 AM - 9:00 PM" },
      Saturday: { isAvailable: true, hours: "7:00 AM - 9:00 PM" },
      Sunday: { isAvailable: true, hours: "7:00 AM - 7:00 PM" },
    },
  },
];

export async function fetchSoccerFields(): Promise<SoccerField[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fields), 500);
  });
}

export async function addSoccerField(field: Omit<SoccerField, "id">): Promise<SoccerField> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newField = { ...field, id: Date.now().toString() };
      fields.push(newField);
      resolve(newField);
    }, 500);
  });
}

export async function updateFieldAvailability({
  fieldId,
  availability,
}: { fieldId: string; availability: SoccerField["availability"] }): Promise<SoccerField> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fieldIndex = fields.findIndex((f) => f.id === fieldId);
      if (fieldIndex === -1) {
        reject(new Error("Field not found"));
      } else {
        fields[fieldIndex] = { ...fields[fieldIndex], availability };
        resolve(fields[fieldIndex]);
      }
    }, 500);
  });
}
