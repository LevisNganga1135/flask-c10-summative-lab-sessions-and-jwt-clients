import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";
import { API_URL } from "../api";

function NavBar({ setUser }) {
  function handleLogoutClick() {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).finally(() => {
      localStorage.removeItem("token");
      setUser(null);
    });
  }

  return (
    <Wrapper>
      <Logo>
        <Link to="/">My App</Link>
      </Logo>
      <Nav>
        <Button>
          Do Something
        </Button>
        <Button variant="outline" onClick={handleLogoutClick}>
          Logout
        </Button>
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: deeppink;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default NavBar;
