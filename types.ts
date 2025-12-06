export interface Flower {
  id: number;
  icon: string;
  name: string;
}

export interface MusicTrack {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface CardData {
  recipientName: string;
  occasion: string;
  bouquet: Flower[];
  poem: string;
  music: MusicTrack | null;
}

export interface GalleryItem extends CardData {
  id: number;
  likes: number;
}

export enum AppStep {
  LANDING = 0,
  DETAILS = 1,
  BOUQUET = 2,
  AI_STUDIO = 3,
  PREVIEW = 4,
  RECIPIENT_VIEW = 5
}

export const OCCASIONS = [
  "Valentine's Day",
  "New Year",
  "Anniversary",
  "Birthday",
  "I'm Sorry",
  "Just Because"
];

export const FLOWERS: Flower[] = [
  { id: 1, icon: "🌹", name: "Red Rose" },
  { id: 2, icon: "🌷", name: "Tulip" },
  { id: 3, icon: "🌻", name: "Sunflower" },
  { id: 4, icon: "🌸", name: "Cherry Blossom" },
  { id: 5, icon: "🌿", name: "Eucalyptus" },
  { id: 6, icon: "💐", name: "Wildflower" },
  { id: 7, icon: "🌺", name: "Hibiscus" },
  { id: 8, icon: "🪷", name: "Lotus" },
  { id: 9, icon: "🥀", name: "Vintage Rose" },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 1, name: "Romantic Piano", icon: "🎹", color: "bg-rose-100 text-rose-600" },
  { id: 2, name: "Lo-Fi Love", icon: "🎧", color: "bg-indigo-100 text-indigo-600" },
  { id: 3, name: "Acoustic Guitar", icon: "🎸", color: "bg-amber-100 text-amber-600" },
  { id: 4, name: "Violin Solo", icon: "🎻", color: "bg-purple-100 text-purple-600" },
];