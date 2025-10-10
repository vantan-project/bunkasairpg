import axios from "axios";
import Cookies from "js-cookie";

export type AdminTokenResponse = {
  success: boolean;
};

export function adminToken(): Promise<AdminTokenResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin-token`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<AdminTokenResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return {
        success: false,
      };
    });
}
