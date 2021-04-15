import { promises } from 'fs';

export const readFile = async (path) => {
    return JSON.parse(await promises.readFile(path, 'utf8').catch((error) => {
        console.error(error);
    }));
};

const normalizeRating = (rating) => {
    switch (rating) {
        case 14:
            return 12;
        case 12:
            return 11;
    }

    return rating;
};

export const sortRatingsPerPerson = (data) => {
    const ratingsPerPerson = {};

    const people = Object.keys(data[0]);
    people.shift();

    data.forEach((song) => {
        people.forEach((person) => {
            if (!song[person]) {
                return;
            }

            if (!ratingsPerPerson[person]) {
                ratingsPerPerson[person] = {};
            }

            ratingsPerPerson[person][song['title']] = normalizeRating(song[person]);
        });
    });

    return ratingsPerPerson;
};
