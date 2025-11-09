import axios from "axios";
import Cookies from "js-cookie";

export type MeClearBossRequest = {
  clearTime: string;
};

export type MeClearBossResponse = {
  success: boolean;
  messages: string[];
};

export function meClearBoss(
  req: MeClearBossRequest
): Promise<MeClearBossResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/clear-boss`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(apiUrl, req, {
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
