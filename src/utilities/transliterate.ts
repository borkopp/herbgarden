export const latinToCyrillic = (text: string) => {
    const digraphs: Record<string, string> = {
        dzh: 'џ',
        Dzh: 'Џ',
        DZH: 'Џ',
        dz: 'ѕ',
        Dz: 'Ѕ',
        DZ: 'Ѕ',
        zh: 'ж',
        Zh: 'Ж',
        ZH: 'Ж',
        ch: 'ч',
        Ch: 'Ч',
        CH: 'Ч',
        sh: 'ш',
        Sh: 'Ш',
        SH: 'Ш',
        gj: 'ѓ',
        Gj: 'Ѓ',
        GJ: 'Ѓ',
        kj: 'ќ',
        Kj: 'Ќ',
        KJ: 'Ќ',
        nj: 'њ',
        Nj: 'Њ',
        NJ: 'Њ',
        lj: 'љ',
        Lj: 'Љ',
        LJ: 'Љ',
    }

    const monographs: Record<string, string> = {
        a: 'а',
        b: 'б',
        c: 'ц',
        d: 'д',
        e: 'е',
        f: 'ф',
        g: 'г',
        h: 'х',
        i: 'и',
        j: 'ј',
        k: 'к',
        l: 'л',
        m: 'м',
        n: 'н',
        o: 'о',
        p: 'п',
        q: 'ќ',
        r: 'р',
        s: 'с',
        t: 'т',
        u: 'у',
        v: 'в',
        w: 'в',
        x: 'кс',
        y: 'и',
        z: 'з',
        A: 'А',
        B: 'Б',
        C: 'Ц',
        D: 'Д',
        E: 'Е',
        F: 'Ф',
        G: 'Г',
        H: 'Х',
        I: 'И',
        J: 'Ј',
        K: 'К',
        L: 'Л',
        M: 'М',
        N: 'Н',
        O: 'О',
        P: 'П',
        Q: 'Ќ',
        R: 'Р',
        S: 'С',
        T: 'Т',
        U: 'У',
        V: 'В',
        W: 'В',
        X: 'Кс',
        Y: 'И',
        Z: 'З',
    }

    let result = text
    for (const [lat, cyr] of Object.entries(digraphs)) {
        result = result.split(lat).join(cyr)
    }
    for (const [lat, cyr] of Object.entries(monographs)) {
        result = result.split(lat).join(cyr)
    }

    return result
}

export const cyrillicToLatin = (text: string) => {
    const digraphs: Record<string, string> = {
        џ: 'dzh',
        Џ: 'Dzh',
        ѕ: 'dz',
        Ѕ: 'Dz',
        ж: 'zh',
        Ж: 'Zh',
        ч: 'ch',
        Ч: 'Ch',
        ш: 'sh',
        Ш: 'Sh',
        ѓ: 'gj',
        Ѓ: 'Gj',
        ќ: 'kj',
        Ќ: 'Kj',
        њ: 'nj',
        Њ: 'Nj',
        љ: 'lj',
        Љ: 'Lj',
    }

    const monographs: Record<string, string> = {
        а: 'a',
        б: 'b',
        ц: 'c',
        д: 'd',
        е: 'e',
        ф: 'f',
        г: 'g',
        х: 'h',
        и: 'i',
        ј: 'j',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        в: 'v',
        з: 'z',
        А: 'A',
        Б: 'B',
        Ц: 'C',
        Д: 'D',
        Е: 'E',
        Ф: 'F',
        Г: 'G',
        Х: 'H',
        И: 'I',
        Ј: 'J',
        К: 'K',
        Л: 'L',
        М: 'M',
        Н: 'N',
        О: 'O',
        П: 'P',
        Р: 'R',
        С: 'S',
        Т: 'T',
        У: 'U',
        В: 'V',
        З: 'Z',
    }

    let result = text
    for (const [cyr, lat] of Object.entries(digraphs)) {
        result = result.split(cyr).join(lat)
    }
    for (const [cyr, lat] of Object.entries(monographs)) {
        result = result.split(cyr).join(lat)
    }

    return result
}
