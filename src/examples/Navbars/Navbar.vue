<template>
  <nav
    v-bind="$attrs"
    id="navbarBlur"
    class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :current-page="currentRouteName" :text-white="textWhite" />
      <div
        id="navbar"
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
      >
        <div class="pe-md-3 d-flex align-items-center ms-md-auto">
          <div class="input-group">
            <span class="input-group-text text-body">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Type here..."
            />
          </div>
        </div>

        <ul class="navbar-nav justify-content-end">
          <!-- notifications -->
          <li class="nav-item dropdown d-flex align-items-center pe-2">
            <a
              id="dropdownMenuButton"
              href="#"
              class="p-0 nav-link"
              :class="[ textWhite ? textWhite : 'text-body', showMenu ? 'show' : '' ]"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click.prevent="toggleNotifications"
            >
              <i class="cursor-pointer fa fa-bell"></i>
            </a>

            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li v-if="loading" class="px-3 py-2">
                <div class="text-center text-sm text-secondary">Loading...</div>
              </li>

              <li v-else-if="notifications.length === 0" class="px-3 py-2">
                <div class="text-center text-sm text-secondary">No notifications</div>
              </li>

              <li
                v-else
                v-for="notif in notifications"
                :key="notif.id"
                class="mb-2"
              >
                <a
                  class="dropdown-item border-radius-md d-flex align-items-start"
                  href="javascript:;"
                  @click.prevent="openNotification(notif)"
                >
                  <div class="me-3">
                    <img
                      v-if="notif.avatar"
                      :src="notif.avatar"
                      class="avatar avatar-sm"
                      :alt="notif.title"
                    />
                    <div v-else class="avatar avatar-sm bg-gradient-secondary d-flex align-items-center justify-content-center text-white">
                      <i :class="notif.icon || 'fa fa-info'"></i>
                    </div>
                  </div>

                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                      <span class="font-weight-bold">{{ notif.title }}</span>
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                      <i class="fa fa-clock me-1"></i>
                      {{ notif.time || notif.relativeTime || '' }}
                    </p>
                    <small class="text-muted mt-1">{{ notif.message }}</small>
                  </div>

                  <button
                    v-if="!notif.read"
                    @click.stop.prevent="markAsRead(notif)"
                    class="btn btn-link btn-sm ms-auto"
                    title="Mark as read"
                  >
                    <i class="fa fa-circle text-info" style="font-size:10px"></i>
                  </button>
                </a>
              </li>

              <li v-if="notifications.length > 0" class="mt-1">
                <a class="dropdown-item text-center py-2" href="/notifications">
                  View all
                </a>
              </li>
            </ul>
          </li>

          <!-- sidebar toggler for small screens -->
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              id="iconNavbarSidenav"
              href="#"
              class="p-0 nav-link text-body"
              @click="toggleSidebar"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import NotificationService from "@/services/notificationService";
import { mapMutations, mapActions } from "vuex";

export default {
  name: "NavbarComponent",

  components: {
    Breadcrumbs,
  },
  props: {
    minNav: {
      type: Function,
      default: () => {}
    },
    textWhite: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      showMenu: false,
      _navbarEl: null,
      notifications: [],
      loading: false,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  mounted() {
    // call minNav if provided
    if (typeof this.minNav === "function") this.minNav();

    // cache navbar element and attach scroll listener
    this._navbarEl = document.getElementById("navbarBlur");
    this.handleScroll();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapMutations(["navbarMinimize"]),
    ...mapActions(["toggleSidebarColor"]),

    async toggleNotifications() {
      this.showMenu = !this.showMenu;
      if (this.showMenu && this.notifications.length === 0) {
        await this.loadNotifications();
      }
    },

    async loadNotifications() {
      this.loading = true;
      try {
        const items = await NotificationService.getNotifications();
        // normalize server response if necessary
        this.notifications = (items || []).map(n => ({
          id: n.id,
          title: n.title || n.subject || "Notification",
          message: n.message || n.body || "",
          avatar: n.avatar || n.image || "",
          icon: n.icon || "",
          time: n.time || n.date || "",
          read: !!n.read,
          url: n.url,
        }));
      } catch (e) {
        // silent fail (could add toast)
        this.notifications = [];
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notif) {
      try {
        await NotificationService.markAsRead(notif.id);
        notif.read = true;
      } catch (e) {
        // ignore
        notif.read = true;
      }
    },

    openNotification(notif) {
      // handle navigation or action -- default: mark read and open details page
      if (!notif.read) this.markAsRead(notif);
      if (notif.url) {
        this.$router.push(notif.url).catch(()=>{});
      }
    },

    handleScroll() {
      const navbar = this._navbarEl || document.getElementById("navbarBlur");
      if (!navbar) return;
      if (window.scrollY > 10 && this.$store.state.isNavFixed) {
        navbar.classList.add("blur", "position-sticky", "shadow-blur");
      } else {
        navbar.classList.remove("blur", "position-sticky", "shadow-blur");
      }
    },

    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
  },
};
</script>
