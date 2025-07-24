import axios from "axios";
import Cookie from "js-cookie";

export type MeGetWeaponRequest = {
  weaponId: number;
};

export function meGetWeapon(req: MeGetWeaponRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/get-weapon`;
  const authToken = Cookie.get("authToken");

  return axios.post(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
