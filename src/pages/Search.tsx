/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  searchContentsMovies,
  searchContentsSeries,
  GetMoviesResult,
  Movie,
  GetSeriesResult,
  Series,
} from "../api";
import { makeImagePath } from "../utils";
import Pagination from "react-js-pagination";
import { useSetRecoilState } from "recoil";
import { isModalAtom } from "../atoms";
import { getTitle } from "../utils/contentTypeChecker";
import Loading from "../components/Loading";
import { CiImageOff } from "react-icons/ci";
import { MdSearchOff } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { LuChevronsLeft } from "react-icons/lu";
import { LuChevronsRight } from "react-icons/lu";

// Styled
const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 100px 0;
  position: relative;
`;
const Inner = styled.section`
  width: var(--inner-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin: 5vh 0;
  @media (max-width: 1150px) {
    padding: 0 2vw;
    gap: 2vw;
  }
  @media (max-width: 965px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 3vw;
  }
`;
const SearchMovieBox = styled.article`
  cursor: pointer;
  .search-movie-cover {
    width: 100%;
    height: 330px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &.not-available {
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${({ theme }) => theme.black.lighter};
      svg {
        width: 40%;
        height: 40%;
        color: ${({ theme }) => theme.black.darker};
      }
    }
    &:hover {
      img {
        transform: scale(1.04);
      }
    }
  }
  .search-movie-title {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.white.darker};
  }
`;
const StyledPagination = styled.div`
  position: absolute;
  left: 50%;
  bottom: 8vh;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  ul {
    display: flex;
    align-items: center;
    gap: 10px;
    li {
      a {
        display: inline-block;
        color: ${({ theme }) => theme.white.darker};
        font-size: 20px;
        transition: color 0.3s;
        &:hover {
          color: ${({ theme }) => theme.red};
        }
        &.active {
          color: ${({ theme }) => theme.red};
        }
      }
    }
  }
`;
const Empty = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 35vh 0;
  color: ${({ theme }) => theme.white.darker};
  svg {
    width: 100px;
    height: 100px;
  }
  span {
    font-size: 2rem;
    margin-left: -20px;
  }
`;

const Search = () => {
  // Search Keyword
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  // Modal
  const setModal = useSetRecoilState(isModalAtom);

  // Contents Data
  const { data: movieData, isLoading: movieLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["movies", keyword],
      queryFn: () => searchContentsMovies(keyword),
    });
  const { data: seriesData, isLoading: seriesLoading } =
    useQuery<GetSeriesResult>({
      queryKey: ["series", keyword],
      queryFn: () => searchContentsSeries(keyword),
    });
  const contentsData = {
    results: [...(movieData?.results || []), ...(seriesData?.results || [])],
  };
  const contentsLoading = movieLoading || seriesLoading;

  // Modal Open
  const onSearchBoxClick = (dataId: number) => {
    setModal({
      dataId,
      data: contentsData as GetMoviesResult | GetSeriesResult,
    });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(8);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFistMovie = indexOfLastMovie - moviesPerPage;
  const currentContents: (Movie | Series)[] =
    contentsData?.results.slice(indexOfFistMovie, indexOfLastMovie) || [];
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {contentsLoading ? (
        <Loading />
      ) : currentContents.length > 0 ? (
        <Container>
          <Inner>
            {currentContents?.map((content, index) => (
              <SearchMovieBox
                key={index}
                onClick={() => {
                  onSearchBoxClick(content.id);
                }}
              >
                <div
                  className={
                    content.backdrop_path
                      ? "search-movie-cover"
                      : "search-movie-cover not-available"
                  }
                >
                  {content.backdrop_path ? (
                    <img
                      src={makeImagePath(content.backdrop_path)}
                      alt={getTitle(content)}
                    />
                  ) : (
                    <CiImageOff />
                  )}
                </div>
                <h3 className="search-movie-title">{getTitle(content)}</h3>
              </SearchMovieBox>
            ))}
          </Inner>
          <StyledPagination>
            <Pagination
              onChange={handlePageChange}
              activePage={currentPage}
              activeLinkClass="active"
              itemsCountPerPage={moviesPerPage}
              totalItemsCount={contentsData?.results.length || 0}
              pageRangeDisplayed={5}
              prevPageText={<FiChevronLeft />}
              nextPageText={<FiChevronRight />}
              firstPageText={<LuChevronsLeft />}
              lastPageText={<LuChevronsRight />}
            />
          </StyledPagination>
        </Container>
      ) : (
        <Empty>
          <MdSearchOff />
          <span>검색 결과가 없습니다.</span>
        </Empty>
      )}
    </>
  );
};

export default Search;
