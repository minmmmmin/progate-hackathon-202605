# 開発ルール

## ブランチ運用

- `main`: 本番リリース用。直接コミット禁止。
- `develop`: 開発の統合ブランチ。**作業ブランチは必ず `develop` から切る**。
- 作業ブランチ名は **対応する Issue 番号** を含める。
  - 機能追加: `feature/<issue番号>`（例: `feature/12`）
  - バグ修正: `fix/<issue番号>-<簡単な説明>`（例: `fix/34-stamp-count`）

## 作業フロー

1. 作業前に GitHub で **Issue を作成**（番号がブランチ名に必要）。
2. `develop` を最新化して作業ブランチを切る。
   ```bash
   git switch develop && git pull
   git switch -c feature/<issue番号>
   ```
3. こまめにコミット。コミットメッセージは内容が分かるように簡潔に。
4. Push して `develop` 向けに **Pull Request** を作成。タイトル・説明に `#<issue番号>` を記載。
5. レビュー後にマージ。マージ済みブランチは削除する。

## コミットメッセージ

- 1 行目に要点を簡潔に（例: `feature: QRスキャン画面を追加`）。
- 関連 Issue は本文に `#<issue番号>` で紐付ける。

## Pull Request

- 必ず **1 人以上のレビュー** を受けてからマージ。
- `main` への直接マージ禁止。`develop` 経由でリリースする。
