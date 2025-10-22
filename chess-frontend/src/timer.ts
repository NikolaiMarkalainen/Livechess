import type { Sides } from "./types";

let timerInterval: number | undefined;
let blackTimeLeft: number = 0;
let whiteTimeLeft: number = 0;

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 100);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const msms = String(milliseconds).padStart(2, "0");

  return `${mm}:${ss}:${msms}`;
};

export const parseTime = (timeString: string): number => {
  const [mm, ss, msms] = timeString.split(":").map(Number);

  const minutes = mm || 0;
  const seconds = ss || 0;
  const milliseconds = msms || 0;

  return minutes * 60 + seconds + milliseconds / 100;
};

export const countDown = (side: Sides) => {
  const countdownDiv = document.querySelector(`[data-cside=${side}] #timer`) as HTMLDivElement;
  const rawText = countdownDiv.textContent;

  if (blackTimeLeft === 0 || whiteTimeLeft === 0) {
    if (side === "black") {
      blackTimeLeft = parseTime(rawText);
    } else {
      whiteTimeLeft = parseTime(rawText);
    }
  }
  let seconds = side === "black" ? blackTimeLeft : whiteTimeLeft;
  let timeLeft = seconds;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownDiv.textContent = "⏱️ 00:00:00";
      return;
    }
    countdownDiv.textContent = `⏱️ ${formatTime(timeLeft)}`;
    timeLeft -= 0.01;
    if (side === "black") {
      blackTimeLeft = timeLeft;
    } else {
      whiteTimeLeft = timeLeft;
    }
  }, 10);
};
