import axios from "axios";
import Cookies from "js-cookie";

export type MonsterStoreRequest = {
  name: string;
  imageFile: File | null;
  attack: number;
  hitPoint: number;
  experiencePoint: number;
  slash: number;
  blow: number;
  shoot: number;
  neutral: number;
  flame: number;
  water: number;
  ice: number;
  thunder: number;

  weaponId: number | null;
  itemId: number | null;
};

export type MonsterStoreResponse = {
  success: boolean;
  messages: string[];
};

export function monsterStore(
  req: MonsterStoreRequest
): Promise<MonsterStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/monster`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<MonsterStoreResponse>(apiUrl, req, {
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
