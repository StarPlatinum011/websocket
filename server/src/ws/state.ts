
import { AuthenticatedWS } from "./types/types.js";

export const usersMap = new Map<string, AuthenticatedWS>();
export const sessionsMap = new Map<string, AuthenticatedWS>();