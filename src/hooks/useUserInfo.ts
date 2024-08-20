import { jwtDecode } from "jwt-decode";

interface UserInfo {
  id: string;
  role: string;
}

interface UserTokenInfo {
  userInfo: UserInfo | null;
  userToken: string | null;
}

export const useUserInfo = (): UserTokenInfo => {
    const userToken = localStorage.getItem('token');
    let userInfo: UserInfo | null = null;
    
    if (userToken) {
        userInfo = jwtDecode<UserInfo>(userToken);
    }
    
    return { userInfo, userToken };
}
