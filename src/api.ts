const API_KEY = `9d225e9b7320979a865e24a4c79106ea`;
const BASE_PATH = `https://api.themoviedb.org/3`;

// Content Data Type
export interface ContentBase {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}
export interface Movie extends ContentBase {
  title: string;
  original_title: string;
  release_date: string;
}
export interface Series extends ContentBase {
  name: string;
  original_name: string;
  first_air_date: string;
}
export interface GetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export interface GetSeriesResult {
  page: number;
  results: Series[];
  total_pages: number;
  total_results: number;
}

// Movies
export const getPopularMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/popular?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getNowPlayingMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/now_playing?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getTopRatedMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/top_rated?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getUpcomingMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/upcoming?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const searchContentsMovies = (keyword: string | null) => {
  return fetch(
    `${BASE_PATH}/search/movie?language=ko-kr&api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
};

export const searchMovieGeneres = () => {
  return fetch(
    `${BASE_PATH}/genre/movie/list?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getReviewsMovies = (movieId: number | undefined) => {
  if (!movieId) return Promise.resolve({ results: [] });
  return fetch(
    `${BASE_PATH}/movie/${movieId}/reviews?language=en-US&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getVideosMovies = (movieId: number | undefined) => {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/videos?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

// Series
export const getPopularSeries = () => {
  return fetch(
    `${BASE_PATH}/tv/popular?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getOnTheAirSeries = () => {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getTopRatedSeries = () => {
  return fetch(
    `${BASE_PATH}/tv/top_rated?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const searchContentsSeries = (keyword: string | null) => {
  return fetch(
    `${BASE_PATH}/search/tv?language=ko-kr&api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
};

export const searchSeriesGeneres = () => {
  return fetch(
    `${BASE_PATH}/genre/tv/list?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getReviewsSeries = (seriesId: number | undefined) => {
  if (!seriesId) return Promise.resolve({ results: [] });
  return fetch(
    `${BASE_PATH}/tv/${seriesId}/reviews?language=en-US&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getVideosSeries = (seriesId: number | undefined) => {
  return fetch(
    `${BASE_PATH}/tv/${seriesId}/videos?language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};
