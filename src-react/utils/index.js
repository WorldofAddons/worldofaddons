const themeMapPrimary = {
    light: 'light-theme-primary',
    dark: 'dark-theme-primary'
}

const themeMapSecondary = {
    light: '',
    dark: ''
}

export const getThemePrimary = (theme) => themeMapPrimary[theme]
export const getThemeSecondary = (theme) => themeMapSecondary[theme]
