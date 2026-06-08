import * as z from "zod";

export const facultySchema = z.object({
    name: z.string().min(2, 'Имя должно быть как минимум из 2 символов'),
    email: z.string().email('Неверный email адрес'),
    role: z.enum(["admin", "coordinator", "student"], {
        required_error: "Пожалуйста выберите роль",
    }),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

export const eventSchema = z.object({
    name: z.string().min(3, "Название мероприятия должно быть не менее 3 символов"),
    code: z.string().min(3, "Код должен быть не менее 3 символов"),
    description: z
        .string()
        .min(5, "Описание мероприятия должно быть не менее 5 символов"),
    directionId: z.coerce
        .number({
            required_error: "Направление обязательно",
            invalid_type_error: "Направление обязательно",
        })
        .min(1, "Направление обязательно"),
});

const scheduleSchema = z.object({
    day: z.string().min(1, "День обязателен"),
    startTime: z.string().min(1, "Время начала обязательно"),
    endTime: z.string().min(1, "Время окончания обязательно"),
});

export const sessionSchema = z.object({
    name: z
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
    sessionId: z.coerce
        .number({
            required_error: "ID сессии обязателен",
            invalid_type_error: "ID сессии обязателен",
        })
        .min(1, "ID сессии обязателен"),
    volunteerId: z.string().min(1, "ID волонтера обязателен"),
});