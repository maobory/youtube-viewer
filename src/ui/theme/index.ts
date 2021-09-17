import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { grey } from '@mui/material/colors';
import { light, dark } from '@mui/material/styles/createPalette';
import './fonts';

declare module '@mui/material/styles' {
  interface CustomColors {
    grey: string;
    silver: string;
    lightGrey: string;
    darkGrey: string;
    inputBorder: string;
    lightBorder: string;
    transparentBorder: string;
  }
  interface Palette {
    custom: CustomColors;
  }
  interface PaletteOptions {
    custom: CustomColors;
  }
}

const useTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: '#e9321a',
        main: '#f21718',
        dark: '#b81112',
      },
      secondary: {
        light: '#1a88ff',
        main: '#007bff',
        dark: '#006fe6',
      },
      custom: mode === 'light' ? {
        grey: '#f4f4f4',
        silver: '#eee',
        lightGrey: '#fafafa',
        darkGrey: grey[800],
        inputBorder: 'rgba(0, 0, 0, 0.23)',
        lightBorder: light.divider,
        transparentBorder: 'transparent',
      } : {
        grey: 'transparent',
        silver: 'transparent',
        lightGrey: 'transparent',
        darkGrey: grey[100],
        inputBorder: 'rgba(255, 255, 255, 0.23)',
        lightBorder: 'rgba(255, 255, 255, 0.23)',
        transparentBorder: dark.divider,
      },
    },
  });

export default useTheme;
