import { GraduationCap, Heart, School } from "lucide-react";

export const DIRECTIONS = [
    'Патриотическое',
    'Событийное',
    'Экологическое',
    'Социальное'
] as const;

export const DIRECTIONS_OPTIONS = DIRECTIONS.map((direction) => ({
    value: direction,
    label: direction,
}));

export const USER_ROLES = {
    STUDENT: "student",
    COORDINATOR: "coordinator",
    ADMIN: "admin",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.STUDENT,
        label: "Волонтер",
        icon: Heart,
    },
    {
        value: USER_ROLES.COORDINATOR,
        label: "Координатор",
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

export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const BACKEND_BASE_URL = "/api";