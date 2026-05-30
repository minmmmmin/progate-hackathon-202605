import { createRoute } from "@hono/zod-openapi";
import {
  BoothListResponseSchema,
  BoothSchema,
  ErrorResponseSchema,
} from "@/schemas";

export const getBoothsRoute = createRoute({
  method: "get",
  path: "/booths",
  tags: ["booths"],
  summary: "全ブースの情報を取得する",
  responses: {
    200: {
      description: "ブース一覧の取得成功",
      content: {
        "application/json": {
          schema: BoothListResponseSchema,
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

export const createBoothRoute = createRoute({
  method: "post",
  path: "/booths",
  tags: ["booths"],
  summary: "新規ブース情報を登録する",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
              title: {
                type: "string",
              },
              room: {
                type: "string",
              },
              stallholder: {
                type: "string",
              },
            },
            required: ["file", "title", "room", "stallholder"],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "登録されたブース情報",
      content: {
        "application/json": {
          schema: BoothSchema,
        },
      },
    },
    400: {
      description: "リクエスト不正",
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
