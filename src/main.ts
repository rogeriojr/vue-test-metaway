import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { VueMaskDirective } from "v-mask";

const app = createApp(App);

app.directive("mask", VueMaskDirective);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
