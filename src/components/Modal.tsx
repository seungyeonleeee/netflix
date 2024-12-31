import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import {
  getVideosSeries,
  getVideosMovies,
  Movie,
  searchMovieGeneres,
  Series,
  getReviewsMovies,
  getReviewsSeries,
  searchSeriesGeneres,
} from "../api";
import { useQuery } from "@tanstack/react-query";
import YouTube from "react-youtube";
import { useRecoilState, useRecoilValue } from "recoil";
import { isModalAtom, userDataAtom } from "../atoms";
import bg from "../assets/images/login-background.jpg";
import { isMovie, getTitle, getReleaseDate } from "../utils/contentTypeChecker";
import Loading from "./Loading";

// Styled
const Container = styled(motion.section)`
  position: relative;
  z-index: 6;
`;
const ModalBox = styled(motion.article)`
  position: fixed;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 667px;
  height: 80vh;
  max-height: 700px;
  width: 90%;
  background: ${({ theme }) => theme.black.darker};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden auto;
  scrollbar-width: thin;
  scrollbar-color: #333 #111;
`;
const Overlay = styled(motion.article)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  svg {
    width: 100%;
    height: 100%;
    stroke: ${({ theme }) => theme.white.lighter};
    stroke-width: 1.5;
    transition: stroke 0.3s;
  }
  &:hover {
    svg {
      stroke: ${({ theme }) => theme.red};
    }
  }
`;
const MovieCover = styled(motion.div)`
  width: 100%;
  height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 101%;
    background: linear-gradient(
        30deg,
        rgb(24, 24, 24) 24%,
        rgba(24, 24, 24, 0) 56%
      ),
      linear-gradient(0deg, rgb(24, 24, 24) 4%, rgba(24, 24, 24, 0) 69%);
  }
`;
const ModalContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem 2.5rem 2.5rem;
  position: relative;
  .star-svg {
    fill: ${({ theme }) => theme.white.darker};
    stroke: ${({ theme }) => theme.white.darker};
    stroke-width: 1.2;
  }
`;
const MovieTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 500;
  position: absolute;
  top: -40px;
`;
const MovieInfo = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  li {
    background: ${({ theme }) => theme.black.lighter};
    color: ${({ theme }) => theme.white.darker};
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.4rem;
  }
`;
const MovieOverView = styled.p`
  font-size: 1.6rem;
  margin: 10px 0;
`;
const MovieVideoBox = styled.div`
  width: 100%;
  height: 400px;
`;
const MovieRateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.black.lighter};
  padding: 10px 15px;
  border-radius: 5px;
  .rate-box {
    .star-box {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
      svg {
        width: 25px;
        height: 25px;
      }
    }
    span {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.white.darker};
    }
  }
`;
const MovieReviewBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  li {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom: 1px solid ${({ theme }) => theme.black.lighter};
    padding-bottom: 10px;
    .review-star {
      display: flex;
      align-items: center;
      gap: 3px;
      svg {
        width: 15px;
        height: 15px;
      }
    }
    .review-author {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 1.2rem;
      color: ${({ theme }) => theme.white.darker};
    }
    .review-content {
      span {
        font-size: 1.4rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        &.collapsed {
          -webkit-line-clamp: 2;
        }
      }
      button {
        margin-top: 5px;
        color: ${({ theme }) => theme.white.darker};
        font-size: 1.2rem;
        text-decoration: underline;
        transition: color 0.3s;
        &:hover {
          color: ${({ theme }) => theme.red};
        }
      }
    }
  }
`;

// Motion Variants
const ModalVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
const MovieCoverVariants = {
  initial: {
    filter: "blur(10px)",
  },
  animate: {
    filter: "blur(0px)",
    transition: {
      delay: 0.3,
    },
  },
};

// Type
interface GenresItem {
  id: number;
  name: string;
}
interface ReviewContents {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}
interface VideoContents<T> {
  [key: number]: T[];
}

