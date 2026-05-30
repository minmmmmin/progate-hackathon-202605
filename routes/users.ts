import { createRoute, z } from "@hono/zod-openapi";
import {
  ErrorResponseSchema,
  StampListResponseSchema,
  UserIdResponseSchema,
} from "@/schemas";

export const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  tags: ["users"],
  summary: "新たな匿名ユーザーを作成する",
  responses: {
    200: {
      description: "作成されたユーザーID",
      content: {
        "application/json": {
          schema: UserIdResponseSchema,
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

export const getMyStampsRoute = createRoute({
  method: "get",
  path: "/users/me/stamps",
  tags: ["users"],
  summary: "現在のユーザーが持つスタンプを取得する",
  request: {
    headers: z.object({
      "x-user-id": z
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
  },
  responses: {
    200: {
      description: "スタンプ取得成功",
      content: {
        "application/json": {
          schema: StampListResponseSchema,
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
