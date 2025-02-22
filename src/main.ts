import "ress";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import { VueMaskDirective } from "v-mask";
import "@/styles/global.css";

const app = createApp(App);

app.directive("mask", VueMaskDirective);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Notify },
});
app.mount("#app");
