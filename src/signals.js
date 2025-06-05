import { signal } from "@preact/signals";

export const episodeFormat = signal("(show) - (season)x(episode) - (title)");

export const spaceReplacement = signal(" ");

export const zeroFillSeason = signal(0);
export const zeroFillEpisode = signal(0);
