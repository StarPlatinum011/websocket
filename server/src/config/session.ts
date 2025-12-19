import session from "express-session";

const sessionSecret = process.env.SESSION_SECRET;
if(!sessionSecret) throw new Error("SESSION_SECRET environment variable not set.")

export const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //change to true in prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, //24 hours 
    }

})