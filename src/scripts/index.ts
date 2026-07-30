import { initClickHandler } from './clickHandler'
import { initLanguage } from './language'
import { initToggleNavBar } from './navbar'

// TODO: Loading spinner before scripts are loaded?
initLanguage()
initToggleNavBar()
initClickHandler()
