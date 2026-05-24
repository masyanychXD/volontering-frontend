import {Event} from "@/types";

export const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        code: "EV001",
        name: "Герценовкская неделя добра",
        direction: "Событийное",
        description: "Неделя волонтерства в университете РГПУ им. А. И. Герцена",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        code: "ER202",
        name: "Геронтологический Форум",
        direction: "Событийное",
        description: "Всероссийский геронтологический форум РГПУ им. А. И. Герцена",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        code: "EX303",
        name: "Герценовский субботник",
        direction: "Событийное",
        description: "субботник организованный ДоброЦентром РГПУ им. А. И. Герцена",
        createdAt: new Date().toISOString(),
    },
];