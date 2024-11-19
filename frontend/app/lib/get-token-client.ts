
import Cookies from 'js-cookie';

export function getAuthTokenClient() {
  const authToken = Cookies.get("jwt_access");
  return authToken;
}