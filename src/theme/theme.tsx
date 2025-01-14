import { createTheme, CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { componentsOverrides } from "@theme/overrides/componentsOverrides";
import { palette } from './overrides/palette';
import { appFonts, typography } from './overrides/typography';
import * as muiLocales from "@mui/material/locale";
import { scrollbar } from "@theme/overrides/scrollbar";
import { useConfig } from "@hooks/useConfig";
import { RtlProvider } from "@theme/RtlProvider";

export const locales = muiLocales;

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const [{paletteMode, rtl, locale}] = useConfig();

  const theme = useMemo(() =>
      createTheme({
        palette: palette[paletteMode],
        direction: rtl ? 'rtl' : 'ltr',
        typography
      }, locales[locale]), [locale, paletteMode, rtl]);

  theme.components = {
    MuiCssBaseline: {
      styleOverrides: `
        ${appFonts}
        body {
          ${scrollbar({thickness: '10px', radius: '10px', trackColor: '#f5f5f5', thumbColor: '#949494'})};
          background-color: ${theme.palette.background.default};
        }
      `
    },
    ...componentsOverrides(theme)
  };

  useEffect(() => {
    document.documentElement.setAttribute("dir", rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute("lang", locale.substring(0, 2));
  }, [rtl, locale]);

  return (
      <MUIThemeProvider theme={theme}>
        <RtlProvider>
          <CssBaseline/>
          {children}
        </RtlProvider>
      </MUIThemeProvider>
  );
}
