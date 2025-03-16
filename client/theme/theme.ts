import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

export const LightTheme: MD3Theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#6750A4",
        onPrimary: "#FFFFFF",
        secondary: "#625B71",
        onSecondary: "#FFFFFF",
        background: "#FFFFFF",
        onBackground: "#1C1B1F",
        surface: "#FFFFFF",
        onSurface: "#1C1B1F",
        error: "#B3261E",
        onError: "#FFFFFF",
        outline: "#79747E",
    },
    roundness: 8,
};

export const DarkTheme: MD3Theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#BB86FC",
        background: "#121212",
        surface: "#1E1E1E",
        onSurface: "#FFFFFF",
        secondary: "#03DAC6",
    },
};
