const themeMapPrimary = {
    light: 'light-theme-primary',
    dark: 'dark-theme-primary'
}

const themeMapSecondary = {
    light: '',
    dark: 'dark-theme-secondary'
}

const themeMapInput = {
    light: '',
    dark: 'dark-theme-input'
}

export const getThemePrimary = (theme) => themeMapPrimary[theme]
export const getThemeSecondary = (theme) => themeMapSecondary[theme]
export const getThemeInput = (theme) => themeMapInput[theme]
