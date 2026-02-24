export type AuthToken = string & { readonly _brand: "AuthToken" };
export type RoomId =  string & { readonly _brand: "RoomId" };
export type UserId = string & { readonly _brand: "UserId" };