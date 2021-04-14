import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const MAX_POINTS = 1200;

export const DATA_DIR_PATH = path.resolve(__dirname, '../data')
export const SONG_DATA_FILE = path.resolve(DATA_DIR_PATH, 'data.json')
export const ALBUM_DATA_FILE = path.resolve(DATA_DIR_PATH, 'data-albums.json')
