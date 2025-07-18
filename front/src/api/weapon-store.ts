import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";

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
  const authToken = localStorage.getItem("authToken");

  return axios
    .post<WeaponStoreResponse>(apiUrl, req, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
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
