import axios from "axios";
import Cookies from "js-cookie";

export type CollectedRankingItem = {
    rank: number;
    name: string;
    image_url: string | null;
    collection_rate: number;
  };
export type UserCollectedRankingResponse = {
    userRanking: CollectedRankingItem;
    rankings: CollectedRankingItem[];
};

export function userCollectedRanking(): Promise<UserCollectedRankingResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/collected-ranking`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<UserCollectedRankingResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
}
