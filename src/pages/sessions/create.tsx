import {CreateView} from "@/components/refine-ui/views/create-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useBack} from "@refinedev/core";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import {sessionSchema} from "@/lib/schema.ts";
import * as z  from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Loader2} from "lucide-react";
import UploadWidget from "@/components/upload-widget.tsx";

const Create = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(sessionSchema),
        refineCoreProps: {
            resource: 'sessions',
            action: 'create',
        }
    });

    const {
        handleSubmit,
        formState: {isSubmitting, errors},
        control,
    } = form;

    const onSubmit = (values: z.infer<typeof sessionSchema>)=> {
        try {
            console.log(values);
        } catch (e) {
            console.log('error creating new session',e);
        }
    }

    const Assistants = [
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

    const directions = [
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

    const bannerPublicId = form.watch('bannerCldPubId');

    return (
        <CreateView className='class-view'>
            <Breadcrumb />

            <h1 className="page-title">Создать Событие</h1>

            <div className="intro-row">
                <p>Укажите необходимую информацию ниже, чтобы создать волонтерскую сессию.</p>
                <Button onClick={back}>Назад</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Заполните данную форму</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}
                                  className="space-y-5">
                                <FormField
                                    control={control}
                                    name="bannerUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Картинка <span className="text-orange-600">*</span></FormLabel>
                                            <FormControl>
                                                <UploadWidget
                                                    value={field.value ? {
                                                        url: field.value,
                                                        publicId: bannerPublicId ?? ''
                                                    } : null}
                                                    onChange={(file) => {
                                                        if (file) {
                                                            field.onChange(file.url);
                                                            form.setValue('bannerCldPubId', file.publicId, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        } else {
                                                            field.onChange('');
                                                            form.setValue('bannerCldPubId', '', {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className="text-destructive">{errors.bannerCldPubId.message?.toString()}</p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Название Мероприятия <span className="text-orange-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Мероприятие в РГПУ им. А. И. Герцена"
                                                       {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="eventId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Направление <span className="text-orange-600">*</span></FormLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field?.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выбирите Направление"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {directions.map(
                                                            (direction) => (
                                                                <SelectItem value={direction.id.toString()} key={direction.id}>
                                                                    {direction.name} ({direction.code})
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="coordinatorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Координатор <span className="text-orange-600">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выбирите Координатора"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Assistants.map(
                                                            (assistant) => (
                                                                <SelectItem value={assistant.id.toString()} key={assistant.id}>
                                                                    {assistant.name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Количество Мест</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="10"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Статус <span className="text-orange-600">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выбирите Статус"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Открыто">Открыта</SelectItem>

                                                        <SelectItem value="Закрыто">Закрыта</SelectItem>

                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Описание</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Краткое описание мероприятия"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>Создание Сессии...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Создать Сессию"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

        </CreateView>
    )
}
export default Create