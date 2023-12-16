import React from 'react';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as LogoSVG } from '../assets/images/logo.svg';

const Logo = () => {
  const theme = useTheme();

  return (
    <LogoSVG
    width="150"
    height="100"
    viewBox="0 0 500 500"
    fill={theme.palette.grey[900]}
    xmlns="http://www.w3.org/2000/svg"
  />
  );
};

export default Logo;
