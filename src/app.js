import { forEach, reduce } from 'lodash-es';
import { ALBUM_DATA_FILE, MAX_POINTS, SONG_DATA_FILE } from './constants.js';
import { readFile, sortRatingsPerPerson } from './util.js';

const calculateMatchPercentage = (songsPersonA, songsPersonB) => {
    const result = reduce(songsPersonA, (sum, ratingA, songA) => {
        if (!Object.keys(songsPersonB).includes(songA)) {
            return sum + 0;
        }

        const ratingB = songsPersonB[songA];

        const higherRating = Math.max(ratingA, ratingB);
        const lowerRating = Math.min(ratingA, ratingB);

        return sum + (lowerRating / higherRating) * 100;
    }, 0);

    return Math.round((result / MAX_POINTS) * 10000) / 100; // Round to two decimal points
};

const calculateMatches = (ratingsPerPerson) => {
    const compatibility = [];

    forEach(ratingsPerPerson, (songsPersonA, namePersonA) => {
        forEach(ratingsPerPerson, (songsPersonB, namePersonB) => {
            // Generate name of pairing (ans sort them alphabetically)
            const pair = [namePersonA, namePersonB].sort().join(' and ');
            const existingPairing = compatibility.find((item) => item.pair === pair);

            // Don't calculate the compatibility for a person with him/herself
            if (namePersonA === namePersonB || existingPairing) {
                return;
            }

            compatibility.push({
                pair,
                percentage: calculateMatchPercentage(songsPersonA, songsPersonB)
            });
        });
    });

    return compatibility.sort((a, b) => a.percentage - b.percentage);
};

const calculate = async (filePath, title) => {
    const songData = await readFile(filePath);

    const sortedSongData = sortRatingsPerPerson(songData);
    const result = calculateMatches(sortedSongData);

    console.log(`Match result for ${title}:`);
    console.table(result);
};

// Start the calculations for albums and songs
Promise.all([
    calculate(ALBUM_DATA_FILE, 'albums'),
    calculate(SONG_DATA_FILE, 'songs')
]).then(() => console.log('Matching completed.'));


