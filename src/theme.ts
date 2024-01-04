import { ThemeConfig, defineStyle, defineStyleConfig, extendTheme } from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { adjustBrightness, hexToRgba } from './utils';
import Twa from '@twa-dev/sdk';
import { StyleFunctionProps, mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

// Telegram theme colours as of 09/10/2023
export const tgColors = {
  dark: {
    bg_color: '#18222d',
    button_color: '#2ea6ff',
    button_text_color: '#ffffff',
    hint_color: '#b1c3d5',
    link_color: '#62bcf9',
    secondary_bg_color: '#131415',
    text_color: '#ffffff',
  },

  light: {
    bg_color: '#ffffff',
    button_color: '#2481cc',
    button_text_color: '#ffffff',
    hint_color: '#999999',
    link_color: '#2481cc',
    secondary_bg_color: '#efeff3',
    text_color: '#000000',
  },
};

export function twaMode(light: string | undefined, dark: string | undefined) {
  if (!Twa.colorScheme) return light;
  return Twa.colorScheme === 'light' ? light : dark;
}

export function setTwaBg(color: 'bg_color' | 'secondary_bg_color') {
  if (!Twa) return;

  Twa.setHeaderColor(color);
  Twa.setBackgroundColor(color);
}

export const colors = {
  bg_color: Twa.themeParams.bg_color || twaMode(tgColors.light.bg_color, tgColors.dark.bg_color),
  button_color:
    Twa.themeParams.button_color ||
    twaMode(tgColors.light.button_color, tgColors.dark.button_color),
  button_text_color:
    Twa.themeParams.button_text_color ||
    twaMode(tgColors.light.button_text_color, tgColors.dark.button_text_color),
  hint_color:
    Twa.themeParams.hint_color || twaMode(tgColors.light.hint_color, tgColors.dark.hint_color),
  link_color:
    Twa.themeParams.link_color || twaMode(tgColors.light.link_color, tgColors.dark.link_color),
  secondary_bg_color:
    Twa.themeParams.secondary_bg_color ||
    twaMode(tgColors.light.secondary_bg_color, tgColors.dark.secondary_bg_color),
  secondary_bg_color2: twaMode('rgba(116, 116, 128, 0.08)', 'rgba(116, 116, 128, 0.18);'),
  text_color:
    Twa.themeParams.text_color || twaMode(tgColors.light.text_color, tgColors.dark.text_color),
  border_color: twaMode('rgb(239, 239, 243);', '#3d3d3f'),
  button_disabed_color: twaMode('#999999', '#333333'),
  success: twaMode('#34c759', '#4cd964'),
};

const config: ThemeConfig = {
  initialColorMode: Twa.colorScheme,
  useSystemColorMode: false,
};

const secondary_button_color = hexToRgba(colors.button_color, 0.1);

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'ui-rounded',  sans-serif`,
    body: `'ui-rounded', sans-serif`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode(colors.text_color, colors.text_color)(props),
        backgroundColor: mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
      },
      a: {
        color: mode(colors.link_color, colors.link_color)(props),
      },
    }),
  },
  components: {
    Heading: defineStyleConfig({
      variants: {
        bodyTitle: {
          // 17px to rem
          fontSize: '1.0625rem',
          fontWeight: 'medium',
        },
      },
    }),
    Card: defineStyleConfig({
      baseStyle: (props) => ({
        backgroundColor: mode(colors.bg_color, colors.bg_color)(props),
        color: colors.text_color,
        borderRadius: '0.875rem',
      }),
    }),
    Text: defineStyleConfig({
      variants: {
        hint: (props) => ({
          color: mode(colors.hint_color, colors.hint_color)(props),
          fontSize: '0.9375rem',
        }),
        bodyText: {
          fontSize: '1.0625rem',
        },
      },
    }),
    Button: defineStyleConfig({
      defaultProps: {
        size: 'lg',
      },
      baseStyle: {
        width: '100%',
        borderRadius: '0.875rem',
        fontSize: '1rem',
      },
      variants: {
        primary: (props) => ({
          backgroundColor: mode(colors.button_color, colors.button_color)(props),
          color: mode(colors.button_text_color, colors.button_text_color)(props),
          _hover: {
            backgroundColor: adjustBrightness(
              mode(colors.button_color, colors.button_color)(props),
              -0.07
            ),
          },
          // This is ignored for some reason
          fontSize: '1rem',
        }),
        secondary: {
          backgroundColor: `var(--secondary-button-color, ${secondary_button_color})`,
          color: colors.button_color,
          _hover: {
            backgroundColor: `var(--secondary-button-color, ${secondary_button_color})`,
          },
          fontSize: '1rem',
        },
        icon: (props) => ({
          padding: '0.5rem',
          width: 'auto',
          height: 'auto',
          fontSize: '0.875rem',
          color: mode(colors.button_color, colors.button_color)(props),
          _hover: {
            color: adjustBrightness(mode(colors.button_color, colors.button_color)(props), -0.1),
          },
        }),
      },
    }),
    Input: defineMultiStyleConfig({
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: definePartsStyle((props: StyleFunctionProps) => ({
          field: {
            backgroundColor: mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
            borderRadius: '0.875rem',
            _placeholder: {
              color: mode(colors.hint_color, colors.hint_color)(props),
            },
            _hover: {
              backgroundColor: adjustBrightness(
                mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
                -0.07
              ),
            },
            _active: {
              backgroundColor: adjustBrightness(
                mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
                -0.07
              ),
            },
            _focus: {
              backgroundColor: adjustBrightness(
                mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
                -0.07
              ),
            },
            _dark: {
              backgroundColor: mode(colors.secondary_bg_color, colors.secondary_bg_color)(props),
            },
          },
        })),
        inverted: definePartsStyle((props: StyleFunctionProps) => ({
          field: {
            backgroundColor: mode(colors.bg_color, colors.bg_color)(props),
            borderRadius: '0.875rem',
            _placeholder: {
              color: mode(colors.hint_color, colors.hint_color)(props),
            },
            _hover: {
              backgroundColor: adjustBrightness(
                mode(colors.bg_color, colors.bg_color)(props),
                -0.01
              ),
            },
            _active: {
              backgroundColor: adjustBrightness(
                mode(colors.bg_color, colors.bg_color)(props),
                -0.01
              ),
            },
            _focus: {
              backgroundColor: adjustBrightness(
                mode(colors.bg_color, colors.bg_color)(props),
                -0.01
              ),
            },
            _dark: {
              backgroundColor: mode(colors.bg_color, colors.bg_color)(props),
            },
          },
        })),
      },
    }),
    Divider: defineStyleConfig({
      variants: {
        thick: defineStyle({
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: 'gray.400',
          borderRadius: 6,
        }),
      },
    }),
    Icon: defineStyleConfig({
      baseStyle: {
        fontSize: '2xl',
      },
    }),
  },
});
