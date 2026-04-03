export type Lead = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const getLeads = async (): Promise<Lead[]> => {
  const res = await fetch(`${BASE_URL}/leads`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch leads: ${res.status}`);
  }

  return res.json();
};

export const createLead = async (data: {
  name: string;
  email: string;
  status?: string;
}): Promise<Lead> => {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Email already exists");
    }
    if (res.status === 400) {
      throw new Error("Invalid input");
    }

    throw new Error(`Failed to create lead: ${res.status}`);
  }

  return res.json();
};