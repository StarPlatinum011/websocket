
import { AuthenticatedWS } from "./types/types.js";

export const usersMap = new Map<string, AuthenticatedWS>();
export const sessionsMap = new Map<string, AuthenticatedWS>();

export const rooms = new Map<string, Set<AuthenticatedWS>>(); //Who is in room X
export const socketToRooms = new Map<AuthenticatedWS, Set<string>>(); //Which room this socket in

