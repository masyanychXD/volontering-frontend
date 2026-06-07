import {useEffect, useRef, useState} from 'react'
import {UploadWidgetValue} from "@/types";
import {UploadCloud, X, Loader2} from "lucide-react";
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET} from "@/constants";

interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (file: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null)
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if(!value) setDeleteToken(null);
    }, [value])

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange])

    useEffect(() => {
        if(typeof window === "undefined") return;

        const initializeWidget = () => {
            if(!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder: 'uploads',
                maxFileSize: 5000000,
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            }, (error, result) => {
                if(!error && result.event === 'success') {
                    const payload: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                    }
                    setPreview(payload);
                    setDeleteToken(result.info.delete_token ?? null);
                    onChangeRef.current?.(payload);
                }
            });
            return true;
        }
        if(initializeWidget()) return;
        const intervalId = window.setInterval(() => {
            if(initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500)
        return () => window.clearInterval(intervalId);
    }, []);

    const openWidget = () => {
        if(!disabled) widgetRef.current?.open();
    }

    const removeFromCloudinary = async () => {
        if (!preview?.publicId) return;

        setIsRemoving(true);
        try {
            // Если есть deleteToken, используем его для удаления
            if (deleteToken) {
                const formData = new FormData();
                formData.append('public_id', preview.publicId);
                formData.append('token', deleteToken);

                await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`, {
                    method: 'POST',
                    body: formData,
                });
            }

            // Очищаем состояние
            setPreview(null);
            setDeleteToken(null);
            onChangeRef.current?.(null);
        } catch (error) {
            console.error('Error removing image:', error);
        } finally {
            setIsRemoving(false);
        }
    }

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="upload-preview">
                    <img src={preview.url} alt="Uploaded file" />
                    <button
                        type="button"
                        onClick={removeFromCloudinary}
                        disabled={isRemoving || disabled}
                        className="remove-image-btn"
                        aria-label="Удалить изображение"
                    >
                        {isRemoving ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                    </button>
                </div>
            ): (
                <div
                    className="upload-dropzone"
                    role="button"
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >
                    <div className="upload-prompt">
                        <UploadCloud className="icon" />
                        <div>
                            <p>Нажмите, чтобы загрузить фото</p>
                            <p>PNG, JPEG до 5MB</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default UploadWidget
