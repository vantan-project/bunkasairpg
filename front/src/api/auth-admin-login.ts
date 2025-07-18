import axios from "axios";

export type AuthAdminLoginRequset = {
  email: string;
  password: string;
};

export type AuthAdminLoginResponse = {
  success: boolean;
  messages: string[];
  authToken: string;
};

export function authAdminLogin(
  req: AuthAdminLoginRequset
): Promise<AuthAdminLoginResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`;

  return axios
    .post(apiUrl, req)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);

      return {
        success: false,
        messages: err.response?.data.messages || [],
        authToken: "",
      };
    });
}
