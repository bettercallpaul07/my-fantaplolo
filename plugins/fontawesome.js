// plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faUsers, faPlusCircle, faTrashAlt, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlusCircle, faTrashAlt, faHome, faSearch, faUsers, faPlus, faStar)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})