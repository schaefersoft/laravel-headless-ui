function it(t = document) {
  Array.from(t.querySelectorAll("[data-ui-avatar]")).forEach((e) => {
    const i = e.querySelector("img"), r = e.querySelector("[data-ui-avatar-fallback]");
    function a() {
      i && (i.style.display = "none"), r && (r.style.display = "flex", r.setAttribute("aria-hidden", "false"));
    }
    if (i) {
      i.addEventListener("error", a, { once: !0 });
      const u = i;
      typeof u.naturalWidth == "number" && u.naturalWidth === 0 && u.complete === !0 && a();
    } else
      r && (r.style.display = "flex", r.setAttribute("aria-hidden", "false"));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => it()) : it());
const Mt = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function mt(t) {
  return Array.from(t.querySelectorAll(Mt));
}
function Tt(t, n) {
  if (n.key !== "Tab") return;
  const e = mt(t);
  if (e.length === 0) {
    n.preventDefault();
    return;
  }
  const i = e[0], r = e[e.length - 1];
  n.shiftKey ? document.activeElement === i && (n.preventDefault(), r.focus()) : document.activeElement === r && (n.preventDefault(), i.focus());
}
function Y(t, n) {
  const e = (t.getAttribute(`${n}`) || "").split(/\s+/).filter(Boolean), i = (t.getAttribute(`${n}-from`) || "").split(/\s+/).filter(Boolean), r = (t.getAttribute(`${n}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: e, from: i, to: r };
}
function j(t, n) {
  return t.hasAttribute(n) || t.hasAttribute(`${n}-from`) || t.hasAttribute(`${n}-to`);
}
function vt() {
  return new Promise((t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  });
}
function gt(t) {
  return new Promise((n) => {
    const e = getComputedStyle(t), i = parseFloat(e.transitionDuration || "0"), r = parseFloat(e.transitionDelay || "0"), a = (i + r) * 1e3;
    if (a <= 0) {
      n();
      return;
    }
    let u = !1;
    const h = () => {
      u || (u = !0, t.removeEventListener("transitionend", h), n());
    };
    t.addEventListener("transitionend", h, { once: !0 }), setTimeout(h, a + 50);
  });
}
function $t(t, n) {
  const { base: e, from: i } = Y(t, n);
  (e.length > 0 || i.length > 0) && t.classList.add(...e, ...i);
}
function Dt(t, n) {
  const { base: e, from: i, to: r } = Y(t, n);
  return e.length === 0 && i.length === 0 && r.length === 0 ? Promise.resolve() : vt().then(() => (t.classList.remove(...i), t.classList.add(...r), gt(t))).then(() => {
    t.classList.remove(...e, ...r);
  });
}
function Ct(t, n) {
  const { base: e, from: i, to: r } = Y(t, n);
  return e.length === 0 && i.length === 0 && r.length === 0 ? Promise.resolve() : (t.classList.add(...e, ...i), vt().then(() => (t.classList.remove(...i), t.classList.add(...r), gt(t))));
}
function It(t, n) {
  const { base: e, to: i } = Y(t, n);
  t.classList.remove(...e, ...i);
}
function rt(t) {
  const n = [];
  return (j(t, "data-hui-dialog-enter") || j(t, "data-hui-dialog-leave")) && n.push(t), n.push(...Array.from(t.querySelectorAll(
    "[data-hui-dialog-enter], [data-hui-dialog-leave]"
  ))), n;
}
function qt(t) {
  if (t.hasAttribute("data-hui-dialog-initialized")) return;
  t.setAttribute("data-hui-dialog-initialized", "");
  let n = null, e = !1;
  const i = t.hasAttribute("data-hui-dialog-no-escape"), r = t.hasAttribute("data-hui-dialog-no-backdrop-close"), a = t.hasAttribute("data-hui-dialog-scroll-lock");
  function u() {
    if (t.open || e) return;
    n = document.activeElement;
    const d = rt(t).filter((p) => j(p, "data-hui-dialog-enter"));
    d.forEach((p) => $t(p, "data-hui-dialog-enter")), t.showModal(), t.setAttribute("data-hui-dialog-open", ""), a && (document.body.style.overflow = "hidden");
    const c = mt(t);
    c.length > 0 && c[0].focus(), d.length > 0 && Promise.all(d.map((p) => Dt(p, "data-hui-dialog-enter"))), t.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
  }
  function h() {
    if (!t.open || e) return;
    const d = rt(t).filter((p) => j(p, "data-hui-dialog-leave"));
    function c() {
      t.close(), t.removeAttribute("data-hui-dialog-open"), a && (document.querySelector(
        "dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]"
      ) || (document.body.style.overflow = "")), n && n.focus && n.focus(), n = null, e = !1, t.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
    }
    if (d.length > 0) {
      e = !0;
      const p = d.map((x) => Ct(x, "data-hui-dialog-leave"));
      Promise.all(p).then(() => {
        c(), d.forEach((x) => It(x, "data-hui-dialog-leave"));
      });
    } else
      c();
  }
  t.addEventListener("keydown", (v) => {
    Tt(t, v);
  }), t.addEventListener("cancel", (v) => {
    v.preventDefault(), i || h();
  }), t.addEventListener("click", (v) => {
    if (r) return;
    const d = v.target;
    (d === t || d.hasAttribute("data-hui-dialog-background")) && h();
  }), t.addEventListener("click", (v) => {
    v.target.closest("[data-hui-dialog-close]") && h();
  });
  const m = t.querySelector("[data-hui-dialog-title]"), y = t.querySelector("[data-hui-dialog-description]");
  m && (m.id || (m.id = `hui-dialog-title-${ot()}`), t.setAttribute("aria-labelledby", m.id)), y && (y.id || (y.id = `hui-dialog-desc-${ot()}`), t.setAttribute("aria-describedby", y.id)), t._hui = { open: u, close: h }, t.hasAttribute("data-hui-dialog-open") && (t.removeAttribute("data-hui-dialog-open"), u());
}
let Ft = 0;
function ot() {
  return `hui-${++Ft}-${Date.now()}`;
}
function Nt(t) {
  Array.from(t.querySelectorAll("[data-hui-dialog-trigger]")).forEach((e) => {
    e.hasAttribute("data-hui-dialog-trigger-bound") || (e.setAttribute("data-hui-dialog-trigger-bound", ""), e.addEventListener("click", () => {
      const i = e.getAttribute("data-hui-dialog-trigger");
      if (!i) return;
      const r = document.getElementById(i);
      !r || !r._hui || r._hui.open();
    }));
  });
}
function at(t = document) {
  Array.from(t.querySelectorAll("[data-hui-dialog]")).forEach(qt), Nt(t);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => at()) : at());
function st(t = document) {
  const n = Array.from(
    t.querySelectorAll("[data-hui-disclosure]")
  ), e = (r, a) => {
    const u = r.hasAttribute("open");
    if (a === "close" || a === void 0 && u) {
      r.removeAttribute("open"), r.removeAttribute("data-opened");
      return;
    }
    (a === "open" || a === void 0 && !u) && (r.setAttribute("open", ""), r.setAttribute("data-opened", String(Date.now())));
  }, i = (r, a, u) => {
    if (!Number.isFinite(a) || a <= 0) return;
    const m = Array.from(
      r.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((d) => d.hasAttribute("open")).sort((d, c) => {
      const p = Number(d.getAttribute("data-opened") ?? "0"), x = Number(c.getAttribute("data-opened") ?? "0");
      return p - x;
    });
    let v = m.length - a;
    if (!(v <= 0)) {
      for (const d of m) {
        if (v <= 0) break;
        u && d === u || (e(d, "close"), v--);
      }
      v > 0 && u && u.hasAttribute("open") && e(u, "close");
    }
  };
  n.forEach((r) => {
    const a = r.querySelector(
      "[data-hui-disclosure-summary]"
    );
    a && a.addEventListener("click", (u) => {
      var y;
      if (u.preventDefault(), r.hasAttribute("data-disabled")) return;
      const h = (y = r.parentElement) != null && y.matches("[data-hui-disclosure-container]") ? r.parentElement : null, m = !r.hasAttribute("open");
      if (e(r), h && m) {
        const v = h.getAttribute("data-max-count"), d = v ? parseInt(v, 10) : NaN;
        i(h, d, r);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => st()) : st());
const U = "[data-hui-dropdown-item]:not([data-disabled])";
function Pt(t, n) {
  const r = t.getBoundingClientRect(), { innerHeight: a } = window;
  n.style.maxHeight = "";
  const u = n.hasAttribute("hidden");
  u && n.removeAttribute("hidden");
  const h = n.style.visibility, m = n.style.display;
  n.style.visibility = "hidden", n.style.display = "block";
  const y = n.getBoundingClientRect().height;
  n.style.visibility = h, n.style.display = m, u && n.setAttribute("hidden", "");
  const v = a - r.bottom - 4 - 8, d = r.top - 4 - 8;
  let c;
  v >= y ? c = "bottom" : d >= y ? c = "top" : c = v >= d ? "bottom" : "top", c === "bottom" ? (n.style.top = "calc(100% + 4px)", n.style.bottom = "", v < y && (n.style.maxHeight = `${Math.floor(v)}px`)) : (n.style.bottom = "calc(100% + 4px)", n.style.top = "", d < y && (n.style.maxHeight = `${Math.floor(d)}px`)), n.setAttribute("data-placement", c);
}
function yt(t, n) {
  const e = (t.getAttribute(n) || "").split(/\s+/).filter(Boolean), i = (t.getAttribute(`${n}-from`) || "").split(/\s+/).filter(Boolean), r = (t.getAttribute(`${n}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: e, from: i, to: r };
}
function et(t, n) {
  return t.hasAttribute(n) || t.hasAttribute(`${n}-from`) || t.hasAttribute(`${n}-to`);
}
function At() {
  return new Promise((t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  });
}
function Et(t) {
  return new Promise((n) => {
    const e = getComputedStyle(t), i = parseFloat(e.transitionDuration || "0"), r = parseFloat(e.transitionDelay || "0"), a = (i + r) * 1e3;
    if (a <= 0) {
      n();
      return;
    }
    let u = !1;
    const h = () => {
      u || (u = !0, t.removeEventListener("transitionend", h), n());
    };
    t.addEventListener("transitionend", h, { once: !0 }), setTimeout(h, a + 50);
  });
}
function Bt(t) {
  if (!et(t, "data-hui-dropdown-enter")) return Promise.resolve();
  const { base: n, from: e, to: i } = yt(t, "data-hui-dropdown-enter");
  return n.length === 0 && e.length === 0 && i.length === 0 ? Promise.resolve() : (t.classList.add(...n, ...e), At().then(() => (t.classList.remove(...e), t.classList.add(...i), Et(t))).then(() => {
    t.classList.remove(...n, ...i);
  }));
}
function Ot(t) {
  if (!et(t, "data-hui-dropdown-leave")) return Promise.resolve();
  const { base: n, from: e, to: i } = yt(t, "data-hui-dropdown-leave");
  return n.length === 0 && e.length === 0 && i.length === 0 ? Promise.resolve() : (t.classList.add(...n, ...e), At().then(() => (t.classList.remove(...e), t.classList.add(...i), Et(t))).then(() => {
    t.classList.remove(...n, ...i);
  }));
}
function Ht(t) {
  if (t.hasAttribute("data-hui-dropdown-initialized")) return;
  t.setAttribute("data-hui-dropdown-initialized", "");
  const n = t.querySelector("[data-hui-dropdown-trigger]"), e = t.querySelector("[data-hui-dropdown-items]");
  if (!n || !e) return;
  let i = !1, r = !1, a = -1, u = "", h = null;
  function m() {
    return Array.from(e.querySelectorAll(U));
  }
  function y(o) {
    m().forEach((L, w) => {
      w === o ? (L.setAttribute("data-active", ""), L.setAttribute("tabindex", "0"), L.focus()) : (L.removeAttribute("data-active"), L.setAttribute("tabindex", "-1"));
    }), a = o;
  }
  function v() {
    m().forEach((s) => {
      s.removeAttribute("data-active"), s.setAttribute("tabindex", "-1");
    }), a = -1;
  }
  function d(o = !1) {
    i || r || (i = !0, Pt(n, e), e.style.display = "block", e.removeAttribute("hidden"), n.setAttribute("aria-expanded", "true"), t.setAttribute("data-open", ""), o && m().length > 0 && y(0), Bt(e), requestAnimationFrame(() => {
      document.addEventListener("pointerdown", x, !0);
    }), t.dispatchEvent(new CustomEvent("hui:dropdown:open", { bubbles: !0 })));
  }
  function c(o = !0) {
    if (!i || r) return;
    function s() {
      i = !1, r = !1, e.style.display = "none", e.setAttribute("hidden", ""), n.setAttribute("aria-expanded", "false"), t.removeAttribute("data-open"), v(), document.removeEventListener("pointerdown", x, !0), o && n.focus(), t.dispatchEvent(new CustomEvent("hui:dropdown:close", { bubbles: !0 }));
    }
    et(e, "data-hui-dropdown-leave") ? (r = !0, Ot(e).then(s)) : s();
  }
  function p() {
    i ? c() : d();
  }
  function x(o) {
    t.contains(o.target) || c(!1);
  }
  function T(o) {
    u += o.toLowerCase(), h && clearTimeout(h), h = setTimeout(() => {
      u = "";
    }, 350);
    const L = m().findIndex((w) => (w.textContent || "").trim().toLowerCase().startsWith(u));
    L !== -1 && y(L);
  }
  function E(o) {
    const s = m();
    if (s.length !== 0)
      switch (o.key) {
        case "ArrowDown":
          if (o.preventDefault(), !i)
            d(!0);
          else {
            const L = a < s.length - 1 ? a + 1 : 0;
            y(L);
          }
          break;
        case "ArrowUp":
          if (o.preventDefault(), !i)
            d(), y(s.length - 1);
          else {
            const L = a > 0 ? a - 1 : s.length - 1;
            y(L);
          }
          break;
        case "Home":
          i && (o.preventDefault(), y(0));
          break;
        case "End":
          i && (o.preventDefault(), y(s.length - 1));
          break;
        case "Enter":
        case " ":
          o.preventDefault(), i && a >= 0 && a < s.length ? (s[a].click(), c()) : i || d(!0);
          break;
        case "Escape":
          i && (o.preventDefault(), c());
          break;
        case "Tab":
          i && c();
          break;
        default:
          i && o.key.length === 1 && !o.ctrlKey && !o.metaKey && !o.altKey && (o.preventDefault(), T(o.key));
          break;
      }
  }
  let M = e.id;
  M || (M = `hui-dropdown-items-${++_t}-${Date.now()}`, e.id = M), n.setAttribute("aria-haspopup", "true"), n.setAttribute("aria-expanded", "false"), n.setAttribute("aria-controls", M), e.setAttribute("role", "menu"), e.style.display = "none", e.setAttribute("hidden", ""), m().forEach((o) => {
    o.getAttribute("role") || o.setAttribute("role", "menuitem"), o.setAttribute("tabindex", "-1");
  }), Array.from(e.querySelectorAll("[data-hui-dropdown-item]")).forEach((o) => {
    o.getAttribute("role") || o.setAttribute("role", "menuitem"), o.hasAttribute("data-disabled") && o.setAttribute("aria-disabled", "true");
  }), n.addEventListener("click", (o) => {
    o.preventDefault(), p();
  }), n.addEventListener("keydown", E), e.addEventListener("keydown", E), e.addEventListener("click", (o) => {
    var L;
    const s = o.target.closest(U);
    s && (s.dispatchEvent(new CustomEvent("hui:dropdown:select", {
      bubbles: !0,
      detail: { value: s.getAttribute("data-value") || ((L = s.textContent) == null ? void 0 : L.trim()) }
    })), c());
  }), e.addEventListener("pointerenter", (o) => {
    const s = o.target.closest(U);
    if (s) {
      const w = m().indexOf(s);
      w !== -1 && y(w);
    }
  }, !0), e.addEventListener("pointerleave", (o) => {
    o.target.closest(U) && v();
  }, !0), t._hui = { open: d, close: c, toggle: p };
}
let _t = 0;
function ut(t = document) {
  Array.from(t.querySelectorAll("[data-hui-dropdown]")).forEach(Ht);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ut()) : ut());
const Rt = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function wt(t) {
  return Array.from(t.querySelectorAll(Rt));
}
function zt(t, n) {
  if (n.key !== "Tab") return;
  const e = wt(t);
  if (e.length === 0) {
    n.preventDefault();
    return;
  }
  const i = e[0], r = e[e.length - 1];
  n.shiftKey ? document.activeElement === i && (n.preventDefault(), r.focus()) : document.activeElement === r && (n.preventDefault(), i.focus());
}
function G(t, n) {
  const e = (t.getAttribute(n) || "").split(/\s+/).filter(Boolean), i = (t.getAttribute(`${n}-from`) || "").split(/\s+/).filter(Boolean), r = (t.getAttribute(`${n}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: e, from: i, to: r };
}
function V(t, n) {
  return t.hasAttribute(n) || t.hasAttribute(`${n}-from`) || t.hasAttribute(`${n}-to`);
}
function Lt() {
  return new Promise((t) => requestAnimationFrame(() => requestAnimationFrame(() => t())));
}
function kt(t) {
  return new Promise((n) => {
    const e = getComputedStyle(t), i = parseFloat(e.transitionDuration || "0"), r = parseFloat(e.transitionDelay || "0"), a = (i + r) * 1e3;
    if (a <= 0) {
      n();
      return;
    }
    let u = !1;
    const h = () => {
      u || (u = !0, t.removeEventListener("transitionend", h), n());
    };
    t.addEventListener("transitionend", h, { once: !0 }), setTimeout(h, a + 50);
  });
}
function Xt(t, n) {
  const { base: e, from: i } = G(t, n);
  (e.length > 0 || i.length > 0) && t.classList.add(...e, ...i);
}
function Kt(t, n) {
  const { base: e, from: i, to: r } = G(t, n);
  return e.length === 0 && i.length === 0 && r.length === 0 ? Promise.resolve() : Lt().then(() => (t.classList.remove(...i), t.classList.add(...r), kt(t))).then(() => {
    t.classList.remove(...e, ...r);
  });
}
function Ut(t, n) {
  const { base: e, from: i, to: r } = G(t, n);
  return e.length === 0 && i.length === 0 && r.length === 0 ? Promise.resolve() : (t.classList.add(...e, ...i), Lt().then(() => (t.classList.remove(...i), t.classList.add(...r), kt(t))));
}
function Wt(t, n) {
  const { base: e, to: i } = G(t, n);
  t.classList.remove(...e, ...i);
}
function lt(t) {
  const n = [];
  return (V(t, "data-hui-flyout-enter") || V(t, "data-hui-flyout-leave")) && n.push(t), n.push(...Array.from(t.querySelectorAll(
    "[data-hui-flyout-enter], [data-hui-flyout-leave]"
  ))), n;
}
function tt(t) {
  const n = t.getAttribute("data-hui-flyout-inline");
  if (!n) return null;
  const e = parseInt(n, 10);
  return Number.isFinite(e) && e > 0 ? e : null;
}
function Q(t) {
  const n = tt(t);
  return n === null ? !1 : window.innerWidth >= n;
}
function jt(t) {
  if (t.hasAttribute("data-hui-flyout-initialized")) return;
  t.setAttribute("data-hui-flyout-initialized", "");
  let n = null, e = !1;
  const i = t.hasAttribute("data-hui-flyout-no-escape"), r = t.hasAttribute("data-hui-flyout-no-backdrop-close"), a = t.hasAttribute("data-hui-flyout-scroll-lock");
  function u() {
    tt(t) !== null && (Q(t) ? (t.setAttribute("data-hui-flyout-mode", "inline"), t.open && t.hasAttribute("data-hui-flyout-open") && t.close(), t.removeAttribute("data-hui-flyout-open")) : t.setAttribute("data-hui-flyout-mode", "flyout"));
  }
  function h() {
    if (Q(t) || t.open || e) return;
    n = document.activeElement;
    const p = lt(t).filter((T) => V(T, "data-hui-flyout-enter"));
    p.forEach((T) => Xt(T, "data-hui-flyout-enter")), t.showModal(), t.setAttribute("data-hui-flyout-open", ""), a && (document.body.style.overflow = "hidden");
    const x = wt(t);
    x.length > 0 && x[0].focus(), p.length > 0 && Promise.all(p.map((T) => Kt(T, "data-hui-flyout-enter"))), t.dispatchEvent(new CustomEvent("hui:flyout:open", { bubbles: !0 }));
  }
  function m() {
    if (Q(t) || !t.open || e) return;
    const p = lt(t).filter((T) => V(T, "data-hui-flyout-leave"));
    function x() {
      t.close(), t.removeAttribute("data-hui-flyout-open"), a && (document.querySelector(
        "dialog[data-hui-flyout][data-hui-flyout-scroll-lock][open]"
      ) || (document.body.style.overflow = "")), n && n.focus && n.focus(), n = null, e = !1, t.dispatchEvent(new CustomEvent("hui:flyout:close", { bubbles: !0 }));
    }
    if (p.length > 0) {
      e = !0;
      const T = p.map((E) => Ut(E, "data-hui-flyout-leave"));
      Promise.all(T).then(() => {
        x(), p.forEach((E) => Wt(E, "data-hui-flyout-leave"));
      });
    } else
      x();
  }
  t.addEventListener("keydown", (c) => {
    zt(t, c);
  }), t.addEventListener("cancel", (c) => {
    c.preventDefault(), i || m();
  }), t.addEventListener("click", (c) => {
    if (r) return;
    const p = c.target;
    (p === t || p.hasAttribute("data-hui-flyout-background")) && m();
  }), t.addEventListener("click", (c) => {
    c.target.closest("[data-hui-flyout-close]") && m();
  });
  const y = t.querySelector("[data-hui-flyout-title]"), v = t.querySelector("[data-hui-flyout-description]");
  y && (y.id || (y.id = `hui-flyout-title-${dt()}`), t.setAttribute("aria-labelledby", y.id)), v && (v.id || (v.id = `hui-flyout-desc-${dt()}`), t.setAttribute("aria-describedby", v.id));
  const d = tt(t);
  d !== null && (window.matchMedia(`(min-width: ${d}px)`).addEventListener("change", u), u()), t._hui = { open: h, close: m }, t.hasAttribute("data-hui-flyout-open") && (t.removeAttribute("data-hui-flyout-open"), h());
}
let Vt = 0;
function dt() {
  return `hui-${++Vt}-${Date.now()}`;
}
function Yt(t) {
  Array.from(t.querySelectorAll("[data-hui-flyout-trigger]")).forEach((e) => {
    e.hasAttribute("data-hui-flyout-trigger-bound") || (e.setAttribute("data-hui-flyout-trigger-bound", ""), e.addEventListener("click", () => {
      const i = e.getAttribute("data-hui-flyout-trigger");
      if (!i) return;
      const r = document.getElementById(i);
      !r || !r._hui || r._hui.open();
    }));
  });
}
function ct(t = document) {
  Array.from(t.querySelectorAll("[data-hui-flyout]")).forEach(jt), Yt(t);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ct()) : ct());
function K(t, n, e) {
  return Math.min(Math.max(t, n), e);
}
function Z(t, n, e) {
  return e === n ? 0 : (t - n) / (e - n) * 100;
}
function ft(t = document) {
  Array.from(t.querySelectorAll("[data-hui-range-slider]")).forEach((e) => {
    const i = e.querySelector("[data-hui-range-slider-track]") || e, r = e.querySelector("[data-hui-range-slider-track-value]"), a = e.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), u = e.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), h = !!u, m = [a, u].filter(Boolean), y = Array.from(e.querySelectorAll('[data-hui-range-slider-value="min"]')), v = Array.from(e.querySelectorAll('[data-hui-range-slider-value="max"]')), d = y.filter((g) => g instanceof HTMLInputElement), c = v.filter((g) => g instanceof HTMLInputElement), p = y.filter((g) => !(g instanceof HTMLInputElement)), x = v.filter((g) => !(g instanceof HTMLInputElement));
    if (!a && !u) return;
    const T = () => {
      const g = a || u, l = Number(g.min || "0"), k = Number(g.max || "100"), A = Number(g.step || "1");
      return { min: l, max: k, step: A };
    }, { min: E, max: M, step: b } = T();
    function f() {
      const g = m.some((l) => !l.disabled);
      e.setAttribute("aria-disabled", g ? "false" : "true");
    }
    function o(g = "init") {
      let l = Number((a == null ? void 0 : a.value) ?? E), k = h ? Number(u.value) : M;
      if (l = K(l, E, M), k = K(k, E, M), h && (g === "min" && l > k && (l = k), g === "max" && k < l && (k = l)), a && Number(a.value) !== l && (a.value = String(l)), h && Number(u.value) !== k && (u.value = String(k)), d.forEach((A) => {
        Number(A.value) !== l && (A.value = String(l));
      }), c.forEach((A) => {
        h && Number(A.value) !== k && (A.value = String(k));
      }), p.forEach((A) => {
        A.textContent !== String(l) && (A.textContent = String(l));
      }), x.forEach((A) => {
        const S = String(k);
        A.textContent !== S && (A.textContent = S);
      }), r)
        if (h) {
          const A = Z(l, E, M), S = Z(k, E, M);
          r.style.left = `${A}%`, r.style.width = `${Math.max(0, S - A)}%`;
        } else {
          const A = Z(l, E, M);
          r.style.left = `${A}%`, r.style.width = `${Math.max(0, 100 - A)}%`;
        }
    }
    a && (a.addEventListener("input", () => o("min")), a.addEventListener("change", () => o("min"))), u && (u.addEventListener("input", () => o("max")), u.addEventListener("change", () => o("max")));
    const s = (g) => {
      const l = b || 1;
      return Math.round((g - E) / l) * l + E;
    };
    if (d.length && a) {
      const g = () => {
        const l = Number(d[d.length - 1].value);
        if (Number.isNaN(l)) return;
        const k = s(l), A = h ? Number(u.value) : M, S = K(k, E, A);
        String(S) !== a.value ? (a.value = String(S), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("min");
      };
      d.forEach((l) => {
        l.addEventListener("input", g), l.addEventListener("change", g);
      });
    }
    if (c.length && u) {
      const g = () => {
        const l = Number(c[c.length - 1].value);
        if (Number.isNaN(l)) return;
        const k = s(l), A = a ? Number(a.value) : E, S = K(k, A, M);
        String(S) !== u.value ? (u.value = String(S), u.dispatchEvent(new Event("input", { bubbles: !0 })), u.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("max");
      };
      c.forEach((l) => {
        l.addEventListener("input", g), l.addEventListener("change", g);
      });
    }
    function L(g) {
      if ((!a || a.disabled) && (!u || u.disabled)) return;
      const l = i.getBoundingClientRect(), k = K((g - l.left) / l.width, 0, 1), A = E + k * (M - E), S = Math.round((A - E) / (b || 1)) * (b || 1) + E, H = Number((a == null ? void 0 : a.value) ?? E), N = h ? Number(u.value) : M, _ = Math.abs(S - H), R = h ? Math.abs(S - N) : 1 / 0;
      let B = "min";
      if (h && !u.disabled)
        if (a && !a.disabled)
          if (R === _) {
            const F = (H + N) / 2;
            B = S > F ? "max" : "min";
          } else
            B = R < _ ? "max" : "min";
        else
          B = "max";
      if (B === "min" && a) {
        const F = K(S, E, h ? Number(u.value) : M);
        String(F) !== a.value ? (a.value = String(F), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("min");
      } else if (B === "max" && u) {
        const F = K(S, a ? Number(a.value) : E, M);
        String(F) !== u.value ? (u.value = String(F), u.dispatchEvent(new Event("input", { bubbles: !0 })), u.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("max");
      }
    }
    function w(g) {
      let l = 0, k = !1, A = null;
      const S = 4, H = ($) => {
        A !== null && $.pointerId !== A || Math.abs($.clientX - l) > S && (k = !0);
      }, N = ($) => {
        A !== null && $.pointerId !== A || (window.removeEventListener("pointermove", H, !0), window.removeEventListener("pointerup", N, !0), window.removeEventListener("pointercancel", N, !0), k || (L($.clientX), $.preventDefault(), $.stopPropagation()), k = !1, A = null);
      };
      g.addEventListener("pointerdown", ($) => {
        l = $.clientX, k = !1, A = $.pointerId, window.addEventListener("pointermove", H, !0), window.addEventListener("pointerup", N, !0), window.addEventListener("pointercancel", N, !0);
      }, !0);
      let _ = 0, R = !1;
      const B = ($) => {
        Math.abs($.clientX - _) > S && (R = !0);
      }, F = ($) => {
        window.removeEventListener("mousemove", B, !0), window.removeEventListener("mouseup", F, !0), R || (L($.clientX), $.preventDefault(), $.stopPropagation()), R = !1;
      };
      g.addEventListener("mousedown", ($) => {
        _ = $.clientX, R = !1, window.addEventListener("mousemove", B, !0), window.addEventListener("mouseup", F, !0);
      }, !0);
    }
    w(i);
    const C = new MutationObserver(() => f());
    m.forEach((g) => C.observe(g, { attributes: !0, attributeFilter: ["disabled"] })), f(), o("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ft()) : ft());
function P(t, n) {
  return t.hasAttribute(n);
}
function W(t) {
  for (let n = 0; n < t.length; n++)
    if (!P(t[n], "data-disabled")) return n;
  return 0;
}
function ht(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tabs]")).forEach((e) => {
    const i = e.querySelector("[data-hui-tablist]") || e, r = Array.from(e.querySelectorAll("[data-hui-tab]")), a = Array.from(e.querySelectorAll("[data-hui-tabpanel]"));
    if (!r.length || !a.length) return;
    const u = e.getAttribute("data-hui-tabs-orientation") === "vertical" || e.hasAttribute("data-hui-tabs-vertical");
    i.setAttribute("role", "tablist"), i.setAttribute("aria-orientation", u ? "vertical" : "horizontal");
    const h = Math.random().toString(36).slice(2);
    r.forEach((b, f) => {
      b.id || (b.id = `hui-tab-${h}-${f}`);
    }), a.forEach((b, f) => {
      b.id || (b.id = `hui-tabpanel-${h}-${f}`);
    });
    const m = Math.min(r.length, a.length);
    for (let b = 0; b < m; b++) {
      const f = r[b], o = a[b];
      f.setAttribute("role", "tab"), o.setAttribute("role", "tabpanel"), f.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", f.id);
    }
    function y() {
      const b = e.getAttribute("data-hui-tabs-initial-index");
      if (b !== null) {
        const f = parseInt(b, 10);
        if (!Number.isNaN(f) && f >= 0 && f < m) return f;
      }
      for (let f = 0; f < m; f++) {
        const o = r[f], s = a[f];
        if (P(o, "data-active") || P(s, "data-active"))
          return f;
      }
      return W(r);
    }
    function v(b, f) {
      let o = b;
      for (let s = 0; s < m; s++)
        if (o = (o + f + m) % m, !P(r[o], "data-disabled")) return o;
      return b;
    }
    let d = Math.max(0, Math.min(y(), m - 1));
    P(r[d], "data-disabled") && (d = W(r));
    let c = !1;
    function p(b, f, o) {
      const s = b.hasAttribute(f);
      o && !s && b.setAttribute(f, ""), !o && s && b.removeAttribute(f);
    }
    function x(b, f, o) {
      b.getAttribute(f) !== o && b.setAttribute(f, o);
    }
    function T(b = !1) {
      c = !0;
      for (let f = 0; f < m; f++) {
        const o = f === d, s = r[f], L = a[f];
        x(s, "aria-selected", o ? "true" : "false"), s.tabIndex = o && !P(s, "data-disabled") ? 0 : -1, p(s, "data-active", o), p(L, "data-active", o), p(L, "hidden", !o);
      }
      b && r[d].focus(), c = !1;
    }
    function E(b, f = !1) {
      if (!(b < 0 || b >= m) && !P(r[b], "data-disabled")) {
        if (b === d) {
          f && r[d].focus();
          return;
        }
        d = b, T(f);
      }
    }
    r.forEach((b, f) => {
      b.addEventListener("click", (o) => {
        if (P(b, "data-disabled")) {
          o.preventDefault();
          return;
        }
        E(f, !0);
      });
    });
    const M = (b) => {
      const f = b.key;
      let o = !1;
      u ? (f === "ArrowUp" && (E(v(d, -1), !0), o = !0), f === "ArrowDown" && (E(v(d, 1), !0), o = !0)) : (f === "ArrowLeft" && (E(v(d, -1), !0), o = !0), f === "ArrowRight" && (E(v(d, 1), !0), o = !0)), f === "Home" && (E(W(r), !0), o = !0), f === "End" && (E((() => {
        for (let s = m - 1; s >= 0; s--)
          if (!P(r[s], "data-disabled")) return s;
        return d;
      })(), !0), o = !0), (f === "Enter" || f === " ") && (E(d, !0), o = !0), o && (b.preventDefault(), b.stopPropagation());
    };
    i.addEventListener("keydown", M);
    try {
      const b = new MutationObserver((f) => {
        if (c) return;
        let o = !1;
        for (const s of f)
          s.type === "attributes" && (s.attributeName === "data-disabled" || s.attributeName === "data-active") && (o = !0);
        if (o) {
          if (P(r[d], "data-disabled"))
            d = W(r);
          else
            for (let s = 0; s < m; s++)
              if (s !== d && P(r[s], "data-active")) {
                d = s;
                break;
              }
          T(!1);
        }
      });
      r.forEach((f) => b.observe(f, { attributes: !0, attributeFilter: ["data-disabled", "data-active"] }));
    } catch {
    }
    T(!1);
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ht()) : ht());
function bt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-toggle]")).forEach((e) => {
    const i = e.querySelector(".hui-toggle-input") || void 0, r = e.querySelector(".hui-toggle-thumb") || void 0, a = () => e.getAttribute("aria-disabled") === "true", u = (c) => {
      const p = c ? "true" : "false";
      e.setAttribute("aria-checked", p), r && r.setAttribute("aria-checked", p);
    }, h = () => e.getAttribute("aria-checked") === "true", m = i ? !!i.checked : h();
    u(m), r && r.setAttribute("aria-disabled", a() ? "true" : "false");
    function y(c) {
      i && i.checked !== c && (i.checked = c, i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function v(c) {
      u(c), y(c);
    }
    function d() {
      a() || v(!h());
    }
    e.addEventListener("click", (c) => {
      a() || d();
    }), e.addEventListener("keydown", (c) => {
      if (a()) return;
      c.key === "Spacebar" && (c.preventDefault(), d());
    }), i && (i.addEventListener("change", () => v(!!i.checked)), new MutationObserver(() => {
      e.setAttribute("aria-disabled", i.disabled ? "true" : "false"), r && r.setAttribute("aria-disabled", i.disabled ? "true" : "false"), v(!!i.checked);
    }).observe(i, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => bt()) : bt());
function O(t, n, e) {
  return Math.min(Math.max(t, n), e);
}
function pt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tooltip]")).forEach((e) => {
    let i = e.querySelector("[data-hui-tooltip-content]");
    if (!i || i === null) return;
    i = i, i.style.position = "fixed", i.style.left = "-10000px", i.style.top = "-10000px";
    let r = !1, a = !1, u = null, h = !1;
    function m() {
      return e.hasAttribute("data-hui-tooltip-disabled");
    }
    function y() {
      return e.hasAttribute("data-hui-tooltip-open");
    }
    function v(s) {
      (s.key === "Escape" || s.key === "Esc") && x();
    }
    function d() {
      if (i === null) return { w: 0, h: 0 };
      const s = i.style.display, L = i.style.visibility;
      i.style.visibility = "hidden", i.style.display = "block";
      const w = i.getBoundingClientRect(), C = w.width, g = w.height;
      return i.style.display = s || "", i.style.visibility = L || "", { w: C, h: g };
    }
    function c() {
      if (i === null) return;
      const { innerWidth: s, innerHeight: L } = window, w = e.getBoundingClientRect(), { w: C, h: g } = d(), l = 8, k = i.getAttribute("data-hui-tooltip-position") || "top", A = k === "bottom" || k === "left" || k === "right" ? k : "top", S = w.top, H = L - w.bottom, N = w.left, _ = s - w.right, R = S >= g + l, B = H >= g + l, F = N >= C + l, $ = _ >= C + l, xt = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let J;
      A === "top" || A === "bottom" ? J = N >= _ ? ["left", "right"] : ["right", "left"] : J = S >= H ? ["top", "bottom"] : ["bottom", "top"];
      const St = [A, xt[A], ...J];
      let z = null;
      for (const D of St)
        if (D === "top" && R || D === "bottom" && B || D === "left" && F || D === "right" && $) {
          z = D;
          break;
        }
      if (z === null) {
        const D = {
          top: S,
          bottom: H,
          left: N,
          right: _
        };
        z = ["top", "bottom", "left", "right"].reduce((X, nt) => D[nt] > D[X] ? nt : X, "top");
      }
      let I, q;
      if (z === "top" ? (q = w.top - g - l, I = w.left + w.width / 2 - C / 2, q = O(q, l, Math.max(l, L - l - g)), I = O(I, l, Math.max(l, s - l - C))) : z === "bottom" ? (q = w.bottom + l, I = w.left + w.width / 2 - C / 2, q = O(q, l, Math.max(l, L - l - g)), I = O(I, l, Math.max(l, s - l - C))) : z === "left" ? (I = w.left - C - l, q = w.top + w.height / 2 - g / 2, I = O(I, l, Math.max(l, s - l - C)), q = O(q, l, Math.max(l, L - l - g))) : (I = w.right + l, q = w.top + w.height / 2 - g / 2, I = O(I, l, Math.max(l, s - l - C)), q = O(q, l, Math.max(l, L - l - g))), i.style.left = `${Math.round(I)}px`, i.style.top = `${Math.round(q)}px`, i.setAttribute("data-placement", z), z === "top" || z === "bottom") {
        const D = w.left + w.width / 2, X = O(D - I, 6, Math.max(6, C - 6));
        i.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(X)}px`), i.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const D = w.top + w.height / 2, X = O(D - q, 6, Math.max(6, g - 6));
        i.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(X)}px`), i.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const D = getComputedStyle(i).backgroundColor;
        !D || D === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(D) ? i.style.removeProperty("--hui-tooltip-bg") : i.style.setProperty("--hui-tooltip-bg", D);
      } catch {
      }
    }
    function p() {
      i !== null && (m() && !y() || r || (r = !0, i.style.display = "block", i.setAttribute("aria-hidden", "false"), i.setAttribute("data-open", "true"), c(), window.addEventListener("scroll", E, !0), window.addEventListener("resize", M, !0), document.addEventListener("pointerdown", T, !0), document.addEventListener("keydown", v, !0)));
    }
    function x() {
      i !== null && r && (m() && y() || (r = !1, i.style.display = "none", i.setAttribute("aria-hidden", "true"), i.setAttribute("data-open", "false"), window.removeEventListener("scroll", E, !0), window.removeEventListener("resize", M, !0), document.removeEventListener("pointerdown", T, !0), document.removeEventListener("keydown", v, !0)));
    }
    function T(s) {
      e.contains(s.target) || x();
    }
    function E() {
      r && c();
    }
    function M() {
      r && c();
    }
    function b() {
      u !== null && window.clearTimeout(u), u = window.setTimeout(() => {
        a || x();
      }, 60);
    }
    function f(s) {
      h = s.pointerType === "touch", !h && (a = !0, u !== null && (window.clearTimeout(u), u = null), p());
    }
    function o() {
      h || (a = !1, b());
    }
    e.addEventListener("pointerenter", f), e.addEventListener("pointerleave", o), i.addEventListener("pointerenter", f), i.addEventListener("pointerleave", o), e.addEventListener("focusin", () => p()), e.addEventListener("focusout", () => {
      setTimeout(() => {
        const s = document.activeElement;
        s && e.contains(s) || x();
      }, 0);
    }), e.addEventListener("pointerup", (s) => {
      (s.pointerType === "touch" || s.pointerType === "pen") && (h = !0, p());
    }), e.addEventListener("click", (s) => {
      h && p();
    }), e.hasAttribute("data-hui-tooltip-open") && p();
    try {
      new MutationObserver((L) => {
        for (const w of L)
          w.type === "attributes" && (w.attributeName === "data-hui-tooltip-disabled" && (m() ? y() ? p() : x() : y() && p()), w.attributeName === "data-hui-tooltip-open" && (y() ? p() : x()));
      }).observe(e, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => pt()) : pt());
function Gt(...t) {
  return t.filter(Boolean).join(" ");
}
export {
  Gt as cn
};
