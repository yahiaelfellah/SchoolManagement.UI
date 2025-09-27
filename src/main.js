import { createApp, watch } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import SoftUIDashboard from "./soft-ui-dashboard";
import { createI18n } from "vue-i18n";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const messages = {
	ar,
	en,
	fr,
};

const i18n = createI18n({
	legacy: false,
	locale: "fr",
	fallbackLocale: "en",
	messages,
});

const app = createApp(App);
app.use(store).use(router).use(SoftUIDashboard).use(i18n);

// set document language and direction based on selected locale
function applyLangDir(locale) {
	document.documentElement.lang = locale || "ar";
	document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

applyLangDir(i18n.global.locale.value);

// react to runtime locale changes
if (i18n.global && i18n.global.locale && i18n.global.locale.__ob__ === undefined) {
	// composition API ref
	i18n.global.locale.value && i18n.global.locale;
}

// watch locale changes
watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    applyLangDir(newLocale);
  }
);

app.mount("#app");
