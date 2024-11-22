import { AuthActions } from "@/app/(auth)/utils";

export async function getUserMeLoader() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const { getToken } = AuthActions();
  const url = new URL("/api/auth/users/me", apiUrl);

//   url.search = qs.stringify({
//     populate: {
//       image: {
//         fields: ["url", "alternativeText"],
//       },
//     },
//   });

  const authToken = getToken("access");
  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };
    return { ok: true, data: data, error: null };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null, error: error };
  }
}
