import axios from "axios";
import Cookie from "js-cookie";

export type MeUpdateRequest = {
  name?: string;
  imageFile?: File | null;
  level?: number;
  maxHitPoint?: number;
  hitPoint?: number;
  experiencePoint?: number;
  weaponId?: number;
};

export type MeUpdateResponse = {
  success: boolean;
  messages: string[];
};

export function meUpdate(req: MeUpdateRequest): Promise<MeUpdateResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me`;
  const authToken = Cookie.get("authToken");

  return axios
    .patch<MeUpdateResponse>(apiUrl, req, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);

      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
