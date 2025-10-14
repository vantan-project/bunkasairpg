import axios from "axios";
import Cookie from "js-cookie";

export type MeChangeWeaponRequest = {
  weaponId: number;
};

export function meChangeWeapon(req: MeChangeWeaponRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/change-weapon`;
  const authToken = Cookie.get("authToken");

  return axios.patch(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
