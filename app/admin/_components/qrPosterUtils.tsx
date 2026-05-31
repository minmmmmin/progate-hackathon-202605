import { QRCodeSVG } from "qrcode.react";
import { createRoot } from "react-dom/client";

import { BASE_URL } from "../../../constants/url";

const EXPORT_SIZE = 1024;
const POSTER_WIDTH = 2480;
const POSTER_HEIGHT = 3508;
const SVG_NS = "http://www.w3.org/2000/svg";

type PosterSpot = {
  spotId: string;
  spotName: string;
  stampURL: string;
};

const buildQrUrl = (spotId: string) => {
  const params = new URLSearchParams({ id: spotId });
  return `${BASE_URL}?${params.toString()}`;
};

const renderQrSvg = async (spot: PosterSpot, size: number): Promise<SVGElement> => {
  const mount = document.createElement("div");
  mount.style.position = "fixed";
  mount.style.left = "-9999px";
  mount.style.top = "0";
  mount.style.width = "0";
  mount.style.height = "0";
  mount.style.overflow = "hidden";
  document.body.appendChild(mount);

  const root = createRoot(mount);
  const qrUrl = buildQrUrl(spot.spotId);
  const logoSize = Math.round(size * 0.3125);

  try {
    root.render(
      <QRCodeSVG
        value={qrUrl}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#3d2a35"
        imageSettings={{
          src: spot.stampURL,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }}
      />,
    );

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const svg = mount.querySelector("svg");
    if (!svg) {
      throw new Error("QR SVG unavailable");
    }

    return svg.cloneNode(true) as SVGElement;
  } finally {
    root.unmount();
    mount.remove();
  }
};

const buildPosterSvg = (qrDataUrl: string, spotName: string) => {
  const poster = document.createElementNS(SVG_NS, "svg");
  const safeSpotName = spotName || "スタンプQR";
  const spotFontSize = safeSpotName.length > 14 ? 120 : safeSpotName.length > 10 ? 140 : 170;

  poster.setAttribute("xmlns", SVG_NS);
  poster.setAttribute("viewBox", `0 0 ${POSTER_WIDTH} ${POSTER_HEIGHT}`);
  poster.setAttribute("width", String(POSTER_WIDTH));
  poster.setAttribute("height", String(POSTER_HEIGHT));

  const add = (tag: string, attrs: Record<string, string> = {}, text?: string) => {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      node.setAttribute(key, value);
    }
    if (text !== undefined) node.textContent = text;
    poster.appendChild(node);
    return node;
  };

  add("rect", {
    x: "0",
    y: "0",
    width: String(POSTER_WIDTH),
    height: String(POSTER_HEIGHT),
    fill: "#fff9f0",
  });
  add("rect", {
    x: "24",
    y: "24",
    width: String(POSTER_WIDTH - 48),
    height: String(POSTER_HEIGHT - 48),
    fill: "none",
    stroke: "#ff7e67",
    "stroke-width": "24",
  });
  add(
    "text",
    {
      x: String(POSTER_WIDTH / 2),
      y: "300",
      "text-anchor": "middle",
      fill: "#ff7e67",
      "font-size": "80",
      "font-weight": "900",
      "letter-spacing": "2",
      "font-family": "Hiragino Kaku Gothic ProN, Meiryo, sans-serif",
    },
    "文化祭スタンプラリー",
  );
  add("rect", {
    x: "520",
    y: "425",
    width: "1440",
    height: "210",
    rx: "90",
    fill: "#ffd060",
  });
  add(
    "text",
    {
      x: String(POSTER_WIDTH / 2),
      y: "595",
      "text-anchor": "middle",
      fill: "#3d2a35",
      "font-size": String(spotFontSize),
      "font-weight": "900",
      "font-family": "Hiragino Kaku Gothic ProN, Meiryo, sans-serif",
    },
    safeSpotName,
  );
  add("rect", {
    x: "670",
    y: "980",
    width: "1140",
    height: "1140",
    rx: "80",
    fill: "#000000",
    opacity: "0.08",
  });
  add("rect", {
    x: "650",
    y: "960",
    width: "1140",
    height: "1140",
    rx: "80",
    fill: "#ffffff",
  });
  add("image", {
    href: qrDataUrl,
    x: "710",
    y: "1020",
    width: "1020",
    height: "1020",
    preserveAspectRatio: "xMidYMid meet",
  });
  add(
    "text",
    {
      x: String(POSTER_WIDTH / 2),
      y: "3136",
      "text-anchor": "middle",
      fill: "#3d2a35",
      "font-size": "96",
      "font-weight": "700",
      "font-family": "Hiragino Kaku Gothic ProN, Meiryo, sans-serif",
    },
    "スマホで読み取ってスタンプGET！",
  );

  return poster;
};

