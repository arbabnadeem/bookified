"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import FileUploader from "./FileUploader";
import VoiceSelector from "./VoiceSelector";
import LoadingOverlay from "./LoadingOverlay";
import { useAuth } from "@clerk/nextjs";
// import { toast } from "sonner";
// import {
//   checkBookExists,
//   createBook,
//   saveBookSegments,
// } from "@/lib/actions/book.actions";
// import { useRouter } from "next/navigation";
// import { parsePDFFile } from "@/lib/utils";
// import { upload } from "@vercel/blob/client";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  //   const { userId } = useAuth();
  //   const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    console.log(data);

    await new Promise((e) => setTimeout(e, 3000));
    setIsSubmitting(false);
  };

  if (!isMounted) return null;

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FieldGroup>
            {/* 1. PDF File Upload */}
            <FileUploader
              control={form.control}
              name="pdfFile"
              label="Book PDF File"
              acceptTypes={ACCEPTED_PDF_TYPES}
              icon={Upload}
              placeholder="Click to upload PDF"
              hint="PDF file (max 50MB)"
              disabled={isSubmitting}
            />

            {/* 2. Cover Image Upload */}
            <FileUploader
              control={form.control}
              name="coverImage"
              label="Cover Image (Optional)"
              acceptTypes={ACCEPTED_IMAGE_TYPES}
              icon={ImageIcon}
              placeholder="Click to upload cover image"
              hint="Leave empty to auto-generate from PDF"
              disabled={isSubmitting}
            />

            {/* 3. Title Input */}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    className="form-input"
                    placeholder="ex: Rich Dad Poor Dad"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* 4. Author Input */}
            <Controller
              control={form.control}
              name="author"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="author">Author Name</FieldLabel>
                  <Input
                    {...field}
                    id="author"
                    className="form-input"
                    placeholder="ex: Robert Kiyosaki"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* 5. Voice Selector */}
            <Controller
              control={form.control}
              name="persona"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="persona">
                    Choose Assistant Voice
                  </FieldLabel>
                  <VoiceSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* 6. Submit Button */}
          <Button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </Button>
        </form>
      </div>
    </>
  );
};

export default UploadForm;
