import { initClickHandler } from './clickHandler'
import { initContactForm } from './contactForm'
import { initLanguage } from './language'
import { initNavHighlight } from './navHighlight'
import { initSolarSystem } from './solarSystem'

// TODO: Loading spinner or before font and scripts are loaded? Fade in after loading is done?
initLanguage()
initClickHandler()
initContactForm()
initNavHighlight()
initSolarSystem()
