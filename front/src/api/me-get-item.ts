import axios from "axios";
import Cookie from "js-cookie";

type meGetItemRequest = {
  itemId: number;
};

export function meGetItem(req: meGetItemRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/get-item`;
  const authToken = Cookie.get("authToken");

  return axios.post(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
