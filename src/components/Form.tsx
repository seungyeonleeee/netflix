import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserData } from "../atoms";

// Styled
const Container = styled.article`
  padding: 50px 70px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  @media (max-width: 720px) {
    width: 90vw;
    padding: 50px 5vw;
  }
`;
const FormTitle = styled.h1`
  font-size: 2.6rem;
  font-weight: 700;
  text-align: center;
`;
const FormSubTitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.white.darker};
  text-align: center;
  margin: 10px 0 20px;
`;
const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  input {
    width: 380px;
    padding: 14px 20px;
    border-radius: 5px;
    background: ${({ theme }) => theme.black.darker};
    font-size: 1.8rem;
  }
  input[type="submit"] {
    width: 380px;
    padding: 14px 20px;
    margin-top: 20px;
    border-radius: 5px;
    background: ${({ theme }) => theme.black.lighter};
    color: ${({ theme }) => theme.white.darker};
    font-size: 1.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    &.enabled {
      background: ${({ theme }) => theme.red};
      color: ${({ theme }) => theme.white.lighter};
    }
  }
  .form-message {
    font-size: 1.4rem;
    color: #ccc;
  }
  @media (max-width: 720px) {
    width: 100%;
    input {
      width: 100%;
    }
    input[type="submit"] {
      width: 100%;
    }
  }
`;
const MoveLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-top: 1px solid ${({ theme }) => theme.black.lighter};
  padding-top: 20px;
  font-size: 1.6rem;
  span {
    color: ${({ theme }) => theme.white.darker};
  }
  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.white.lighter};
    transition: color 0.3s;
    &:hover {
      color: ${({ theme }) => theme.red};
    }
  }
`;

// Type
interface FormProps {
  type: "login" | "signup";
  onSubmit: (data: any) => void;
}

const Form = ({ type, onSubmit }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = useForm<UserData>({
    mode: "onChange",
  });

  const password = watch("password");

  return (
    <Container>
      <FormTitle>{type === "login" ? "로그인" : "회원가입"}</FormTitle>
      {type === "signup" && (
        <FormSubTitle>
          아이디와 이메일로 간편하게 넷플릭스를 시작하세요!
        </FormSubTitle>
      )}
      <FormElement onSubmit={handleSubmit(onSubmit)}>
        {type === "login" ? (
          <>
            <input
              type="text"
              placeholder="아이디"
              {...register("userId", {
                required: {
                  value: true,
                  message: "아이디를 입력해주세요.",
                },
                minLength: {
                  value: 4,
                  message:
                    "영문 소문자 또는 영문 소문자, 숫자 조합 4자리 이상 입력해주세요.",
                },
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "영문 소문자와 숫자만 사용 가능합니다.",
                },
              })}
            />
            {errors.userId && (
              <span className="form-message">{errors.userId.message}</span>
            )}
            <input
              type="password"
              placeholder="비밀번호"
              {...register("password", {
                required: {
                  value: true,
                  message: "박필립스 입력해주세요.",
                },
                minLength: {
                  value: 6,
                  message: "영문 소문자, 숫자 조합 6자리 이상 입력해주세요.",
                },
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "영문 소문자와 숫자만 사용 가능합니다.",
                },
              })}
            />
            {errors.password && (
              <span className="form-message">{errors.password.message}</span>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="아이디"
              {...register("userId", {
                required: {
                  value: true,
                  message: "아이디를 입력해주세요.",
                },
                minLength: {
                  value: 4,
                  message:
                    "영문 소문자 또는 영문 소문자, 숫자 조합 4자리 이상 입력해주세요.",
                },
                maxLength: {
                  value: 12,
                  message:
                    "영문 소문자 또는 영문 소문자, 숫자 조합 12자리 이하 입력해주세요.",
                },
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "영문 소문자와 숫자만 사용 가능합니다.",
                },
              })}
            />
            {errors.userId && (
              <span className="form-message">{errors.userId.message}</span>
            )}
            <input
              type="password"
              placeholder="비밀번호"
              {...register("password", {
                required: {
                  value: true,
                  message: "비밀번호를 입력해주세요.",
                },
                minLength: {
                  value: 6,
                  message: "영문 소문자, 숫자 조합 6자리 이상 입력해주세요.",
                },
                maxLength: {
                  value: 15,
                  message: "영문 소문자, 숫자 조합 15자리 이하 입력해주세요.",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/,
                  message: "영문 소문자, 숫자 조합으로 입력해주세요.",
                },
              })}
            />
            {errors.password && (
              <span className="form-message">{errors.password.message}</span>
            )}
            <input
              type="password"
              placeholder="비밀번호 확인"
              {...register("passwordCheck", {
                required: {
                  value: true,
                  message: "비밀번호를 다시 입력해주세요.",
                },
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
            />
            {errors.passwordCheck && (
              <span className="form-message">
                {errors.passwordCheck.message}
              </span>
            )}
            <input
              type="email"
              placeholder="이메일"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
            />
            {errors.email && (
              <span className="form-message">{errors.email.message}</span>
            )}
          </>
        )}
        <input
          type="submit"
          className={isValid ? "enabled" : ""}
          value={type === "login" ? "로그인하기" : "가입하기"}
        />
      </FormElement>
      <MoveLink>
        <span>
          {type === "login"
            ? "아이디가 없으신가요?"
            : "이미 계정이 있으신가요?"}
        </span>
        <Link to={type === "login" ? "/signup" : "/login"}>
          {type === "login" ? "회원가입 하기" : "로그인 하기"}
        </Link>
      </MoveLink>
    </Container>
  );
};

export default Form;
