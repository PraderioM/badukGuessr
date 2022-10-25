import { Game, Move } from '../models';

export const leeSedolHongJansik20030423 = new Game(
        'Lee Sedol',
        'Hong Jansik',
        '6p',
        '4p',
        new Date('2003-04-23'),
        'B+R',
        [
    new Move('B', 3, 15, 0, null),
    new Move('W', 3, 3, 1, null),
    new Move('B', 16, 15, 2, null),
    new Move('W', 14, 15, 3, null),
    new Move('B', 11, 15, 4, null),
    new Move('W', 15, 12, 5, null),
    new Move('B', 14, 14, 6, null),
    new Move('W', 13, 14, 7, 182),
    new Move('B', 14, 13, 8, null),
    new Move('W', 15, 15, 9, null),
    new Move('B', 16, 13, 10, null),
    new Move('W', 13, 13, 11, 182),
    new Move('B', 14, 12, 12, null),
    new Move('W', 16, 16, 13, null),
    new Move('B', 16, 14, 14, null),
    new Move('W', 17, 16, 15, null),
    new Move('B', 13, 15, 16, null),
    new Move('W', 12, 15, 17, null),
    new Move('B', 13, 16, 18, null),
    new Move('W', 12, 16, 19, null),
    new Move('B', 14, 17, 20, null),
    new Move('W', 14, 16, 21, null),
    new Move('B', 13, 17, 22, null),
    new Move('W', 12, 17, 23, null),
    new Move('B', 15, 17, 24, null),
    new Move('W', 15, 16, 25, null),
    new Move('B', 12, 14, 26, null),
    new Move('W', 10, 17, 27, null),
    new Move('B', 10, 16, 28, null),
    new Move('W', 11, 17, 29, null),
    new Move('B', 16, 17, 30, null),
    new Move('W', 17, 17, 31, null),
    new Move('B', 17, 18, 32, null),
    new Move('W', 13, 18, 33, null),
    new Move('B', 12, 18, 34, 35),
    new Move('W', 11, 18, 35, null),
    new Move('B', 9, 17, 36, null),
    new Move('W', 14, 18, 37, null),
    new Move('B', 16, 18, 38, null),
    new Move('W', 18, 17, 39, null),
    new Move('B', 3, 5, 40, null),
    new Move('W', 11, 14, 41, 50),
    new Move('B', 5, 3, 42, null),
    new Move('W', 1, 3, 43, null),
    new Move('B', 12, 13, 44, null),
    new Move('W', 13, 12, 45, 182),
    new Move('B', 14, 11, 46, null),
    new Move('W', 12, 12, 47, 182),
    new Move('B', 11, 13, 48, null),
    new Move('W', 16, 3, 49, null),
    new Move('B', 10, 14, 50, null),
    new Move('W', 12, 10, 51, null),
    new Move('B', 16, 8, 52, null),
    new Move('W', 14, 2, 53, 128),
    new Move('B', 2, 13, 54, null),
    new Move('W', 5, 2, 55, null),
    new Move('B', 2, 4, 56, null),
    new Move('W', 4, 3, 57, null),
    new Move('B', 2, 3, 58, null),
    new Move('W', 2, 2, 59, null),
    new Move('B', 1, 2, 60, 195),
    new Move('W', 1, 1, 61, null),
    new Move('B', 6, 2, 62, null),
    new Move('W', 6, 3, 63, null),
    new Move('B', 5, 4, 64, null),
    new Move('W', 4, 2, 65, null),
    new Move('B', 7, 3, 66, null),
    new Move('W', 6, 4, 67, null),
    new Move('B', 6, 5, 68, null),
    new Move('W', 7, 4, 69, null),
    new Move('B', 8, 4, 70, null),
    new Move('W', 7, 5, 71, null),
    new Move('B', 12, 11, 72, null),
    new Move('W', 11, 12, 73, 182),
    new Move('B', 7, 6, 74, null),
    new Move('W', 8, 5, 75, null),
    new Move('B', 9, 5, 76, null),
    new Move('W', 8, 6, 77, null),
    new Move('B', 8, 7, 78, null),
    new Move('W', 9, 6, 79, null),
    new Move('B', 10, 6, 80, null),
    new Move('W', 9, 7, 81, null),
    new Move('B', 9, 8, 82, null),
    new Move('W', 10, 7, 83, null),
    new Move('B', 11, 7, 84, null),
    new Move('W', 10, 8, 85, null),
    new Move('B', 10, 9, 86, null),
    new Move('W', 11, 8, 87, null),
    new Move('B', 12, 8, 88, null),
    new Move('W', 11, 9, 89, null),
    new Move('B', 11, 10, 90, null),
    new Move('W', 12, 9, 91, null),
    new Move('B', 13, 9, 92, null),
    new Move('W', 13, 10, 93, null),
    new Move('B', 13, 11, 94, null),
    new Move('W', 14, 10, 95, null),
    new Move('B', 10, 12, 96, null),
    new Move('W', 10, 10, 97, 100),
    new Move('B', 10, 11, 98, null),
    new Move('W', 11, 2, 99, null),
    new Move('B', 9, 10, 100, null),
    new Move('W', 15, 10, 101, null),
    new Move('B', 11, 3, 102, null),
    new Move('W', 12, 2, 103, null),
    new Move('B', 16, 4, 104, 151),
    new Move('W', 15, 4, 105, null),
    new Move('B', 15, 5, 106, null),
    new Move('W', 16, 5, 107, null),
    new Move('B', 17, 4, 108, 151),
    new Move('W', 15, 6, 109, null),
    new Move('B', 14, 5, 110, null),
    new Move('W', 16, 6, 111, null),
    new Move('B', 14, 6, 112, null),
    new Move('W', 17, 3, 113, null),
    new Move('B', 13, 3, 114, null),
    new Move('W', 14, 4, 115, null),
    new Move('B', 13, 2, 116, null),
    new Move('W', 13, 4, 117, null),
    new Move('B', 12, 3, 118, null),
    new Move('W', 9, 2, 119, null),
    new Move('B', 14, 3, 120, null),
    new Move('W', 15, 3, 121, null),
    new Move('B', 10, 2, 122, null),
    new Move('W', 10, 1, 123, null),
    new Move('B', 10, 3, 124, null),
    new Move('W', 11, 1, 125, null),
    new Move('B', 15, 2, 126, null),
    new Move('W', 8, 3, 127, null),
    new Move('B', 14, 1, 128, null),
    new Move('W', 16, 1, 129, null),
    new Move('B', 16, 2, 130, null),
    new Move('W', 17, 1, 131, null),
    new Move('B', 17, 2, 132, null),
    new Move('W', 18, 2, 133, null),
    new Move('B', 15, 1, 134, null),
    new Move('W', 13, 1, 135, null),
    new Move('B', 12, 4, 136, null),
    new Move('W', 13, 5, 137, null),
    new Move('B', 13, 0, 138, null),
    new Move('W', 12, 1, 139, null),
    new Move('B', 18, 1, 140, 141),
    new Move('W', 18, 0, 141, null),
    new Move('B', 13, 6, 142, null),
    new Move('W', 12, 5, 143, null),
    new Move('B', 11, 5, 144, null),
    new Move('W', 12, 6, 145, null),
    new Move('B', 12, 7, 146, null),
    new Move('W', 14, 7, 147, null),
    new Move('B', 13, 7, 148, null),
    new Move('W', 17, 5, 149, null),
    new Move('B', 11, 6, 150, null),
    new Move('W', 18, 4, 151, null),
    new Move('B', 14, 8, 152, null),
    new Move('W', 10, 4, 153, null),
    new Move('B', 9, 4, 154, null),
    new Move('W', 15, 7, 155, null),
    new Move('B', 16, 10, 156, 163),
    new Move('W', 15, 9, 157, null),
    new Move('B', 15, 8, 158, null),
    new Move('W', 16, 9, 159, null),
    new Move('B', 17, 9, 160, null),
    new Move('W', 17, 10, 161, null),
    new Move('B', 17, 7, 162, null),
    new Move('W', 16, 11, 163, null),
    new Move('B', 9, 3, 164, null),
    new Move('W', 8, 2, 165, null),
    new Move('B', 16, 0, 166, null),
    new Move('W', 18, 6, 167, null),
    new Move('B', 15, 0, 168, null),
    new Move('W', 18, 3, 169, null),
    new Move('B', 17, 6, 170, null),
    new Move('W', 18, 9, 171, null),
    new Move('B', 17, 8, 172, null),
    new Move('W', 2, 16, 173, null),
    new Move('B', 3, 16, 174, null),
    new Move('W', 3, 17, 175, 180),
    new Move('B', 4, 17, 176, null),
    new Move('W', 1, 17, 177, null),
    new Move('B', 3, 18, 178, null),
    new Move('W', 2, 18, 179, 200),
    new Move('B', 2, 17, 180, 183),
    new Move('W', 18, 18, 181, null),
    new Move('B', 11, 11, 182, null),
    new Move('W', 3, 17, 183, 186),
    new Move('B', 9, 1, 184, null),
    new Move('W', 8, 1, 185, null),
    new Move('B', 2, 17, 186, 189),
    new Move('W', 13, 14, 187, 188),
    new Move('B', 13, 13, 188, null),
    new Move('W', 3, 17, 189, 198),
    new Move('B', 4, 18, 190, null),
    new Move('W', 2, 15, 191, null),
    new Move('B', 2, 14, 192, null),
    new Move('W', 3, 7, 193, null),
    new Move('B', 1, 4, 194, null),
    new Move('W', 0, 2, 195, null),
    new Move('B', 3, 9, 196, null),
    new Move('W', 4, 16, 197, null),
    new Move('B', 2, 17, 198, null),
    new Move('W', 2, 9, 199, null),
    new Move('B', 1, 18, 200, null),
    new Move('W', 3, 10, 201, null),
    new Move('B', 2, 8, 202, 207),
    new Move('W', 3, 8, 203, null),
    new Move('B', 4, 9, 204, null),
    new Move('W', 2, 7, 205, null),
    new Move('B', 2, 10, 206, null),
    new Move('W', 1, 8, 207, null),
    new Move('B', 1, 10, 208, null),
    new Move('W', 6, 7, 209, null),
    new Move('B', 6, 9, 210, null)
  ]
);
