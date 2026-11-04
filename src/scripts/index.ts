import { initClickHandler } from './clickHandler'
import { initLanguage } from './language'
import { initNavHighlight } from './navHighlight'
import { initSolarSystem } from './solarSystem'

// TODO: Loading spinner or before font and scripts are loaded? Fade in after loading is done?
initLanguage()
initClickHandler()
initNavHighlight()
initSolarSystem()
