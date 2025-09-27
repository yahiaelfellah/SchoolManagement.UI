<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
    </div>
  </div>
  <main class="mt-0 main-content main-content-bg">
    <section>
      <div class="page-header min-vh-75">
        <div class="container">
          <div :class="layoutClasses">
            <div class="signin-panel d-flex flex-column align-items-stretch justify-content-center w-100">
              <div class="card card-plain mx-auto mt-4" style="max-width:420px; width:100%">
                <div class="pb-0 card-header text-start">
                  <h3 class="font-weight-bolder text-info text-gradient">{{ $t('signin.welcome') }}</h3>
                  <p class="mb-0">{{ $t('signin.instruction') }}</p>
                </div>
                <div class="card-body">
                  <form role="form" class="text-start" @submit.prevent="onSubmit">
                    <label>{{ $t('signin.email') }}</label>
                    <vsud-input v-model="form.email" type="email" :placeholder="$t('signin.email')" name="email" />
                    <label>{{ $t('signin.password') }}</label>
                    <vsud-input v-model="form.password" type="password" :placeholder="$t('signin.password')" name="password" />
                    <vsud-switch id="rememberMe" v-model="form.remember" checked>{{ $t('signin.remember') }}</vsud-switch>
                    <div class="text-center">
                      <vsud-button
                        type="submit"
                        class="my-4 mb-2"
                        variant="gradient"
                        color="info"
                        full-width
                      >{{ $t('signin.signin') }}</vsud-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="signin-visual d-none d-md-flex align-items-center justify-content-center w-100">
              <div
                class="signin-image bg-cover"
                :style="{
                  backgroundImage: `url(${bgImg})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  height: '100%',
                  backgroundPosition: isRtl ? 'left center' : 'right center'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <!-- <app-footer /> -->
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudSwitch.vue";
import VsudButton from "@/components/VsudButton.vue";
import { login } from "@/auth";
import bgImg from "@/assets/brand/sanefer.png"
const body = document.getElementsByTagName("body")[0];

export default {
  name: "SigninPage",
  components: {
    Navbar,
    AppFooter,
    VsudInput,
    VsudSwitch,
    VsudButton,
  },
  data() {
    return {
      bgImg,
      form: {
        email: "",
        password: "",
        remember: true,
      },
    };
  },
  computed: {
    isRtl() {
      return document.documentElement.dir === "rtl" || document.documentElement.lang === "ar";
    },
    layoutClasses() {
      return [
        'd-flex',
        'flex-column',
        'flex-md-row',
        'align-items-stretch',
        this.isRtl ? 'flex-md-row-reverse' : ''
      ].join(' ');
    }
  },
  beforeMount() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  methods: {
    onSubmit() {
      // For demo purposes, accept any credentials and mark as logged in
      login();
      const redirect = this.$route.query.redirect || "/dashboard";
      this.$router.replace(redirect);
    },
  },
};
</script>

<style scoped>
.signin-image {
  width: 60vw; /* allow image to scale with viewport */
  max-width: 720px;
  min-width: 320px;
  left: auto;
}

/* When RTL, anchor image to left side */
[dir="rtl"] .signin-image {
  left: 0;
  right: auto;
}

@media (max-width: 991.98px) {
  .signin-image {
    display: none; /* hide on small screens */
  }
}
</style>
