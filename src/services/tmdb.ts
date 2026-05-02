import { TMDB_BASE_URL, TMDB_TOKEN } from '../constants';

const options = {
  method: 'GET',
  cache: 'no-store' as RequestCache,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
  original_language?: string;
  seasons?: Season[];
}

const filterSafe = (results: any[]) => {
  return results.filter(item => !item.adult);
};

export const fetchTrendingMovies = async (): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?language=en-US&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results).map((item: Media) => ({ ...item, media_type: 'movie' }));
};

export const fetchPopularTV = async (): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/tv/popular?language=en-US&page=1&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results).map((item: Media) => ({ ...item, media_type: 'tv' }));
};

export const fetchTopRated = async (): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?language=en-US&page=1&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results).map((item: Media) => ({ ...item, media_type: 'movie' }));
};

export const fetchMovieDetails = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Media> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?language=en-US&_t=${ts}`, options);
  const data = await res.json();
  return data;
};

export const searchMedia = async (query: string): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1&_t=${ts}`, options);
  const data = await res.json();
  // Filter out people and adult content
  return filterSafe(data.results).filter((item: Media) => item.media_type !== 'person');
};

export const fetchAnime = async (): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&language=en-US&page=1&include_adult=false&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results).map((item: Media) => ({ ...item, media_type: 'tv' }));
};

export const fetchCartoons = async (): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/discover/tv?with_genres=16&without_original_language=ja&sort_by=popularity.desc&language=en-US&page=1&include_adult=false&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results).map((item: Media) => ({ ...item, media_type: 'tv' }));
};

export const fetchProviders = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<any> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}/watch/providers?_t=${ts}`, options);
  const data = await res.json();
  const usProviders = data.results?.US;
  return usProviders;
};

export const fetchSimilar = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Media[]> => {
  const ts = Date.now();
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}/similar?language=en-US&page=1&_t=${ts}`, options);
  const data = await res.json();
  return filterSafe(data.results);
};
