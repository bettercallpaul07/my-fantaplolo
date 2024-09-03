// plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faUsers, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlusCircle, faTrashAlt, faHome, faSearch, faUsers)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})