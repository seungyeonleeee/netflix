import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  GetMoviesResult,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  Movie,
} from "../api";
import Slider from "../components/Slider";
import Banner from "../components/Banner";
import Loading from "../components/Loading";

// Styled
export const Container = styled.main`
  width: 100%;
`;
export const Inner = styled.section`
  width: var(--inner-width);
  margin: 0 auto;
  @media (max-width: 1150px) {
    padding: 0 2vw;
  }
`;
export const SliderContent = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 60px 0;
  h4 {
    color: ${({ theme }) => theme.white.lighter};
    font-size: 2.4rem;
    font-weight: 700;
  }
`;
export const Loader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.red};
  font-size: 22px;
`;

const Home = () => {
  const { data: popularData, isLoading: popularLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["popular"],
      queryFn: getPopularMovies,
    });
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["nowPlaying"],
      queryFn: getNowPlayingMovies,
    });
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["topRated"],
      queryFn: getTopRatedMovies,
    });
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["upcoming"],
      queryFn: getUpcomingMovies,
    });

  return (
    <Container>
      {popularLoading ||
      nowPlayingLoading ||
      topRatedLoading ||
      upcomingLoading ? (
        <Loading />
      ) : (
        <>
          <Banner data={nowPlayingData} />
          <Inner>
            <SliderContent>
              <h4>지금 뜨는 영화</h4>
              <Slider data={popularData} />
            </SliderContent>
            <SliderContent>
              <h4>현재 상영 중인 영화</h4>
              <Slider data={nowPlayingData} />
            </SliderContent>
            <SliderContent>
              <h4>평점 높은 영화</h4>
              <Slider data={topRatedData} />
            </SliderContent>
            <SliderContent>
              <h4>개봉 예정 영화</h4>
              <Slider data={upcomingData} />
            </SliderContent>
          </Inner>
        </>
      )}
    </Container>
  );
};

export default Home;
