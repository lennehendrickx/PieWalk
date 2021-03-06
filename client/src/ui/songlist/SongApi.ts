export type Metadata = {
    title?: string;
    genre?: string;
    composer?: string;
    album?: string;
    releaseDate?: string;
    artist?: string;
    duration?: string;
};

export type Track = {
    name: string;
    src: string;
};

export type Song = {
    name: string;
    src: string;
    tracks: Array<Track>;
    metadata?: Metadata;
};

class SongApi {
    private static SERVER_URL: String = 'http://localhost:8080';

    async list(): Promise<Array<Song>> {
        const response = await fetch(`${SongApi.SERVER_URL}/song/`);
        return response.json();
    }
}

export default new SongApi();
