import axios from "axios";
import Cookie from "js-cookie";

export type MeUseItemRequest = {
  itemId: number;
};

export function meUseItem(req: MeUseItemRequest): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/me/use-item`;
  const authToken = Cookie.get("authToken");

  return axios.patch(apiUrl, req, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
