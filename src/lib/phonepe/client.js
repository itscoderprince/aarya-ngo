import {
    StandardCheckoutClient,
    Env
} from "pg-sdk-node";

export const phonepeClient = StandardCheckoutClient.getInstance(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    parseInt(process.env.CLIENT_VERSION || "1"),
    process.env.NODE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX
);