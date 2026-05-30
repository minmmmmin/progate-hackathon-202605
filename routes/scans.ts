import { createRoute } from "@hono/zod-openapi";
import {
  ErrorResponseSchema,
  ScanCreateRequestSchema,
  ScanResponseSchema,
} from "@/schemas";

export const createScanRoute = createRoute({
  method: "post",
  path: "/scans",
  tags: ["scans"],
  summary: "QRコードをスキャンしたログを登録し、スタンプを付与する",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ScanCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "スタンプ付与成功",
      content: {
        "application/json": {
          schema: ScanResponseSchema,
        },
      },
    },
    404: {
      description: "対象ブースが存在しない",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    429: {
      description: "クールダウン中",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: "サーバーエラー",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});