const Modal = () => {
  const navigate = useNavigate();
  // User Data
  const userData = useRecoilValue(userDataAtom);
  // Modal
  const [modal, setModal] = useRecoilState(isModalAtom);
  // Content Data
  const [videos, setVideos] = useState<VideoContents<string>>({});
  const [expandedReviews, setExpandedReviews] = useState<{
    [key: string]: boolean;
  }>({});
  const [reviewHeights, setReviewHeights] = useState<{ [key: string]: number }>(
    {}
  );
  const ids = modal.data?.results.map((content: Movie | Series) => content.id);
  const selectedContent = (modal.data?.results as (Movie | Series)[])?.find(
    (content) => content.id === +modal.dataId!
  );

  // Generes
  const { data: genereData, isLoading: genereLoading } = useQuery({
    queryKey: ["getGeneres"],
    queryFn: () =>
      isMovie(selectedContent) ? searchMovieGeneres() : searchSeriesGeneres(),
  });

  // Video
  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ["getVideos", ids],
    queryFn: () =>
      ids
        ? Promise.all(
            ids.map((id: number) =>
              isMovie(selectedContent)
                ? getVideosMovies(id)
                : getVideosSeries(id)
            )
          )
        : Promise.resolve([]),
    enabled: !!selectedContent?.id,
  });

  // Review
  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["getReview", selectedContent?.id],
    queryFn: () =>
      isMovie(selectedContent)
        ? getReviewsMovies(selectedContent?.id)
        : getReviewsSeries(selectedContent?.id),
    enabled: !!selectedContent?.id,
  });

  // Rating
  const formattedRating =
    Math.floor(Number(selectedContent?.vote_average?.toFixed(1)) / 2) || 1;
  const formattedReviews = reviewData?.results.map(
    (review: ReviewContents) => ({
      ...review,
      author_details: {
        ...review.author_details,
        rating:
          Math.floor(review.author_details.rating / 2) === 0
            ? 1
            : Math.floor(review.author_details.rating / 2),
      },
    })
  );

  // Review Expand
  const toggleReview = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Modal Close
  const onOverlayClick = () => {
    setModal({ dataId: null, data: null });
  };

  // Modal Close
  useEffect(() => {
    if (!userData.userId) {
      setModal({ dataId: null, data: null });
      navigate("/login");
    }
  }, [userData.userId, navigate, setModal]);

  // Video
  useEffect(() => {
    if (modal.data && videoData) {
      modal.data.results.forEach((content: Movie | Series) => {
        isMovie(content)
          ? getVideosMovies(content.id).then((data) => {
              if (data?.results) {
                const videoIds = data.results.map((video: any) => video.key);
                setVideos((prev) => ({
                  ...prev,
                  [content.id]: videoIds,
                }));
              }
            })
          : getVideosSeries(content.id).then((data) => {
              if (data?.results) {
                const videoIds = data.results.map((video: any) => video.key);
                setVideos((prev) => ({
                  ...prev,
                  [content.id]: videoIds,
                }));
              }
            });
      });
    }
  }, [modal.data, videoData]);

  // Review Heights Calculate
  useEffect(() => {
    if (reviewData?.results?.length > 0) {
      const timer = setTimeout(() => {
        const heights: { [key: string]: number } = {};
        reviewData.results.forEach((review: ReviewContents) => {
          const reviewContent = document.querySelector(
            `#review-${review.id} .review-content span`
          );
          if (reviewContent) {
            heights[review.id] = reviewContent.scrollHeight;
          }
        });
        setReviewHeights(heights);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [reviewData]);

  return (
    <Container
      variants={ModalVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Overlay onClick={onOverlayClick} />
      <ModalBox>
        {genereLoading || videoLoading || reviewLoading ? (
          <Loading />
        ) : (
          <>
            <MovieCover
              variants={MovieCoverVariants}
              initial="initial"
              animate="animate"
              style={{
                backgroundImage: userData.userId
                  ? `url(${makeImagePath(
                      selectedContent?.backdrop_path || ""
                    )})`
                  : `url(${bg})`,
              }}
            />
            <ModalContents>
              <MovieTitle>{getTitle(selectedContent)}</MovieTitle>
              <MovieInfo>
                <li>{getReleaseDate(selectedContent)}</li>
                <li>{selectedContent?.adult ? "18+" : "ALL"}</li>
                {selectedContent?.genre_ids.map((id: number) => (
                  <li key={id}>
                    {
                      genereData?.genres.find(
                        (item: GenresItem) => item.id === id
                      )?.name
                    }
                  </li>
                ))}
              </MovieInfo>

              {selectedContent?.overview && (
                <MovieOverView>{selectedContent?.overview}</MovieOverView>
              )}
              {selectedContent?.id !== undefined &&
                videos[selectedContent.id]?.length > 0 && (
                  <MovieVideoBox>
                    <YouTube
                      videoId={videos[selectedContent?.id][0]}
                      opts={{
                        width: "100%",
                        height: "400px",
                      }}
                    />
                  </MovieVideoBox>
                )}
              <MovieRateBox>
                <div className="rate-box">
                  <div className="star-box">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="star-svg"
                        viewBox="0 0 24 24"
                        key={index}
                        fillOpacity={index >= formattedRating ? 0 : 1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span>
                    {selectedContent?.vote_count?.toLocaleString("ko-kr")}개
                    평점
                  </span>
                </div>
                <h4>{selectedContent?.vote_average?.toFixed(2)}</h4>
              </MovieRateBox>
              {formattedReviews?.length > 0 && (
                <MovieReviewBox>
                  {formattedReviews.map((review: ReviewContents) => (
                    <li key={review.id} id={`review-${review.id}`}>
                      <div className="review-star">
                        {Array.from({ length: 5 }, (_, index) => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="star-svg"
                            viewBox="0 0 24 24"
                            key={index}
                            fillOpacity={
                              index >= review.author_details.rating ? 0 : 1
                            }
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                          </svg>
                        ))}
                      </div>
                      <div className="review-author">
                        <span>{review.author}</span>
                        &middot;
                        <span>{review.created_at.slice(0, 10)}</span>
                      </div>
                      <div className="review-content">
                        <span
                          className={
                            !expandedReviews[review.id] ? "collapsed" : ""
                          }
                        >
                          {review.content}
                        </span>
                        {reviewHeights[review.id] > 36.38 && (
                          <button onClick={() => toggleReview(review.id)}>
                            {expandedReviews[review.id] ? "접기" : "더보기"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </MovieReviewBox>
              )}
            </ModalContents>
            <CloseButton onClick={onOverlayClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </CloseButton>
          </>
        )}
      </ModalBox>
    </Container>
  );
};

export default React.memo(Modal);
