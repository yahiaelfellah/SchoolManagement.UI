// simple notification service: adapt endpoints to your backend
const API_BASE = "/api/notifications";

export default {
  async getNotifications() {
    try {
      const res = await fetch(API_BASE, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return Array.isArray(data) ? data : data.notifications || [];
    } catch (e) {
      // fallback mock data when backend not available
      return [
        {
          id: "1",
          title: "New message",
          message: "You have a new message from Admin",
          avatar: "",
          icon: "fa fa-envelope",
          time: "10m",
          read: false,
          url: "/messages/1",
        },
        {
          id: "2",
          title: "System update",
          message: "Scheduled maintenance at midnight",
          avatar: "",
          icon: "fa fa-cog",
          time: "1h",
          read: true,
          url: "/status",
        },
      ];
    }
  },

  async markAsRead(id) {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}/read`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark read");
      return await res.json();
    } catch (e) {
      // ignore network errors for now
      return null;
    }
  },
};