import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOnTheAirSeries,
  getPopularSeries,
  getTopRatedSeries,
  GetSeriesResult,
} from "../api";
import { Container, SliderContent, Inner } from "./Home";
import Banner from "../components/Banner";
import Slider from "../components/Slider";
import Loading from "../components/Loading";

const Series = () => {
  const { data: popularData, isLoading: popularLoading } =
    useQuery<GetSeriesResult>({
      queryKey: ["popular"],
      queryFn: getPopularSeries,
    });
  const { data: onTheAirData, isLoading: onTheAirLoading } =
    useQuery<GetSeriesResult>({
      queryKey: ["onTheAir"],
      queryFn: getOnTheAirSeries,
    });
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<GetSeriesResult>({
      queryKey: ["topRatedSeries"],
      queryFn: getTopRatedSeries,
    });

  return (
    <Container>
      {popularLoading || onTheAirLoading || topRatedLoading ? (
        <Loading />
      ) : (
        <>
          <Banner data={popularData} />
          <Inner>
            <SliderContent>
              <h4>인기 드라마</h4>
              <Slider data={popularData} />
            </SliderContent>
            <SliderContent>
              <h4>현재 상영 중인 드라마</h4>
              <Slider data={onTheAirData} />
            </SliderContent>
            <SliderContent>
              <h4>평점 높은 드라마</h4>
              <Slider data={topRatedData} />
            </SliderContent>
          </Inner>
        </>
      )}
    </Container>
  );
};

export default Series;
