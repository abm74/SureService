import React, { useState, useRef, useCallback } from "react";
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
  description = "Upload your Kebele ID, National ID (Fayda), Trade License, or Professional Certificate (JPG, PNG, WEBP, or PDF up to 10MB).",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewInfo, setPreviewInfo] = useState<{
    name: string;
    size: string;
    isPdf: boolean;
    localPreviewUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-ink block">{label}</label>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-destructive/70 hover:text-destructive cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* When a document URL exists and is not currently uploading a new one */}
      {value && !isUploading && (
        <div className="rounded-2xl border border-hairline bg-surface-soft p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                {isPdfDocument(value) ? (
                  <FileText className="size-5 text-primary" />
                ) : (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-ink truncate">
                    {previewInfo?.name || "Uploaded Verification Document"}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                    <CheckCircle2 className="size-3" />
                    Cloud Uploaded
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {previewInfo?.size ? `${previewInfo.size} • ` : ""}
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-soft shadow-xs"
              >
                <ExternalLink className="size-3.5" />
                <span>View</span>
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="rounded-xl text-xs h-8 px-3 cursor-pointer"
              >
                <RefreshCw className="size-3 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                className="rounded-xl text-xs h-8 px-2 text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Visual Image Preview if it's an image */}
          {!isPdfDocument(value) && (
            <div className="relative rounded-xl overflow-hidden border border-hairline bg-background max-h-48 flex items-center justify-center group">
              <img
                src={previewInfo?.localPreviewUrl || value}
                alt="Document Preview"
                className="max-h-48 w-auto object-contain"
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-background/90 text-ink px-3 py-1 text-xs font-semibold shadow-xs flex items-center gap-1 hover:bg-background"
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
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
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
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-center">
                <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="size-6 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-ink">
                  Uploading document to Cloudinary CDN...
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {previewInfo?.name || "Processing asset"} ({uploadProgress}%)
                </p>
              </div>
              <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden border border-hairline">
                <div
                  className="bg-primary h-full transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="mx-auto size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <UploadCloud className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">
                  <span className="text-primary hover:underline font-extrabold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supported formats: JPG, PNG, WEBP, PDF (Max {maxSizeMB}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual URL override option (collapsible fallback) */}
      <details className="text-[11px] text-muted-foreground pt-1">
        <summary className="cursor-pointer hover:text-ink font-medium select-none">
          Or specify a direct document URL
        </summary>
        <div className="mt-2 space-y-1">
          <Input
            type="text"
            placeholder="https://res.cloudinary.com/... or https://example.com/id.pdf"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isUploading}
            className="h-9 text-xs rounded-xl"
          />
          <span className="text-[10px] text-muted-foreground block">
            Direct URL entry fallback for pre-hosted documents or development testing.
          </span>
        </div>
      </details>
    </div>
  );
};

export default DocumentUpload;
