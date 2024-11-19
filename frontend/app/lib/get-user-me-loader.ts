// import axios from "axios";
// import { getAuthToken } from "./get-token";

// export async function getUserMeLoader() {

//     const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";
//     const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

//   const authToken = await getAuthToken();
//   if (!authToken) return { ok: false, data: null, error: null };

//   try {   
//     const response = await axios.get(
//         `${backendUrl}/api/users/me`,
//         {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//               },
//         }
//       );

//     const data = await response.data;
//     if (data.error) return { ok: false, data: null, error: data.error };
//     return { ok: true, data: data, error: null };
//   } catch (error) {
//     console.log(error);
//     return { ok: false, data: null, error: error };
//   }
// }