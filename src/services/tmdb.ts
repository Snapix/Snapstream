import { TMDB_BASE_URL, TMDB_TOKEN } from '../constants';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};

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
}

export const fetchTrendingMovies = async (): Promise<Media[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?language=en-US`, options);
  const data = await res.json();
  return data.results.map((item: Media) => ({ ...item, media_type: 'movie' }));
};

export const fetchPopularTV = async (): Promise<Media[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/tv/popular?language=en-US&page=1`, options);
  const data = await res.json();
  return data.results.map((item: Media) => ({ ...item, media_type: 'tv' }));
};

export const fetchTopRated = async (): Promise<Media[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?language=en-US&page=1`, options);
  const data = await res.json();
  return data.results.map((item: Media) => ({ ...item, media_type: 'movie' }));
};

export const fetchMovieDetails = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Media> => {
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?language=en-US`, options);
  const data = await res.json();
  return data;
};

export const searchMedia = async (query: string): Promise<Media[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`, options);
  const data = await res.json();
  // Filter out people
  return data.results.filter((item: Media) => item.media_type !== 'person');
};

export const fetchSimilar = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Media[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}/similar?language=en-US&page=1`, options);
  const data = await res.json();
  return data.results;
};
