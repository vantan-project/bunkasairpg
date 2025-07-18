import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookies from "js-cookie";

type WeaponStoreRequest = {
  name: string;
  imageFile: File | null;
  physicsAttack: number;
  elementAttack: number;
  physicsType: PhysicsType;
  elementType: ElementType;
};

type WeaponStoreResponse = {
  success: boolean;
  messages: string[];
};

export function weaponStore(
  req: WeaponStoreRequest
): Promise<WeaponStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/weapon`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<WeaponStoreResponse>(apiUrl, req, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);

      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
