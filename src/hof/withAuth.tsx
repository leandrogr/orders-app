import { getPayload, isTokenExpired } from "../services/auth";
import { parseCookies } from "../services/cookies";

export function withAuth(func: any) {
  return async (ctx: any) => {
    const cookies = parseCookies(ctx.req);

    if (!cookies.token || isTokenExpired(cookies.token)) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    const payload = getPayload(cookies.token);

    const result = await func(ctx, cookies, payload);
    if ("props" in result) {
      result.props = {
        payload,
        ...result.props,
      };
    }

    return result;
  };
}