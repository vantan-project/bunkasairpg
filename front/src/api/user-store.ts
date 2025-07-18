import axios from "axios";
import Cookies from "js-cookie";

export type UserStoreRequest = {
  name: string;
};

export type UserStoreResponse = {
  success: boolean;
  messages: string[];
};

export default function uesrStore(
  req: UserStoreRequest
): Promise<UserStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
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
