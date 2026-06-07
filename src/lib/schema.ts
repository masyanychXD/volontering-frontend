import * as z from "zod";

export const facultySchema = z.object({
    name: z.string().min(2, 'Имя должно быть как минимум из 2 символов'),
    emails: z.string().email('Неверный email адрес'),
    role: z.enum(["admin", "assistant", "student"], {
        required_error: "Пожалуйста выберите роль",
    }),
    direction: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
})

export const subjectSchema = z.object({
    name: z.string().min(3, "Название мероприятия должно быть не менее 3 символов"),
    code: z.string().min(5, "Код должен быть не менее 5 символов"),
    description: z
        .string()
        .min(5, "Описание мероприятия должно быть не менее 5 символов"),
    direction: z
        .string()
        .min(2, "Направление мероприятия должно быть не менее 2 симполов"),
});

const scheduleSchema = z.object({
    day: z.string().min(1, "День обязателен"),
    startTime: z.string().min(1, "Время начала обязательно"),
    endTime: z.string().min(1, "Время окончания обязательно"),
});

export const sessionSchema = z.object({
    title: z
        .string()
        .min(2, "Название сессии должно быть не менее 2 символов")
        .max(50, "Название сессии должно быть не более 50 символов"),
    description: z
        .string({ required_error: "Описание обязательно" })
        .min(5, "Описание должно быть не менее 5 символов"),
    eventId: z.coerce
        .number({
            required_error: "Мероприятие обязательно",
            invalid_type_error: "Мероприятие обязательно",
        })
        .min(1, "Мероприятие обязательно"),
    coordinatorId: z.string().min(1, "Координатор обязателен"),
    capacity: z.coerce
        .number({
            required_error: "Количество мест обязательно",
            invalid_type_error: "Количество мест обязательно",
        })
        .min(1, "Количество мест должно быть не менее 1"),
    status: z.enum(["Открыто", "Закрыто"], {
        required_error: "Пожалуйста выберите статус сессии",
    }),
    bannerUrl: z
        .string({ required_error: "Баннер сессии обязателен" })
        .min(1, "Баннер сессии обязателен"),
    bannerCldPubId: z
        .string({ required_error: "ID баннера обязателен" })
        .min(1, "ID баннера обязателен"),
    schedules: z.array(scheduleSchema).optional(),
});

export const enrollmentSchema = z.object({
    classId: z.coerce
        .number({
            required_error: "Class ID is required",
            invalid_type_error: "Class ID is required",
        })
        .min(1, "Class ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
});

export const registrationSchema = z.object({
    sessionId: z.coerce
        .number({
            required_error: "ID сессии обязателен",
            invalid_type_error: "ID сессии обязателен",
        })
        .min(1, "ID сессии обязателен"),
    studentId: z.string().min(1, "ID волонтера обязателен"),
});