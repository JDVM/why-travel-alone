// Placeholder avatar images served from public/userprofilepictures.
// Previously this list was copy-pasted into three components; it now lives
// here once. Index into it with picForIndex so a traveler list longer than the
// array wraps around instead of reading past the end (the old code crashed on
// the 32nd traveler via profilepic[i].picture).
const profilePics: string[] = [
    '/userprofilepictures/1.jpg',
    '/userprofilepictures/2.jpg',
    '/userprofilepictures/3.jpg',
    '/userprofilepictures/4.jpg',
    '/userprofilepictures/5.jpg',
    '/userprofilepictures/6.jpg',
    '/userprofilepictures/7.jpg',
    '/userprofilepictures/8.jpg',
    '/userprofilepictures/9.jpg',
    '/userprofilepictures/10.jpg',
    '/userprofilepictures/11.jpg',
    '/userprofilepictures/12.jpg',
    '/userprofilepictures/13.jpg',
    '/userprofilepictures/14.jpg',
    '/userprofilepictures/15.jpg',
    '/userprofilepictures/16.jpg',
    '/userprofilepictures/17.jpg',
    '/userprofilepictures/18.jpg',
    '/userprofilepictures/19.jpg',
    '/userprofilepictures/20.jpg',
    '/userprofilepictures/21.jpg',
    '/userprofilepictures/23.jpg',
    '/userprofilepictures/24.jpg',
    '/userprofilepictures/25.jpg',
    '/userprofilepictures/26.jpg',
    '/userprofilepictures/27.jpg',
    '/userprofilepictures/28.jpg',
    '/userprofilepictures/29.jpg',
    '/userprofilepictures/30.jpg',
    '/userprofilepictures/31.jpg',
];

export function picForIndex(index: number): string {
    return profilePics[index % profilePics.length];
}

export default profilePics;
