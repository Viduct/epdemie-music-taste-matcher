import { forEach } from 'lodash-es';
import { ALBUM_DATA_FILE, MAX_POINTS, SONG_DATA_FILE } from './constants.js';
import { readFile, sortRatingsPerPerson } from './util.js';

const calculateMatchPercentage = (songsDudeA, songsDudeB) => {
    let result = 0;

    forEach(songsDudeA, (ratingA, songA) => {
        if (!Object.keys(songsDudeB).includes(songA)) {
            return;
        }

        const ratingB = songsDudeB[songA];

        let higherRating = Math.max(ratingA, ratingB);
        let lowerRating = Math.min(ratingA, ratingB);

        result += (lowerRating / higherRating) * 100;
    });

    return Math.round((result / MAX_POINTS) * 10000) / 100; // Round to two decimal points
};

const calculateMatches = (ratingsPerDude) => {
    const compatibility = [];

    forEach(ratingsPerDude, (songsDudeA, dudeAKey) => {
        forEach(ratingsPerDude, (songsDudeB, dudeBKey) => {
            // Generate name of pairing (ans sort them alphabetically)
            const pair = [dudeAKey, dudeBKey].sort().join(' and ');
            const existingPairing = compatibility.find((item) => item.pair === pair);

            // Don't calculate the compatibility for a dude with him/herself
            if (dudeAKey === dudeBKey || existingPairing) {
                return;
            }

            compatibility.push({
                pair,
                percentage: calculateMatchPercentage(songsDudeA, songsDudeB)
            });
        });
    });

    return compatibility.sort((a, b) => a.percentage - b.percentage);
};

const calculate = async (fileName, title) => {
    const songData = await readFile(fileName);

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


