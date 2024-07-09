import styled from 'styled-components';

interface SigningInProps {
    signingIn: boolean;
}
const colors = {
    lightestBlue: '#D8DFF2',
    lighterBlue: '#B3BBE5',
    lightBlue: '#8E98D8',
    mediumBlue: '#6975CB',
    darkMediumBlue: '#4D5BAE',
    darkBlue: '#33408F',
    darkerBlue: '#1A2670',
    darkestBlue: '#000F51',
};
export const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Montserrat', sans-serif;
    height: 100vh;
    margin: -20px 0 50px;
`;

export const Container = styled.div`
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 678px;
    max-width: 100%;
    min-height: 500px; /* Increased min-height */
`;

export const SignUpContainer = styled.div<SigningInProps>`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    ${({signingIn}) =>
        !signingIn
            ? `
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  `
            : null}
`;

export const SignInContainer = styled.div<SigningInProps>`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 2;
    ${({signingIn}) => (!signingIn ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align items at the top */
    flex-direction: column;
    padding: 100px 50px; /* Adjusted padding */
    height: 100%;
    text-align: center;
    overflow-y: auto; /* Added overflow-y for scrolling */
`;

export const Title = styled.h1`
    font-weight: bold;
    margin: 0;
`;

export const Input = styled.input`
    background-color: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
`;

export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid ${colors.darkBlue};
    background-color: ${colors.darkBlue};
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active {
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
`;

export const GhostButton = styled(Button)`
    background-color: transparent;
    border-color: #ffffff;
`;

export const Anchor = styled.a`
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
`;

export const OverlayContainer = styled.div<SigningInProps>`
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
    ${({signingIn}) => (!signingIn ? `transform: translateX(-100%);` : null)}
`;

export const Overlay = styled.div<SigningInProps>`
    background: ${colors.mediumBlue};
    background: -webkit-linear-gradient(
        to right,
        ${colors.darkBlue},
        ${colors.mediumBlue}
    );
    background: linear-gradient(
        to right,
        ${colors.darkBlue},
        ${colors.mediumBlue}
    );
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #ffffff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    ${({signingIn}) => (!signingIn ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)<SigningInProps>`
    transform: translateX(-20%);
    ${({signingIn}) => (!signingIn ? `transform: translateX(0);` : null)}
`;

export const RightOverlayPanel = styled(OverlayPanel)<SigningInProps>`
    right: 0;
    transform: translateX(0);
    ${({signingIn}) => (!signingIn ? `transform: translateX(20%);` : null)}
`;

export const Paragraph = styled.p`
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
`;
