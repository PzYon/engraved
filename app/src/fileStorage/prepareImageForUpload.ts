// Everything an entry needs to know about an image before it is uploaded. The dimensions matter
// beyond bookkeeping: they are what lets a scrap reserve the right space for an image, so the page
// does not jump around as each one loads.
export interface IPreparedImage {
  file: File;
  width?: number;
  height?: number;
}

const maxEdge = 2000;

// Types we are willing to decode and re-encode. GIF is deliberately absent - re-encoding one to a
// still frame would silently throw away the animation - and so is SVG, where "downscaling" a vector
// to a bitmap is the opposite of what anyone wants.
const reEncodable = ["image/png", "image/jpeg", "image/webp", "image/avif"];

// Not decodable outside Safari, so it would fail somewhere less obvious.
const undecodable = ["image/heic", "image/heif"];

export async function prepareImageForUpload(
  file: File,
): Promise<IPreparedImage> {
  if (undecodable.includes(file.type)) {
    throw new Error(
      `"${file.name}" is a HEIC image, which most browsers cannot read. Export it as JPEG or PNG first.`,
    );
  }

  if (!reEncodable.includes(file.type)) {
    return { file };
  }

  const bitmap = await createImageBitmap(file, {
    // Without this the bitmap ignores the EXIF orientation, and a photo taken sideways stays
    // sideways - a rotation the user cannot undo once it is stored.
    imageOrientation: "from-image",
  });

  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));

    // Already small enough: re-encoding would cost quality for nothing. Only the measurement was
    // needed.
    if (scale === 1) {
      return { file, width: bitmap.width, height: bitmap.height };
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    return {
      file: await toWebp(bitmap, file.name, width, height),
      width,
      height,
    };
  } finally {
    bitmap.close();
  }
}

async function toWebp(
  bitmap: ImageBitmap,
  fileName: string,
  width: number,
  height: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );

  if (!blob) {
    throw new Error(`"${fileName}" could not be converted for upload.`);
  }

  return new File([blob], toWebpName(fileName), { type: "image/webp" });
}

function toWebpName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "") + ".webp";
}
