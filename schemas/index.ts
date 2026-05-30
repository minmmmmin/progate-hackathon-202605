import { z } from "@hono/zod-openapi";

export const UserSchema = z.object({
  id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  created_at: z.iso.datetime().openapi({ example: "2026-05-29T12:34:56.000Z" }),
});

export const BoothSchema = z.object({
  id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  stamp_url: z.string().openapi({ example: "https://example.com/stamp.png" }),
  title: z.string().openapi({ example: "焼きそば" }),
  room: z.string().openapi({ example: "101教室" }),
  stallholder: z.string().openapi({ example: "1-A" }),
});

export const ScanLogSchema = z.object({
  id: z.number().int().openapi({ example: 1 }),
  user_id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  booth_id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  scanned_at: z.iso.datetime().openapi({ example: "2026-05-29T12:34:56.000Z" }),
});

export const UserIdResponseSchema = z.object({
  user_id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});

export const BoothListResponseSchema = z.object({
  booths: z.array(BoothSchema),
});

export const StampListResponseSchema = z.object({
  stamps: z.array(BoothSchema),
});

export const ScanCreateRequestSchema = z.object({
  user_id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  booth_id: z.uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});

export const ScanResponseSchema = z.object({
  message: z.string().openapi({ example: "スタンプを付与しました" }),
  booth: BoothSchema,
});

export const BoothStampUploadResponseSchema = z.object({
  stamp_url: z.string().openapi({ example: "https://example.com/stamps/abc.png" }),
});

export const ErrorResponseSchema = z.object({
  message: z.string().openapi({ example: "エラーが発生しました" }),
});

export type User = z.infer<typeof UserSchema>;
export type Booth = z.infer<typeof BoothSchema>;
export type ScanLog = z.infer<typeof ScanLogSchema>;
export type UserIdResponse = z.infer<typeof UserIdResponseSchema>;
export type BoothListResponse = z.infer<typeof BoothListResponseSchema>;
export type StampListResponse = z.infer<typeof StampListResponseSchema>;
export type ScanCreateRequest = z.infer<typeof ScanCreateRequestSchema>;
export type ScanResponse = z.infer<typeof ScanResponseSchema>;
export type BoothStampUploadResponse = z.infer<typeof BoothStampUploadResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
