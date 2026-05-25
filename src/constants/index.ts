export const DIRECTIONS = [
    'Патриотическое',
    'Событийное',
    'Экологическое',
    'Социальное'
] as const;

export const DIRECTIONS_OPTIONS = DIRECTIONS.map((direction) => ({
    value: direction,
    label: direction,
}))

import { GraduationCap, School } from "lucide-react";

export const USER_ROLES = {
    STUDENT: "student",
    ASSISTANT: "assistant",
    ADMIN: "admin",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.STUDENT,
        label: "Student",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.ASSISTANT,
        label: "Assistant",
        icon: School,
    },
];

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

//export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
//export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL =  import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

//export const CLOUDINARY_UPLOAD_PRESET = getEnvVar("VITE_CLOUDINARY_UPLOAD_PRESET");

export const Assistant = [
    {
        id: "1",
        name: "Юлия Пябус",
    },
    {
        id: "2",
        name: "Елизавета Козлова",
    },
    {
        id: "3",
        name: "Артем Федоров",
    },
];

export const events = [
    {
        id: 1,
        name: "Cобытийное",
        code: "СОБ",
    },
    {
        id: 2,
        name: "Патриотическое",
        code: "ПАТ",
    },
    {
        id: 3,
        name: "Экологическое",
        code: "ЭКО",
    },
    {
        id: 4,
        name: "Социальное",
        code: "СОЦ",
    },
];