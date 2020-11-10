export interface AudioLoader {
    load(path: string): Promise<ArrayBuffer>;
}

export class FetchAudioLoader implements AudioLoader {
    private static SERVER_URL: String = 'http://localhost:8080';

    async load(path: string): Promise<ArrayBuffer> {
        const response = await fetch(`${FetchAudioLoader.SERVER_URL}/song/${path}`);
        return await response.arrayBuffer();
    }
}
