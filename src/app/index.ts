import { createApp } from "vue";
import App from "./index.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@egjs/vue3-flicking/dist/flicking.css";

const pinia = createPinia();

export const app = createApp(App).use(router).use(pinia);
