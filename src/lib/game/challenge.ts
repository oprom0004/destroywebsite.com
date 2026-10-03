export type Challenge = {
  target: string;
  score: number;
  seconds: number | null;
};
export const scoreValue = (progress: number) =>
  Math.floor(progress * 10 + 1e-8) / 10;
export function readChallenge(params: URLSearchParams): Challenge | null {
  const target = params.get("target"),
    raw = params.get("challenge");
  if (!target || !raw?.trim()) return null;
  const score = Number(raw);
  const time = params.get("seconds");
  const seconds = time === null ? null : Number(time);
  if (
    !Number.isFinite(score) ||
    score <= 0 ||
    score > 100 ||
    (seconds !== null &&
      (!time?.trim() ||
        !Number.isFinite(seconds) ||
        seconds < 1 ||
        seconds > 86400))
  )
    return null;
  return { target, score, seconds };
}
export function challengeResult(
  challenge: Challenge,
  progress: number,
  elapsed: number,
) {
  if (
    progress + 1e-8 >= challenge.score &&
    (challenge.seconds === null || elapsed <= challenge.seconds)
  )
    return "won";
  if (challenge.seconds !== null && elapsed >= challenge.seconds) return "lost";
  return "playing";
}
export function challengeLink(
  base: string,
  target: string,
  progress: number,
  elapsed: number,
) {
  const url = new URL("/", base);
  url.searchParams.set("target", target);
  const score = scoreValue(progress);
  if (score > 0) {
    url.searchParams.set("challenge", String(score));
    url.searchParams.set(
      "seconds",
      String(Math.max(1, Math.min(86400, Math.ceil(elapsed)))),
    );
  }
  return url.href;
}
