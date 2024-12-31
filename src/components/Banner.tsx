import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { GetMoviesResult, GetSeriesResult } from "../api";
import { useSetRecoilState } from "recoil";
import { isModalAtom } from "../atoms";
import { getTitle } from "../utils/contentTypeChecker";

const Container = styled(motion.section)<{ $bgPhoto: string | undefined }>`
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1),
      transparent,
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.$bgPhoto}) center/cover no-repeat;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
`;
const Inner = styled.article`
  width: var(--inner-width);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  position: relative;
  @media (max-width: 1150px) {
    width: 100%;
    padding: 0 2vw;
  }
`;
const Title = styled(motion.h2)`
  font-size: 6rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  @media (max-width: 965px) {
    font-size: 4rem;
  }
`;
const Overview = styled(motion.p)`
  width: 60%;
  font-size: 2rem;
  word-break: keep-all;
  @media (max-width: 965px) {
    width: 100%;
    font-size: 1.6rem;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const Button = styled.div`
  width: 180px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.red};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  span {
    font-size: 2rem;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    left: 0;
    transition: background 0.3s ease-in-out;
  }
  &:hover,
  &:active {
    &::after {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

const ContainerVariants = {
  initial: {
    opacity: 0,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
    },
  },
};

const textVariants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

const Banner = ({
  data,
}: {
  data: GetMoviesResult | GetSeriesResult | undefined;
}) => {
  // Modal
  const setModal = useSetRecoilState(isModalAtom);
  // Content Data
  const [randomContent, setRandomContent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data?.results) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setRandomContent(randomIndex);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [data]);

  const onBannerClick = () => {
    if (data?.results[randomContent]) {
      setModal({ dataId: data.results[randomContent].id, data });
    }
  };

  return (
    <Container
      onClick={onBannerClick}
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
      key={randomContent}
      $bgPhoto={makeImagePath(
        data?.results[randomContent]?.backdrop_path || ""
      )}
    >
      <Inner>
        <Title
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          {getTitle(data?.results[randomContent])}
        </Title>
        <Overview
          variants={textVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
        >
          {data?.results[randomContent]?.overview}
        </Overview>
        <Button>
          <span>자세히 보기</span>
        </Button>
      </Inner>
    </Container>
  );
};

export default React.memo(Banner);
