import React, { useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import styled, { useTheme } from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = () => {
  const theme = useTheme();
  return (
    <Container>
      <BarLoader color={theme.white.darker} width={100} height={5} />
    </Container>
  );
};

export default Loading;
