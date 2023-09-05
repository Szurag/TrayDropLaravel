function base64Encode(plainText) {
    let plainTextBytes = new TextEncoder().encode(plainText);
    return btoa(String.fromCharCode(...plainTextBytes));
}

function cipher(ch, key) {
    if (!/[a-zA-Z]/.test(ch)) return ch;

    const offset =
        ch.toUpperCase() === ch ? "A".charCodeAt(0) : "a".charCodeAt(0);
    return String.fromCharCode(
        ((ch.charCodeAt(0) + key - offset + 26) % 26) + offset,
    );
}

function encipher(input, key) {
    let output = "";

    for (let i = 0; i < input.length; i++) {
        output += cipher(input[i], key);
    }

    return output;
}

export default function hashPassword(plainText) {
    let encodedText = encipher(base64Encode(encipher(plainText, 7)), 13);
    let hexString = Array.from(encodedText)
        .map((char) => char.charCodeAt(0).toString(16))
        .join("");
    return encipher(hexString, 3);
}
