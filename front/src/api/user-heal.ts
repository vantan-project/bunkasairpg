import axios from "axios";
import Cookies from "js-cookie";

export type UserHealResponse = {
  success: false;
  messages: string[];
};

export function userHeal(userId: string): Promise<UserHealResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/heal/${userId}`;
  const authToken = Cookies.get("authToken");

  return axios
    .patch(apiUrl, null, {
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
