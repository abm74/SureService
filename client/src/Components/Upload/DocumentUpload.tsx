import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { getUploadSignature, uploadDirectToCloudinary } from "../../services/uploadService";
import { getErrorMessage } from "../../utils/helpers";

interface DocumentUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  maxSizeMB?: number;
  label?: string;
  description?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSizeMB = 10,
  label = "Verification Document",
  description = "Upload Kebele ID, National ID (Fayda), or Trade License (JPG, PNG, WEBP, or PDF up to 10MB).",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewImgLoading, setIsPreviewImgLoading] = useState(true);
  const [previewInfo, setPreviewInfo] = useState<{
    name: string;
    size: string;
    isPdf: boolean;
    localPreviewUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setIsPreviewImgLoading(true);
    }
  }, [value]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage("");

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please upload a valid image (JPG, PNG, WEBP) or PDF document.");
        return;
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setErrorMessage(`File size exceeds the ${maxSizeMB}MB limit (${formatFileSize(file.size)}).`);
        return;
      }

      const isPdf = file.type === "application/pdf";
      let localUrl = "";
      if (!isPdf) {
        localUrl = URL.createObjectURL(file);
      }

      setPreviewInfo({
        name: file.name,
        size: formatFileSize(file.size),
        isPdf,
        localPreviewUrl: localUrl,
      });

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const signData = await getUploadSignature();
        const result = await uploadDirectToCloudinary(file, signData, (progress) => {
          setUploadProgress(progress);
        });

        onChange(result.url);
        setUploadProgress(100);
      } catch (err: unknown) {
        const msg = getErrorMessage(
          err,
          "Failed to upload document to cloud storage. Please check your connection or credentials."
        );
        setErrorMessage(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleClear = () => {
    if (previewInfo?.localPreviewUrl) {
      URL.revokeObjectURL(previewInfo.localPreviewUrl);
    }
    setPreviewInfo(null);
    setErrorMessage("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  const isPdfDocument = (url: string) => {
    return url.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes("/raw/upload/");
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 min-w-0 w-full">
      <div>
        <label className="text-[11px] sm:text-xs font-bold text-ink block">{label}</label>
        {description && (
          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-snug">{description}</p>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 sm:p-3 text-[11px] sm:text-xs text-destructive">
          <AlertCircle className="size-3.5 sm:size-4 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-destructive/70 hover:text-destructive cursor-pointer shrink-0"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* When a document URL exists and is not currently uploading a new one */}
      {value && !isUploading && (
        <div className="rounded-xl sm:rounded-2xl border border-hairline bg-surface-soft p-3 sm:p-4 space-y-2.5 sm:space-y-3 min-w-0 overflow-hidden">
          {/* Header Info and Actions Row */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 sm:size-9 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                {isPdfDocument(value) ? (
                  <FileText className="size-4 text-primary" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[11px] sm:text-xs font-bold text-ink truncate max-w-full">
                    {previewInfo?.name || "Uploaded Document"}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 text-[9.5px] sm:text-[10px] font-semibold shrink-0">
                    <CheckCircle2 className="size-2.5" />
                    Uploaded
                  </span>
                </div>
                {previewInfo?.size && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {previewInfo.size}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-hairline/60">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-background px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-surface-soft shadow-2xs cursor-pointer"
              >
                <ExternalLink className="size-3 text-primary shrink-0" />
                <span>View</span>
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="rounded-lg text-[11px] h-7 px-2.5 cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className="size-2.5 shrink-0" />
                <span>Replace</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled || isUploading}
                className="rounded-lg text-[11px] h-7 px-2 text-destructive hover:bg-destructive/10 cursor-pointer disabled:opacity-50 ml-auto"
                title="Remove document"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Visual Image Preview if it's an image */}
          {!isPdfDocument(value) && (
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-hairline bg-background min-h-24 max-h-40 sm:max-h-48 flex items-center justify-center group">
              {isPreviewImgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-soft/80 text-muted-foreground animate-pulse z-5">
                  <Loader2 className="size-4 text-primary animate-spin" />
                  <span className="text-[9.5px] font-medium">Loading preview...</span>
                </div>
              )}
              <img
                src={previewInfo?.localPreviewUrl || value}
                alt="Document Preview"
                onLoad={() => setIsPreviewImgLoading(false)}
                onError={() => setIsPreviewImgLoading(false)}
                className={`max-h-36 sm:max-h-44 w-auto object-contain transition-opacity duration-200 ${
                  isPreviewImgLoading ? "opacity-0" : "opacity-100"
                }`}
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-background/90 text-ink px-2.5 py-1 text-[11px] font-semibold shadow-xs flex items-center gap-1 hover:bg-background"
                >
                  <ExternalLink className="size-3" />
                  Full Size
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Dropzone (Visible if no document, or if uploading) */}
      {(!value || isUploading) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative rounded-xl sm:rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.005]"
              : "border-hairline bg-surface-soft/60 hover:bg-surface-soft hover:border-primary/40"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileInputChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-2.5 py-1 sm:py-2">
              <div className="flex items-center justify-center">
                <div className="size-9 sm:size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="size-4 sm:size-5 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-ink">
                  Uploading document...
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                  {previewInfo?.name || "Processing file"} ({uploadProgress}%)
                </p>
              </div>
              <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-1.5 overflow-hidden border border-hairline">
                <div
                  className="bg-primary h-full transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-1 sm:py-2">
              <div className="mx-auto size-9 sm:size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <UploadCloud className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-ink">
                  <span className="text-primary hover:underline font-extrabold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                  JPG, PNG, WEBP, PDF (Max {maxSizeMB}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual URL override option (collapsible fallback) */}
      <details className="text-[10.5px] sm:text-[11px] text-muted-foreground pt-0.5">
        <summary className="cursor-pointer hover:text-ink font-medium select-none">
          Or specify a direct document URL
        </summary>
        <div className="mt-1.5 space-y-1">
          <Input
            type="text"
            placeholder="https://res.cloudinary.com/... or https://example.com/id.pdf"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isUploading}
            className="h-8 sm:h-9 text-xs rounded-xl"
          />
        </div>
      </details>
    </div>
  );
};

export default DocumentUpload;
