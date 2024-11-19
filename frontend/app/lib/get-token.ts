import { cookies } from "next/headers";


export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt_access")?.value;
  return authToken;
}