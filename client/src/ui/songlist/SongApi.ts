export type Song = {
    name: string
}

class SongApi {
    private static SERVER_URL: String = 'http://localhost:8080';

    async list(): Promise<Array<Song>> {
        const response = await fetch(`${SongApi.SERVER_URL}/song/`);
        return response.json();
    }
}

export default new SongApi();