const svgToPngBlob = async (svg: SVGElement, width: number, height?: number): Promise<Blob> => {
  const h = height ?? width;
  const clone = svg.cloneNode(true) as SVGElement;
  const image = clone.querySelector("image");
  if (image) {
    const src = image.getAttribute("href") || image.getAttribute("xlink:href");
    if (src && !src.startsWith("data:")) {
      const base64 = await urlToBase64(src);
      image.setAttribute("href", base64);
    }
  }

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(h));

  const xml = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, h);
      ctx.drawImage(img, 0, 0, width, h);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode PNG"));
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Failed to load SVG"));
    };

    img.src = svgUrl;
  });
};

const blobToDataUrl = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert blob to data URL"));
    reader.readAsDataURL(blob);
  });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const sanitize = (name: string) => {
  return name.replace(/[\\/:*?"<>|\s]+/g, "_");
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const createPosterSvgForSpot = async (spot: PosterSpot) => {
  const qrSvg = await renderQrSvg(spot, EXPORT_SIZE);
  const qrBlob = await svgToPngBlob(qrSvg, EXPORT_SIZE, EXPORT_SIZE);
  const qrDataUrl = await blobToDataUrl(qrBlob);
  return buildPosterSvg(qrDataUrl, spot.spotName);
};

const printPosterSvgs = async (posters: SVGSVGElement[], title: string) => {
  const pages = posters
    .map(
      (poster) =>
        `<section class="page">${new XMLSerializer().serializeToString(poster)}</section>`,
    )
    .join("");

  return new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    let finished = false;
    const cleanup = () => {
      if (finished) return;
      finished = true;
      iframe.remove();
      resolve();
    };

    const fail = (error: Error) => {
      if (finished) return;
      finished = true;
      iframe.remove();
      reject(error);
    };

    iframe.srcdoc = `
      <!doctype html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(title || "スタンプQR")}</title>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }

            @page {
              size: A4 portrait;
              margin: 0;
            }

            html,
            body {
              margin: 0;
              width: 100%;
              background: #ffffff;
            }

            .page {
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              break-after: page;
              page-break-after: always;
            }

            .page:last-child {
              break-after: auto;
              page-break-after: auto;
            }

            svg {
              width: 100vw;
              height: 100vh;
              display: block;
            }
          </style>
        </head>
        <body>
          ${pages}
        </body>
      </html>
    `;

    document.body.appendChild(iframe);
    const frameWindow = iframe.contentWindow;
    const frameDocument = iframe.contentDocument;
    if (!frameWindow || !frameDocument) {
      fail(new Error("Print frame unavailable"));
      return;
    }

    const handleAfterPrint = () => {
      frameWindow.removeEventListener("afterprint", handleAfterPrint);
      cleanup();
    };

    frameWindow.addEventListener("afterprint", handleAfterPrint);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        frameWindow.focus();
        frameWindow.print();
      });
    });
  });
};

export const savePosterForSpot = async (spot: PosterSpot) => {
  const posterSvg = await createPosterSvgForSpot(spot);
  const blob = await svgToPngBlob(posterSvg, POSTER_WIDTH, POSTER_HEIGHT);
  const filename = `${sanitize(spot.spotName) || "stamp"}-poster.png`;
  const file = new File([blob], filename, { type: "image/png" });

  const canShareFiles =
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] });

  if (canShareFiles) {
    try {
      await navigator.share({ files: [file], title: spot.spotName || "スタンプQR" });
      return;
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
    }
  }

  downloadBlob(blob, filename);
};

export const printPosterForSpot = async (spot: PosterSpot) => {
  const posterSvg = await createPosterSvgForSpot(spot);
  await printPosterSvgs([posterSvg], spot.spotName || "スタンプQR");
};

export const downloadPostersBulk = async (spots: PosterSpot[]) => {
  for (const [idx, spot] of spots.entries()) {
    const posterSvg = await createPosterSvgForSpot(spot);
    const blob = await svgToPngBlob(posterSvg, POSTER_WIDTH, POSTER_HEIGHT);
    const fallbackName = `stamp_${idx + 1}`;
    const filename = `${sanitize(spot.spotName) || fallbackName}-poster.png`;
    downloadBlob(blob, filename);
  }
};

export const printPostersBulk = async (spots: PosterSpot[]) => {
  const posters: SVGSVGElement[] = [];
  for (const spot of spots) {
    posters.push(await createPosterSvgForSpot(spot));
  }
  await printPosterSvgs(posters, "スタンプQR一括印刷");
};
