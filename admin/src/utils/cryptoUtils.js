import CryptoJS from "crypto-js";

const SECRET_KEY = "my-super-secret-key"; 

// Encrypt data
export const encryptedData = (data) => {
    try {
        // Make sure the data is a string
        const dataString = typeof data === "string" ? data : JSON.stringify(data);

        const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
        return encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

// Decrypt data
export const decryptedData = (encryptedData) => {
    try {
        // Decrypt the data
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        // Ensure that the decryption result is valid UTF-8
        if (!decryptedString) {
            throw new Error("Decryption error: Malformed data or invalid key");
        }

        // Try to parse the result as JSON if it looks like JSON data
        try {
            return JSON.parse(decryptedString);
        } catch (error) {
            return decryptedString;  // If it's not JSON, just return the plain string
        }
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};
