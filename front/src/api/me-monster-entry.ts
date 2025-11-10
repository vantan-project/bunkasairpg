import axios from "axios";
import Cookie from "js-cookie";

export type MeMonsterEntryRequest = {
  monsterId: string;
};

export function meMonsterEntry(req: MeMonsterEntryRequest): void {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/monster-entry`;
  const authToken = Cookie.get("authToken");

  axios.post(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
