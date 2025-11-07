import type { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import { MonsterIdsResponse, monsterIds } from "@/api/monster-ids";
import QRCodeStyling from "qr-code-styling";

(pdfMake as any).vfs =
  (pdfFonts as any).default?.pdfMake?.vfs ||
  (pdfFonts as any).pdfMake?.vfs ||
  (pdfFonts as any).vfs;

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function generateTransparentQR(url: string): Promise<string> {
  const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    data: url,
    dotsOptions: { color: "#000000", type: "rounded" },
    backgroundOptions: { color: "transparent" },
  });

  const blob = (await qrCode.getRawData("png")) as Blob;
  if (!blob) throw new Error("QRコード生成に失敗しました");

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function generateMonsterQRs() {
  const { ids }: MonsterIdsResponse = await monsterIds();
  const baseUrl = window.location.origin;
  const qrDataList = ids.map((id) => `${baseUrl}/battle/${id}`);

  // ロゴ・背景をDataURL化
  const [logoDataUrl, bgDataUrl] = await Promise.all([
    toDataUrl(`${baseUrl}/logo.png`),
    toDataUrl(`${baseUrl}/bg-reward.png`),
  ]);

  // QRコードを透過で生成
  const qrImagePromises = qrDataList.map((url) => generateTransparentQR(url));
  const qrDataUrls = await Promise.all(qrImagePromises);

  // 各ページに1つずつ配置
  const content = qrDataUrls.map((dataUrl, index) => ({
    stack: [
      {
        image: logoDataUrl,
        width: 480,
        alignment: "center",
        margin: [0, 60, 0, 40],
      },
      {
        image: dataUrl,
        width: 250,
        height: 250,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
    ],
    pageBreak: index === qrDataUrls.length - 1 ? undefined : "after",
  }));

  // PDF定義
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    background: [
      {
        image: bgDataUrl,
        width: 580,
        height: 820,
        absolutePosition: { x: (595.28 - 580) / 2, y: (841.89 - 820) / 2 },
      },
    ],
    content,
  } as TDocumentDefinitions;

  pdfMake.createPdf(docDefinition).download("monster_qrcodes.pdf");
}
