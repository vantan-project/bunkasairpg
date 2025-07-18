import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import axios from "axios";
import Cookies from "js-cookie";

type ItemStoreRequest =
  | {
      name: string;
      imageFile: File | null;
      effectType: "heal";
      amount: number;
    }
  | {
      name: string;
      imageFile: File | null;
      effectType: "buff";
      rate: number;
      target: PhysicsType | ElementType;
    }
  | {
      name: string;
      imageFile: File | null;
      effectType: "debuff";
      rate: number;
      target: PhysicsType | ElementType;
    };

type ItemStoreResponse = {
  success: boolean;
  messages: string[];
};

export function itemStore(req: ItemStoreRequest): Promise<ItemStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/item`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<ItemStoreResponse>(apiUrl, req, {
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
