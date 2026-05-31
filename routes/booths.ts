import { createRoute, z } from "@hono/zod-openapi";
import {
  BoothListWithCongestionResponseSchema,
  BoothSchema,
  BoothUpdateRequestSchema,
  ErrorResponseSchema,
  MessageResponseSchema,
} from "@/schemas";

const BoothIdParamsSchema = z.object({
  id: z.uuid().openapi({
    param: { name: "id", in: "path" },
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

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
          schema: BoothListWithCongestionResponseSchema,
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

export const updateBoothRoute = createRoute({
  method: "patch",
  path: "/booths/{id}",
  tags: ["booths"],
  summary: "ブースのテキスト情報を更新する（スタンプ画像は変更しない）",
  request: {
    params: BoothIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: BoothUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "更新後のブース情報",
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
    404: {
      description: "対象ブースが存在しない",
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

export const deleteBoothRoute = createRoute({
  method: "delete",
  path: "/booths/{id}",
  tags: ["booths"],
  summary: "ブースを削除する",
  request: {
    params: BoothIdParamsSchema,
  },
  responses: {
    200: {
      description: "削除成功",
      content: {
        "application/json": {
          schema: MessageResponseSchema,
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
