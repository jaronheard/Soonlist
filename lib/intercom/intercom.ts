// @ts-nocheck

export const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

// Loads Intercom with the snippet
// This must be run before boot, it initializes window.Intercom

export const load = () => {
  (function () {
    const w = window;
    const ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", w.intercomSettings);
    } else {
      const d = document;
      const i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      const l = function () {
        const s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/ravmo56d";
        const x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
};

// Initializes Intercom
export const boot = (options: Intercom_.IntercomSettings) => {
  window &&
    window.Intercom?.("boot", {
      api_base: "https://api-iam.intercom.io",
      app_id: APP_ID,
      ...options,
    });
};

export const update = () => {
  window && window.Intercom?.("update");
};
