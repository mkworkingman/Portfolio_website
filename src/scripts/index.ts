import '@fontsource/montserrat'
import { initClickHandler } from './clickHandler'
import { initLanguage } from './language'

// TODO: Loading spinner or before font and scripts are loaded? Fade in after loading is done?
initLanguage()
initClickHandler()
