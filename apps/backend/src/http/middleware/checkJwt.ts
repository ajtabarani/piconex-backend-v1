import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: "https://accessify-backend",
  issuerBaseURL: "https://dev-jo3m60rh6auevpev.us.auth0.com/",
});
