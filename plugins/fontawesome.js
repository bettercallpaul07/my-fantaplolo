// plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faUsers, faPlusCircle, faTrashAlt, faPlus, faStar, faRobot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faPlusCircle, faTrashAlt, faHome, faSearch, faUsers, faPlus, faStar, faRobot)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})