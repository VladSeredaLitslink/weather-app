import { createApp } from "vue";
import "reset-css";
import { VueQueryPlugin } from "vue-query";
import "@fontsource/montserrat";
import "virtual:windi.css";

import App from "./App.vue";

const app = createApp(App);

app.use(VueQueryPlugin);
app.mount("#app");
