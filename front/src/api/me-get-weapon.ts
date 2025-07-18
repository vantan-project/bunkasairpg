import axios from "axios";
import Cookie from "js-cookie";

type meGetWeaponRequest = {
  weaponId: number;
};

export function meGetWeapon(req: meGetWeaponRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/get-weapon`;
  const authToken = Cookie.get("authToken");

  return axios.post(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
