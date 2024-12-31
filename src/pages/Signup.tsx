import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Form from "../components/Form";
import { UserData } from "../atoms";

// Styled
const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (data: UserData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((user: UserData) => user.userId === data.userId)) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));

    alert("회원가입이 완료되었습니다.");
    navigate("/login");
  };

  return (
    <Container>
      <Form type="signup" onSubmit={handleSignup} />
    </Container>
  );
};

export default Signup;
