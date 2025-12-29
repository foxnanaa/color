export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  progress: string; // e.g., "Uploading...", "Processing...", "Done"
}

export interface ColorOption {
  id: string;
  label: string;
  value: string;
  colorCode: string; // CSS color for UI preview
}

export const DEFAULT_COLORS: ColorOption[] = [
  { id: 'red', label: 'Red', value: 'red', colorCode: '#ef4444' },
  { id: 'blue', label: 'Blue', value: 'blue', colorCode: '#3b82f6' },
  { id: 'green', label: 'Green', value: 'emerald green', colorCode: '#10b981' },
  { id: 'gold', label: 'Gold', value: 'gold', colorCode: '#eab308' },
  { id: 'purple', label: 'Purple', value: 'purple', colorCode: '#a855f7' },
];
