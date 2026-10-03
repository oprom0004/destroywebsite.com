/** Convert provider responses into actionable errors; never mistake a demo for a capture. */
export function previewImage(body: any, status: number): string {
  if (status === 429 || body?.code === "ERATE") throw new Error("The screenshot service is busy or has reached its request limit. Please try again later.");
  if (body?.code === "EBRWSRTIMEOUT") throw new Error("The screenshot service timed out opening this website. It may be slow or require browser verification. Retry or choose another public URL.");
  if (body?.status !== "success") throw new Error("The screenshot service could not capture this website. Login and browser-verification pages may not be supported.");
  if (/^(just a moment|attention required|verify you are human)/i.test(body?.data?.title || "")) throw new Error("This website requires browser verification, so its page could not be captured.");
  const image = body?.data?.screenshot?.url;
  if (typeof image !== "string" || !image.startsWith("https://")) throw new Error("The screenshot service returned no usable webpage image. Please retry.");
  return image;
}
