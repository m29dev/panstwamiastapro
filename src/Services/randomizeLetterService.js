const polishAlphabet = [
    'A',
    'Ą',
    'B',
    'C',
    'Ć',
    'D',
    'E',
    'Ę',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'Ł',
    'M',
    'N',
    'Ń',
    'O',
    'Ó',
    'P',
    'Q',
    'R',
    'S',
    'Ś',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'Ź',
    'Ż',
]

export const radndomizeLetter = () => {
    // Randomly select a letter from the Polish alphabet
    const randomIndex = Math.floor(Math.random() * polishAlphabet.length)
    return polishAlphabet[randomIndex]
}
