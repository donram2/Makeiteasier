import styled from "styled-components";

export interface CardProps {
    isNav?: boolean;
    radius?: number;
}

const Card = styled.div<CardProps>`
<<<<<<< HEAD
  border: 1px solid
  ${(props) => (props.isNav ? "none" : props.theme.color.bd_gray)};
  border-bottom: 1px solid
  ${(props) => (props.isNav ? props.theme.color.bd_gray : "none")};
  border-radius: ${(props) => props.radius + "px"};
  background-color: ${(props) => props.theme.color.bg_white};
=======
    border: 1px solid
        ${(props) => (props.isNav ? "none" : props.theme.color.bd_gray)};
    border-bottom: 1px solid
        ${(props) => (props.isNav ? props.theme.color.bd_gray : "none")};
    border-radius: ${(props) => props.radius + "px"};
    background-color: ${(props) => props.theme.color.bg_white};
>>>>>>> origin/feature/home-redux
`;

Card.defaultProps = {
    isNav: false,
    radius: 3,
};

export default Card;