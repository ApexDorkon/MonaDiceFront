// lib/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// USERS
export const apiCreateUser = (wallet_address: string, email?: string) =>
  api.post("/users/", { wallet_address, email });

export const apiGetUsers = () => api.get("/users/");
export const apiGetUser = (id: string) => api.get(`/users/${id}`);

// CAMPAIGNS
export const apiGetCampaigns = () => api.get("/campaigns/");
export const apiGetCampaign = (id: string) => api.get(`/campaigns/${id}`);
export const apiCreateCampaign = (data: any) => api.post("/campaigns/", data);

// TICKETS
export const apiCreateTicket = (data: any) => api.post("/tickets/", data);
export const apiGetTicket = (id: string) => api.get(`/tickets/${id}`);

// (optional) You can add a backend endpoint:
// GET /tickets/by-user?wallet=0x..&campaign_id=UUID  -> returns user's tickets for that campaign
