// Builds the marble's textures and shader file for another project from edith's own files.
//   node prepare-assets.cjs <edith web folder> <target project folder>
// Needs `sharp` (edith's node_modules has it; pass NODE_PATH or run from a folder that resolves it).
const fs = require("fs");
const path = require("path");
const [, , EDITH, TARGET] = process.argv;
if (!EDITH || !TARGET) throw new Error("usage: node prepare-assets.cjs <edith web folder> <target project folder>");
const sharp = require(path.join(EDITH, "node_modules", "sharp"));

const img = (p) => path.join(EDITH, "public", "gl", "images", p);
const out = (p) => path.join(TARGET, "public", "marble", p);
fs.mkdirSync(path.dirname(out("x")), { recursive: true });

(async () => {
  // Same sizes edith serves (its KTX2 files: marble 3072x2048, masks 1024x679), same aspect as the sources.
  await sharp(img("hero/marble.jpg")).resize(3072, 2048, { fit: "fill" }).jpeg({ quality: 88, mozjpeg: true }).toFile(out("marble.jpg"));
  for (const [src, name] of [["marble-01", "mask-r"], ["marble-02", "mask-g"], ["marble-03", "mask-b"]]) {
    await sharp(img(`hero/${src}.jpg`)).resize(1024, 679, { fit: "fill" }).jpeg({ quality: 90, mozjpeg: true }).toFile(out(`${name}.jpg`));
  }
  fs.copyFileSync(img("hero/colorA.jpg"), out("gradient.jpg"));
  fs.copyFileSync(img("misc/noise.jpg"), out("noise.jpg"));

  // The GLSL, taken verbatim from edith's shaders.ts: the helper chunks, then the fullscreen vertex, marble and rays shaders.
  const src = fs.readFileSync(path.join(EDITH, "lib", "gl", "shaders.ts"), "utf8");
  const helpers = src.slice(0, src.indexOf("export const gradientVertex"));
  const marble = src.slice(src.indexOf("export const fullscreenVertex"));
  fs.mkdirSync(path.join(TARGET, "src", "lib", "marble"), { recursive: true });
  fs.writeFileSync(
    path.join(TARGET, "src", "lib", "marble", "shaders.ts"),
    "// GLSL of the edith hero marble, copied verbatim from edith's lib/gl/shaders.ts. Do not edit; re-run prepare-assets to refresh.\n\n" + helpers + "\n" + marble,
  );
  for (const f of fs.readdirSync(path.join(TARGET, "public", "marble"))) console.log(f, fs.statSync(out(f)).size);
})();
