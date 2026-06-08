import { createAuthClient } from "better-auth/react";
import { USER_ROLES } from "../constants";

export const authClient = createAuthClient({
    baseURL: `${window.location.origin}/api/auth`,
    session: {
        storage: "localStorage",
    },
    user: {
        additionalFields: {
            role: {
                type: USER_ROLES,
                required: true,
                defaultValue: "student",
                input: true,
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
});