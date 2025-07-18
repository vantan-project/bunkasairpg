import axios from "axios";
import Cookie from "js-cookie";

export type meUseItemRequest = {
  itemId: number;
};

export function meUseItem(req: meUseItemRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/use-item`;
  const authToken = Cookie.get("authToken");

  return axios.post(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
