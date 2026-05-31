"use client";

import { X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import type { BoothWithCongestion } from "@/schemas";

type SpotEditDialogProps = {
  open: boolean;
  spot: BoothWithCongestion | null;
  onClose: () => void;
  onSubmit: (input: { title: string; room: string; stallholder: string }) => Promise<void>;
};

export const SpotEditDialog: FC<SpotEditDialogProps> = ({ open, spot, onClose, onSubmit }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState(spot?.title ?? "");
  const [room, setRoom] = useState(spot?.room ?? "");
  const [stallholder, setStallholder] = useState(spot?.stallholder ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot) return;
    if (!title.trim() || !room.trim() || !stallholder.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), room: room.trim(), stallholder: stallholder.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !spot) return null;

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose} onCancel={onClose}>
      <div className="modal-box bg-base-100 max-w-sm rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-base-content/60 text-xs font-semibold">スポット編集</div>
            <h3 className="text-base-content text-lg font-extrabold">{spot.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="form-control">
            <span className="label-text text-base-content/70 mb-1 text-xs font-semibold">
              スポット名
            </span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text text-base-content/70 mb-1 text-xs font-semibold">場所</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text text-base-content/70 mb-1 text-xs font-semibold">
              出店者
            </span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={stallholder}
              onChange={(e) => setStallholder(e.target.value)}
              required
            />
          </label>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn btn-ghost flex-1 rounded-full font-semibold"
              onClick={onClose}
              disabled={submitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 rounded-full font-semibold"
              disabled={submitting}
            >
              {submitting ? "保存中…" : "保存する"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
