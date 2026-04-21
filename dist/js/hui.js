function Q(t = document) {
  Array.from(t.querySelectorAll("[data-ui-avatar]")).forEach((e) => {
    const n = e.querySelector("img"), r = e.querySelector("[data-ui-avatar-fallback]");
    function a() {
      n && (n.style.display = "none"), r && (r.style.display = "flex", r.setAttribute("aria-hidden", "false"));
    }
    if (n) {
      n.addEventListener("error", a, { once: !0 });
      const l = n;
      typeof l.naturalWidth == "number" && l.naturalWidth === 0 && l.complete === !0 && a();
    } else
      r && (r.style.display = "flex", r.setAttribute("aria-hidden", "false"));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Q()) : Q());
const bt = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function lt(t) {
  return Array.from(t.querySelectorAll(bt));
}
function mt(t, i) {
  if (i.key !== "Tab") return;
  const e = lt(t);
  if (e.length === 0) {
    i.preventDefault();
    return;
  }
  const n = e[0], r = e[e.length - 1];
  i.shiftKey ? document.activeElement === n && (i.preventDefault(), r.focus()) : document.activeElement === r && (i.preventDefault(), n.focus());
}
function vt(t, i) {
  const e = (t.getAttribute(`${i}`) || "").split(/\s+/).filter(Boolean), n = (t.getAttribute(`${i}-from`) || "").split(/\s+/).filter(Boolean), r = (t.getAttribute(`${i}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: e, from: n, to: r };
}
function j(t, i) {
  return t.hasAttribute(i) || t.hasAttribute(`${i}-from`) || t.hasAttribute(`${i}-to`);
}
function gt() {
  return new Promise((t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  });
}
function yt(t) {
  return new Promise((i) => {
    const e = getComputedStyle(t), n = parseFloat(e.transitionDuration || "0"), r = parseFloat(e.transitionDelay || "0"), a = (n + r) * 1e3;
    if (a <= 0) {
      i();
      return;
    }
    let l = !1;
    const h = () => {
      l || (l = !0, t.removeEventListener("transitionend", h), i());
    };
    t.addEventListener("transitionend", h, { once: !0 }), setTimeout(h, a + 50);
  });
}
function Z(t, i) {
  const { base: e, from: n, to: r } = vt(t, i);
  return e.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (t.classList.add(...e, ...n), gt().then(() => (t.classList.remove(...n), t.classList.add(...r), yt(t))).then(() => {
    t.classList.remove(...e, ...r);
  }));
}
function tt(t) {
  const i = [];
  return (j(t, "data-hui-dialog-enter") || j(t, "data-hui-dialog-leave")) && i.push(t), i.push(...Array.from(t.querySelectorAll(
    "[data-hui-dialog-enter], [data-hui-dialog-leave]"
  ))), i;
}
function At(t) {
  if (t.hasAttribute("data-hui-dialog-initialized")) return;
  t.setAttribute("data-hui-dialog-initialized", "");
  let i = null, e = !1;
  const n = t.hasAttribute("data-hui-dialog-no-escape"), r = t.hasAttribute("data-hui-dialog-no-backdrop-close"), a = t.hasAttribute("data-hui-dialog-scroll-lock");
  function l() {
    if (t.open || e) return;
    i = document.activeElement, t.showModal(), t.setAttribute("data-hui-dialog-open", ""), a && (document.body.style.overflow = "hidden");
    const m = lt(t);
    m.length > 0 && m[0].focus();
    const c = tt(t);
    if (c.length > 0) {
      const p = c.filter((w) => j(w, "data-hui-dialog-enter")).map((w) => Z(w, "data-hui-dialog-enter"));
      Promise.all(p);
    }
    t.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
  }
  function h() {
    if (!t.open || e) return;
    const c = tt(t).filter((w) => j(w, "data-hui-dialog-leave"));
    function p() {
      t.close(), t.removeAttribute("data-hui-dialog-open"), a && (document.querySelector(
        "dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]"
      ) || (document.body.style.overflow = "")), i && i.focus && i.focus(), i = null, e = !1, t.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
    }
    if (c.length > 0) {
      e = !0;
      const w = c.map((C) => Z(C, "data-hui-dialog-leave"));
      Promise.all(w).then(p);
    } else
      p();
  }
  t.addEventListener("keydown", (m) => {
    mt(t, m);
  }), t.addEventListener("cancel", (m) => {
    m.preventDefault(), n || h();
  }), t.addEventListener("click", (m) => {
    m.target === t && !r && h();
  }), t.addEventListener("click", (m) => {
    m.target.closest("[data-hui-dialog-close]") && h();
  });
  const v = t.querySelector("[data-hui-dialog-title]"), A = t.querySelector("[data-hui-dialog-description]");
  v && (v.id || (v.id = `hui-dialog-title-${et()}`), t.setAttribute("aria-labelledby", v.id)), A && (A.id || (A.id = `hui-dialog-desc-${et()}`), t.setAttribute("aria-describedby", A.id)), t._hui = { open: l, close: h }, t.hasAttribute("data-hui-dialog-open") && (t.removeAttribute("data-hui-dialog-open"), l());
}
let wt = 0;
function et() {
  return `hui-${++wt}-${Date.now()}`;
}
function Et(t) {
  Array.from(t.querySelectorAll("[data-hui-dialog-trigger]")).forEach((e) => {
    e.hasAttribute("data-hui-dialog-trigger-bound") || (e.setAttribute("data-hui-dialog-trigger-bound", ""), e.addEventListener("click", () => {
      const n = e.getAttribute("data-hui-dialog-trigger");
      if (!n) return;
      const r = document.getElementById(n);
      !r || !r._hui || r._hui.open();
    }));
  });
}
function nt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-dialog]")).forEach(At), Et(t);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => nt()) : nt());
function it(t = document) {
  const i = Array.from(
    t.querySelectorAll("[data-hui-disclosure]")
  ), e = (r, a) => {
    const l = r.hasAttribute("open");
    if (a === "close" || a === void 0 && l) {
      r.removeAttribute("open"), r.removeAttribute("data-opened");
      return;
    }
    (a === "open" || a === void 0 && !l) && (r.setAttribute("open", ""), r.setAttribute("data-opened", String(Date.now())));
  }, n = (r, a, l) => {
    if (!Number.isFinite(a) || a <= 0) return;
    const v = Array.from(
      r.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((c) => c.hasAttribute("open")).sort((c, p) => {
      const w = Number(c.getAttribute("data-opened") ?? "0"), C = Number(p.getAttribute("data-opened") ?? "0");
      return w - C;
    });
    let m = v.length - a;
    if (!(m <= 0)) {
      for (const c of v) {
        if (m <= 0) break;
        l && c === l || (e(c, "close"), m--);
      }
      m > 0 && l && l.hasAttribute("open") && e(l, "close");
    }
  };
  i.forEach((r) => {
    const a = r.querySelector(
      "[data-hui-disclosure-summary]"
    );
    a && a.addEventListener("click", (l) => {
      var A;
      if (l.preventDefault(), r.hasAttribute("data-disabled")) return;
      const h = (A = r.parentElement) != null && A.matches("[data-hui-disclosure-container]") ? r.parentElement : null, v = !r.hasAttribute("open");
      if (e(r), h && v) {
        const m = h.getAttribute("data-max-count"), c = m ? parseInt(m, 10) : NaN;
        n(h, c, r);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => it()) : it());
const U = "[data-hui-dropdown-item]:not([data-disabled])";
function Lt(t, i) {
  const r = t.getBoundingClientRect(), { innerHeight: a } = window;
  i.style.maxHeight = "";
  const l = i.hasAttribute("hidden");
  l && i.removeAttribute("hidden");
  const h = i.style.visibility, v = i.style.display;
  i.style.visibility = "hidden", i.style.display = "block";
  const A = i.getBoundingClientRect().height;
  i.style.visibility = h, i.style.display = v, l && i.setAttribute("hidden", "");
  const m = a - r.bottom - 4 - 8, c = r.top - 4 - 8;
  let p;
  m >= A ? p = "bottom" : c >= A ? p = "top" : p = m >= c ? "bottom" : "top", p === "bottom" ? (i.style.top = "calc(100% + 4px)", i.style.bottom = "", m < A && (i.style.maxHeight = `${Math.floor(m)}px`)) : (i.style.bottom = "calc(100% + 4px)", i.style.top = "", c < A && (i.style.maxHeight = `${Math.floor(c)}px`)), i.setAttribute("data-placement", p);
}
function dt(t, i) {
  const e = (t.getAttribute(i) || "").split(/\s+/).filter(Boolean), n = (t.getAttribute(`${i}-from`) || "").split(/\s+/).filter(Boolean), r = (t.getAttribute(`${i}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: e, from: n, to: r };
}
function G(t, i) {
  return t.hasAttribute(i) || t.hasAttribute(`${i}-from`) || t.hasAttribute(`${i}-to`);
}
function ct() {
  return new Promise((t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  });
}
function ft(t) {
  return new Promise((i) => {
    const e = getComputedStyle(t), n = parseFloat(e.transitionDuration || "0"), r = parseFloat(e.transitionDelay || "0"), a = (n + r) * 1e3;
    if (a <= 0) {
      i();
      return;
    }
    let l = !1;
    const h = () => {
      l || (l = !0, t.removeEventListener("transitionend", h), i());
    };
    t.addEventListener("transitionend", h, { once: !0 }), setTimeout(h, a + 50);
  });
}
function xt(t) {
  if (!G(t, "data-hui-dropdown-enter")) return Promise.resolve();
  const { base: i, from: e, to: n } = dt(t, "data-hui-dropdown-enter");
  return i.length === 0 && e.length === 0 && n.length === 0 ? Promise.resolve() : (t.classList.add(...i, ...e), ct().then(() => (t.classList.remove(...e), t.classList.add(...n), ft(t))).then(() => {
    t.classList.remove(...i, ...n);
  }));
}
function kt(t) {
  if (!G(t, "data-hui-dropdown-leave")) return Promise.resolve();
  const { base: i, from: e, to: n } = dt(t, "data-hui-dropdown-leave");
  return i.length === 0 && e.length === 0 && n.length === 0 ? Promise.resolve() : (t.classList.add(...i, ...e), ct().then(() => (t.classList.remove(...e), t.classList.add(...n), ft(t))).then(() => {
    t.classList.remove(...i, ...n);
  }));
}
function St(t) {
  if (t.hasAttribute("data-hui-dropdown-initialized")) return;
  t.setAttribute("data-hui-dropdown-initialized", "");
  const i = t.querySelector("[data-hui-dropdown-trigger]"), e = t.querySelector("[data-hui-dropdown-items]");
  if (!i || !e) return;
  let n = !1, r = !1, a = -1, l = "", h = null;
  function v() {
    return Array.from(e.querySelectorAll(U));
  }
  function A(o) {
    v().forEach((L, y) => {
      y === o ? (L.setAttribute("data-active", ""), L.setAttribute("tabindex", "0"), L.focus()) : (L.removeAttribute("data-active"), L.setAttribute("tabindex", "-1"));
    }), a = o;
  }
  function m() {
    v().forEach((s) => {
      s.removeAttribute("data-active"), s.setAttribute("tabindex", "-1");
    }), a = -1;
  }
  function c(o = !1) {
    n || r || (n = !0, Lt(i, e), e.style.display = "block", e.removeAttribute("hidden"), i.setAttribute("aria-expanded", "true"), t.setAttribute("data-open", ""), o && v().length > 0 && A(0), xt(e), requestAnimationFrame(() => {
      document.addEventListener("pointerdown", C, !0);
    }), t.dispatchEvent(new CustomEvent("hui:dropdown:open", { bubbles: !0 })));
  }
  function p(o = !0) {
    if (!n || r) return;
    function s() {
      n = !1, r = !1, e.style.display = "none", e.setAttribute("hidden", ""), i.setAttribute("aria-expanded", "false"), t.removeAttribute("data-open"), m(), document.removeEventListener("pointerdown", C, !0), o && i.focus(), t.dispatchEvent(new CustomEvent("hui:dropdown:close", { bubbles: !0 }));
    }
    G(e, "data-hui-dropdown-leave") ? (r = !0, kt(e).then(s)) : s();
  }
  function w() {
    n ? p() : c();
  }
  function C(o) {
    t.contains(o.target) || p(!1);
  }
  function F(o) {
    l += o.toLowerCase(), h && clearTimeout(h), h = setTimeout(() => {
      l = "";
    }, 350);
    const L = v().findIndex((y) => (y.textContent || "").trim().toLowerCase().startsWith(l));
    L !== -1 && A(L);
  }
  function E(o) {
    const s = v();
    if (s.length !== 0)
      switch (o.key) {
        case "ArrowDown":
          if (o.preventDefault(), !n)
            c(!0);
          else {
            const L = a < s.length - 1 ? a + 1 : 0;
            A(L);
          }
          break;
        case "ArrowUp":
          if (o.preventDefault(), !n)
            c(), A(s.length - 1);
          else {
            const L = a > 0 ? a - 1 : s.length - 1;
            A(L);
          }
          break;
        case "Home":
          n && (o.preventDefault(), A(0));
          break;
        case "End":
          n && (o.preventDefault(), A(s.length - 1));
          break;
        case "Enter":
        case " ":
          o.preventDefault(), n && a >= 0 && a < s.length ? (s[a].click(), p()) : n || c(!0);
          break;
        case "Escape":
          n && (o.preventDefault(), p());
          break;
        case "Tab":
          n && p();
          break;
        default:
          n && o.key.length === 1 && !o.ctrlKey && !o.metaKey && !o.altKey && (o.preventDefault(), F(o.key));
          break;
      }
  }
  let S = e.id;
  S || (S = `hui-dropdown-items-${++Mt}-${Date.now()}`, e.id = S), i.setAttribute("aria-haspopup", "true"), i.setAttribute("aria-expanded", "false"), i.setAttribute("aria-controls", S), e.setAttribute("role", "menu"), e.style.display = "none", e.setAttribute("hidden", ""), v().forEach((o) => {
    o.getAttribute("role") || o.setAttribute("role", "menuitem"), o.setAttribute("tabindex", "-1");
  }), Array.from(e.querySelectorAll("[data-hui-dropdown-item]")).forEach((o) => {
    o.getAttribute("role") || o.setAttribute("role", "menuitem"), o.hasAttribute("data-disabled") && o.setAttribute("aria-disabled", "true");
  }), i.addEventListener("click", (o) => {
    o.preventDefault(), w();
  }), i.addEventListener("keydown", E), e.addEventListener("keydown", E), e.addEventListener("click", (o) => {
    var L;
    const s = o.target.closest(U);
    s && (s.dispatchEvent(new CustomEvent("hui:dropdown:select", {
      bubbles: !0,
      detail: { value: s.getAttribute("data-value") || ((L = s.textContent) == null ? void 0 : L.trim()) }
    })), p());
  }), e.addEventListener("pointerenter", (o) => {
    const s = o.target.closest(U);
    if (s) {
      const y = v().indexOf(s);
      y !== -1 && A(y);
    }
  }, !0), e.addEventListener("pointerleave", (o) => {
    o.target.closest(U) && m();
  }, !0), t._hui = { open: c, close: p, toggle: w };
}
let Mt = 0;
function rt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-dropdown]")).forEach(St);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => rt()) : rt());
function K(t, i, e) {
  return Math.min(Math.max(t, i), e);
}
function Y(t, i, e) {
  return e === i ? 0 : (t - i) / (e - i) * 100;
}
function ot(t = document) {
  Array.from(t.querySelectorAll("[data-hui-range-slider]")).forEach((e) => {
    const n = e.querySelector("[data-hui-range-slider-track]") || e, r = e.querySelector("[data-hui-range-slider-track-value]"), a = e.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), l = e.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), h = !!l, v = [a, l].filter(Boolean), A = Array.from(e.querySelectorAll('[data-hui-range-slider-value="min"]')), m = Array.from(e.querySelectorAll('[data-hui-range-slider-value="max"]')), c = A.filter((b) => b instanceof HTMLInputElement), p = m.filter((b) => b instanceof HTMLInputElement), w = A.filter((b) => !(b instanceof HTMLInputElement)), C = m.filter((b) => !(b instanceof HTMLInputElement));
    if (!a && !l) return;
    const F = () => {
      const b = a || l, u = Number(b.min || "0"), x = Number(b.max || "100"), g = Number(b.step || "1");
      return { min: u, max: x, step: g };
    }, { min: E, max: S, step: f } = F();
    function d() {
      const b = v.some((u) => !u.disabled);
      e.setAttribute("aria-disabled", b ? "false" : "true");
    }
    function o(b = "init") {
      let u = Number((a == null ? void 0 : a.value) ?? E), x = h ? Number(l.value) : S;
      if (u = K(u, E, S), x = K(x, E, S), h && (b === "min" && u > x && (u = x), b === "max" && x < u && (x = u)), a && Number(a.value) !== u && (a.value = String(u)), h && Number(l.value) !== x && (l.value = String(x)), c.forEach((g) => {
        Number(g.value) !== u && (g.value = String(u));
      }), p.forEach((g) => {
        h && Number(g.value) !== x && (g.value = String(x));
      }), w.forEach((g) => {
        g.textContent !== String(u) && (g.textContent = String(u));
      }), C.forEach((g) => {
        const k = String(x);
        g.textContent !== k && (g.textContent = k);
      }), r)
        if (h) {
          const g = Y(u, E, S), k = Y(x, E, S);
          r.style.left = `${g}%`, r.style.width = `${Math.max(0, k - g)}%`;
        } else {
          const g = Y(u, E, S);
          r.style.left = `${g}%`, r.style.width = `${Math.max(0, 100 - g)}%`;
        }
    }
    a && (a.addEventListener("input", () => o("min")), a.addEventListener("change", () => o("min"))), l && (l.addEventListener("input", () => o("max")), l.addEventListener("change", () => o("max")));
    const s = (b) => {
      const u = f || 1;
      return Math.round((b - E) / u) * u + E;
    };
    if (c.length && a) {
      const b = () => {
        const u = Number(c[c.length - 1].value);
        if (Number.isNaN(u)) return;
        const x = s(u), g = h ? Number(l.value) : S, k = K(x, E, g);
        String(k) !== a.value ? (a.value = String(k), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("min");
      };
      c.forEach((u) => {
        u.addEventListener("input", b), u.addEventListener("change", b);
      });
    }
    if (p.length && l) {
      const b = () => {
        const u = Number(p[p.length - 1].value);
        if (Number.isNaN(u)) return;
        const x = s(u), g = a ? Number(a.value) : E, k = K(x, g, S);
        String(k) !== l.value ? (l.value = String(k), l.dispatchEvent(new Event("input", { bubbles: !0 })), l.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("max");
      };
      p.forEach((u) => {
        u.addEventListener("input", b), u.addEventListener("change", b);
      });
    }
    function L(b) {
      if ((!a || a.disabled) && (!l || l.disabled)) return;
      const u = n.getBoundingClientRect(), x = K((b - u.left) / u.width, 0, 1), g = E + x * (S - E), k = Math.round((g - E) / (f || 1)) * (f || 1) + E, H = Number((a == null ? void 0 : a.value) ?? E), N = h ? Number(l.value) : S, R = Math.abs(k - H), X = h ? Math.abs(k - N) : 1 / 0;
      let B = "min";
      if (h && !l.disabled)
        if (a && !a.disabled)
          if (X === R) {
            const $ = (H + N) / 2;
            B = k > $ ? "max" : "min";
          } else
            B = X < R ? "max" : "min";
        else
          B = "max";
      if (B === "min" && a) {
        const $ = K(k, E, h ? Number(l.value) : S);
        String($) !== a.value ? (a.value = String($), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("min");
      } else if (B === "max" && l) {
        const $ = K(k, a ? Number(a.value) : E, S);
        String($) !== l.value ? (l.value = String($), l.dispatchEvent(new Event("input", { bubbles: !0 })), l.dispatchEvent(new Event("change", { bubbles: !0 }))) : o("max");
      }
    }
    function y(b) {
      let u = 0, x = !1, g = null;
      const k = 4, H = (M) => {
        g !== null && M.pointerId !== g || Math.abs(M.clientX - u) > k && (x = !0);
      }, N = (M) => {
        g !== null && M.pointerId !== g || (window.removeEventListener("pointermove", H, !0), window.removeEventListener("pointerup", N, !0), window.removeEventListener("pointercancel", N, !0), x || (L(M.clientX), M.preventDefault(), M.stopPropagation()), x = !1, g = null);
      };
      b.addEventListener("pointerdown", (M) => {
        u = M.clientX, x = !1, g = M.pointerId, window.addEventListener("pointermove", H, !0), window.addEventListener("pointerup", N, !0), window.addEventListener("pointercancel", N, !0);
      }, !0);
      let R = 0, X = !1;
      const B = (M) => {
        Math.abs(M.clientX - R) > k && (X = !0);
      }, $ = (M) => {
        window.removeEventListener("mousemove", B, !0), window.removeEventListener("mouseup", $, !0), X || (L(M.clientX), M.preventDefault(), M.stopPropagation()), X = !1;
      };
      b.addEventListener("mousedown", (M) => {
        R = M.clientX, X = !1, window.addEventListener("mousemove", B, !0), window.addEventListener("mouseup", $, !0);
      }, !0);
    }
    y(n);
    const I = new MutationObserver(() => d());
    v.forEach((b) => I.observe(b, { attributes: !0, attributeFilter: ["disabled"] })), d(), o("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ot()) : ot());
function P(t, i) {
  return t.hasAttribute(i);
}
function W(t) {
  for (let i = 0; i < t.length; i++)
    if (!P(t[i], "data-disabled")) return i;
  return 0;
}
function at(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tabs]")).forEach((e) => {
    const n = e.querySelector("[data-hui-tablist]") || e, r = Array.from(e.querySelectorAll("[data-hui-tab]")), a = Array.from(e.querySelectorAll("[data-hui-tabpanel]"));
    if (!r.length || !a.length) return;
    const l = e.getAttribute("data-hui-tabs-orientation") === "vertical" || e.hasAttribute("data-hui-tabs-vertical");
    n.setAttribute("role", "tablist"), n.setAttribute("aria-orientation", l ? "vertical" : "horizontal");
    const h = Math.random().toString(36).slice(2);
    r.forEach((f, d) => {
      f.id || (f.id = `hui-tab-${h}-${d}`);
    }), a.forEach((f, d) => {
      f.id || (f.id = `hui-tabpanel-${h}-${d}`);
    });
    const v = Math.min(r.length, a.length);
    for (let f = 0; f < v; f++) {
      const d = r[f], o = a[f];
      d.setAttribute("role", "tab"), o.setAttribute("role", "tabpanel"), d.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", d.id);
    }
    function A() {
      const f = e.getAttribute("data-hui-tabs-initial-index");
      if (f !== null) {
        const d = parseInt(f, 10);
        if (!Number.isNaN(d) && d >= 0 && d < v) return d;
      }
      for (let d = 0; d < v; d++) {
        const o = r[d], s = a[d];
        if (P(o, "data-active") || P(s, "data-active"))
          return d;
      }
      return W(r);
    }
    function m(f, d) {
      let o = f;
      for (let s = 0; s < v; s++)
        if (o = (o + d + v) % v, !P(r[o], "data-disabled")) return o;
      return f;
    }
    let c = Math.max(0, Math.min(A(), v - 1));
    P(r[c], "data-disabled") && (c = W(r));
    let p = !1;
    function w(f, d, o) {
      const s = f.hasAttribute(d);
      o && !s && f.setAttribute(d, ""), !o && s && f.removeAttribute(d);
    }
    function C(f, d, o) {
      f.getAttribute(d) !== o && f.setAttribute(d, o);
    }
    function F(f = !1) {
      p = !0;
      for (let d = 0; d < v; d++) {
        const o = d === c, s = r[d], L = a[d];
        C(s, "aria-selected", o ? "true" : "false"), s.tabIndex = o && !P(s, "data-disabled") ? 0 : -1, w(s, "data-active", o), w(L, "data-active", o), w(L, "hidden", !o);
      }
      f && r[c].focus(), p = !1;
    }
    function E(f, d = !1) {
      if (!(f < 0 || f >= v) && !P(r[f], "data-disabled")) {
        if (f === c) {
          d && r[c].focus();
          return;
        }
        c = f, F(d);
      }
    }
    r.forEach((f, d) => {
      f.addEventListener("click", (o) => {
        if (P(f, "data-disabled")) {
          o.preventDefault();
          return;
        }
        E(d, !0);
      });
    });
    const S = (f) => {
      const d = f.key;
      let o = !1;
      l ? (d === "ArrowUp" && (E(m(c, -1), !0), o = !0), d === "ArrowDown" && (E(m(c, 1), !0), o = !0)) : (d === "ArrowLeft" && (E(m(c, -1), !0), o = !0), d === "ArrowRight" && (E(m(c, 1), !0), o = !0)), d === "Home" && (E(W(r), !0), o = !0), d === "End" && (E((() => {
        for (let s = v - 1; s >= 0; s--)
          if (!P(r[s], "data-disabled")) return s;
        return c;
      })(), !0), o = !0), (d === "Enter" || d === " ") && (E(c, !0), o = !0), o && (f.preventDefault(), f.stopPropagation());
    };
    n.addEventListener("keydown", S);
    try {
      const f = new MutationObserver((d) => {
        if (p) return;
        let o = !1;
        for (const s of d)
          s.type === "attributes" && (s.attributeName === "data-disabled" || s.attributeName === "data-active") && (o = !0);
        if (o) {
          if (P(r[c], "data-disabled"))
            c = W(r);
          else
            for (let s = 0; s < v; s++)
              if (s !== c && P(r[s], "data-active")) {
                c = s;
                break;
              }
          F(!1);
        }
      });
      r.forEach((d) => f.observe(d, { attributes: !0, attributeFilter: ["data-disabled", "data-active"] }));
    } catch {
    }
    F(!1);
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => at()) : at());
function st(t = document) {
  Array.from(t.querySelectorAll("[data-hui-toggle]")).forEach((e) => {
    const n = e.querySelector(".hui-toggle-input") || void 0, r = e.querySelector(".hui-toggle-thumb") || void 0, a = () => e.getAttribute("aria-disabled") === "true", l = (p) => {
      const w = p ? "true" : "false";
      e.setAttribute("aria-checked", w), r && r.setAttribute("aria-checked", w);
    }, h = () => e.getAttribute("aria-checked") === "true", v = n ? !!n.checked : h();
    l(v), r && r.setAttribute("aria-disabled", a() ? "true" : "false");
    function A(p) {
      n && n.checked !== p && (n.checked = p, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function m(p) {
      l(p), A(p);
    }
    function c() {
      a() || m(!h());
    }
    e.addEventListener("click", (p) => {
      a() || c();
    }), e.addEventListener("keydown", (p) => {
      if (a()) return;
      p.key === "Spacebar" && (p.preventDefault(), c());
    }), n && (n.addEventListener("change", () => m(!!n.checked)), new MutationObserver(() => {
      e.setAttribute("aria-disabled", n.disabled ? "true" : "false"), r && r.setAttribute("aria-disabled", n.disabled ? "true" : "false"), m(!!n.checked);
    }).observe(n, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => st()) : st());
function O(t, i, e) {
  return Math.min(Math.max(t, i), e);
}
function ut(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tooltip]")).forEach((e) => {
    let n = e.querySelector("[data-hui-tooltip-content]");
    if (!n || n === null) return;
    n = n, n.style.position = "fixed", n.style.left = "-10000px", n.style.top = "-10000px";
    let r = !1, a = !1, l = null, h = !1;
    function v() {
      return e.hasAttribute("data-hui-tooltip-disabled");
    }
    function A() {
      return e.hasAttribute("data-hui-tooltip-open");
    }
    function m(s) {
      (s.key === "Escape" || s.key === "Esc") && C();
    }
    function c() {
      if (n === null) return { w: 0, h: 0 };
      const s = n.style.display, L = n.style.visibility;
      n.style.visibility = "hidden", n.style.display = "block";
      const y = n.getBoundingClientRect(), I = y.width, b = y.height;
      return n.style.display = s || "", n.style.visibility = L || "", { w: I, h: b };
    }
    function p() {
      if (n === null) return;
      const { innerWidth: s, innerHeight: L } = window, y = e.getBoundingClientRect(), { w: I, h: b } = c(), u = 8, x = n.getAttribute("data-hui-tooltip-position") || "top", g = x === "bottom" || x === "left" || x === "right" ? x : "top", k = y.top, H = L - y.bottom, N = y.left, R = s - y.right, X = k >= b + u, B = H >= b + u, $ = N >= I + u, M = R >= I + u, ht = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let V;
      g === "top" || g === "bottom" ? V = N >= R ? ["left", "right"] : ["right", "left"] : V = k >= H ? ["top", "bottom"] : ["bottom", "top"];
      const pt = [g, ht[g], ...V];
      let _ = null;
      for (const D of pt)
        if (D === "top" && X || D === "bottom" && B || D === "left" && $ || D === "right" && M) {
          _ = D;
          break;
        }
      if (_ === null) {
        const D = {
          top: k,
          bottom: H,
          left: N,
          right: R
        };
        _ = ["top", "bottom", "left", "right"].reduce((z, J) => D[J] > D[z] ? J : z, "top");
      }
      let T, q;
      if (_ === "top" ? (q = y.top - b - u, T = y.left + y.width / 2 - I / 2, q = O(q, u, Math.max(u, L - u - b)), T = O(T, u, Math.max(u, s - u - I))) : _ === "bottom" ? (q = y.bottom + u, T = y.left + y.width / 2 - I / 2, q = O(q, u, Math.max(u, L - u - b)), T = O(T, u, Math.max(u, s - u - I))) : _ === "left" ? (T = y.left - I - u, q = y.top + y.height / 2 - b / 2, T = O(T, u, Math.max(u, s - u - I)), q = O(q, u, Math.max(u, L - u - b))) : (T = y.right + u, q = y.top + y.height / 2 - b / 2, T = O(T, u, Math.max(u, s - u - I)), q = O(q, u, Math.max(u, L - u - b))), n.style.left = `${Math.round(T)}px`, n.style.top = `${Math.round(q)}px`, n.setAttribute("data-placement", _), _ === "top" || _ === "bottom") {
        const D = y.left + y.width / 2, z = O(D - T, 6, Math.max(6, I - 6));
        n.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(z)}px`), n.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const D = y.top + y.height / 2, z = O(D - q, 6, Math.max(6, b - 6));
        n.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(z)}px`), n.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const D = getComputedStyle(n).backgroundColor;
        !D || D === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(D) ? n.style.removeProperty("--hui-tooltip-bg") : n.style.setProperty("--hui-tooltip-bg", D);
      } catch {
      }
    }
    function w() {
      n !== null && (v() && !A() || r || (r = !0, n.style.display = "block", n.setAttribute("aria-hidden", "false"), n.setAttribute("data-open", "true"), p(), window.addEventListener("scroll", E, !0), window.addEventListener("resize", S, !0), document.addEventListener("pointerdown", F, !0), document.addEventListener("keydown", m, !0)));
    }
    function C() {
      n !== null && r && (v() && A() || (r = !1, n.style.display = "none", n.setAttribute("aria-hidden", "true"), n.setAttribute("data-open", "false"), window.removeEventListener("scroll", E, !0), window.removeEventListener("resize", S, !0), document.removeEventListener("pointerdown", F, !0), document.removeEventListener("keydown", m, !0)));
    }
    function F(s) {
      e.contains(s.target) || C();
    }
    function E() {
      r && p();
    }
    function S() {
      r && p();
    }
    function f() {
      l !== null && window.clearTimeout(l), l = window.setTimeout(() => {
        a || C();
      }, 60);
    }
    function d(s) {
      h = s.pointerType === "touch", !h && (a = !0, l !== null && (window.clearTimeout(l), l = null), w());
    }
    function o() {
      h || (a = !1, f());
    }
    e.addEventListener("pointerenter", d), e.addEventListener("pointerleave", o), n.addEventListener("pointerenter", d), n.addEventListener("pointerleave", o), e.addEventListener("focusin", () => w()), e.addEventListener("focusout", () => {
      setTimeout(() => {
        const s = document.activeElement;
        s && e.contains(s) || C();
      }, 0);
    }), e.addEventListener("pointerup", (s) => {
      (s.pointerType === "touch" || s.pointerType === "pen") && (h = !0, w());
    }), e.addEventListener("click", (s) => {
      h && w();
    }), e.hasAttribute("data-hui-tooltip-open") && w();
    try {
      new MutationObserver((L) => {
        for (const y of L)
          y.type === "attributes" && (y.attributeName === "data-hui-tooltip-disabled" && (v() ? A() ? w() : C() : A() && w()), y.attributeName === "data-hui-tooltip-open" && (A() ? w() : C()));
      }).observe(e, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ut()) : ut());
function Dt(...t) {
  return t.filter(Boolean).join(" ");
}
export {
  Dt as cn
};
