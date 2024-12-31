import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bg from "../assets/images/login-background.jpg";
import Form from "../components/Form";
import { UserData, userDataAtom } from "../atoms";
import { useSetRecoilState } from "recoil";

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1),
      transparent,
      rgba(0, 0, 0, 1)
    ),
    url(${bg}) center/cover no-repeat;
`;

const Login = () => {
  const navigate = useNavigate();
  const setUserData = useSetRecoilState(userDataAtom);

  const handleLogin = (data: UserData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user: UserData) =>
        user.userId === data.userId && user.password === data.password
    );

    if (!user) {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      return;
    }

    navigate("/");
    setUserData(user);
  };

  return (
    <Container>
      <Form type="login" onSubmit={handleLogin} />
    </Container>
  );
};

export default Login;
