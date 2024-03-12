"use server"
import Mux from "@mux/mux-node"
const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

interface props{

}

export async function CreateToken( playbackId : string) {
    let baseOptions = {
        keyId: process.env.MUX_SIGNING_KEY, // Enter your signing key id here
        keySecret: process.env.MUX_SIGNING_KEY_SECRET!, // Enter your base64 encoded private key here
        expiration: "7d", // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
    };
    

    const token = await mux.jwt.signPlaybackId(playbackId, {
        ...baseOptions,
        type: "video",
    });
    return token;
}