import { Movie, Series } from "../api";

export const isMovie = (
  content: Movie | Series | undefined
): content is Movie => {
  return content ? "title" in content : false;
};

export const getTitle = (content: Movie | Series | undefined) => {
  if (!content) return "";
  return isMovie(content) ? content.title : content.name;
};

export const getReleaseDate = (content: Movie | Series | undefined) => {
  if (!content) return "";
  return isMovie(content)
    ? content.release_date?.slice(0, 4)
    : content.first_air_date?.slice(0, 4);
};
