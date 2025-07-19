import axios from "axios";

export type AuthUesrLoginRequest = {
  id: string;
};

export type AuthUserLoginResponse = {
  authToken: string;
};

export function authUserLogin(
  req: AuthUesrLoginRequest
): Promise<AuthUserLoginResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/user-login`;

  return axios.post<AuthUserLoginResponse>(apiUrl, req).then((res) => {
    return res.data;
  });
}
