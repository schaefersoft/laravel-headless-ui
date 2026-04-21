function G(t = document) {
  Array.from(t.querySelectorAll("[data-ui-avatar]")).forEach((i) => {
    const e = i.querySelector("img"), n = i.querySelector("[data-ui-avatar-fallback]");
    function o() {
      e && (e.style.display = "none"), n && (n.style.display = "flex", n.setAttribute("aria-hidden", "false"));
    }
    if (e) {
      e.addEventListener("error", o, { once: !0 });
      const a = e;
      typeof a.naturalWidth == "number" && a.naturalWidth === 0 && a.complete === !0 && o();
    } else
      n && (n.style.display = "flex", n.setAttribute("aria-hidden", "false"));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => G()) : G());
const lt = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function at(t) {
  return Array.from(t.querySelectorAll(lt));
}
function dt(t, l) {
  if (l.key !== "Tab") return;
  const i = at(t);
  if (i.length === 0) {
    l.preventDefault();
    return;
  }
  const e = i[0], n = i[i.length - 1];
  l.shiftKey ? document.activeElement === e && (l.preventDefault(), n.focus()) : document.activeElement === n && (l.preventDefault(), e.focus());
}
function ct(t, l) {
  const i = (t.getAttribute(`${l}`) || "").split(/\s+/).filter(Boolean), e = (t.getAttribute(`${l}-from`) || "").split(/\s+/).filter(Boolean), n = (t.getAttribute(`${l}-to`) || "").split(/\s+/).filter(Boolean);
  return { base: i, from: e, to: n };
}
function W(t, l) {
  return t.hasAttribute(l) || t.hasAttribute(`${l}-from`) || t.hasAttribute(`${l}-to`);
}
function ft() {
  return new Promise((t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  });
}
function ht(t) {
  return new Promise((l) => {
    const i = getComputedStyle(t), e = parseFloat(i.transitionDuration || "0"), n = parseFloat(i.transitionDelay || "0"), o = (e + n) * 1e3;
    if (o <= 0) {
      l();
      return;
    }
    let a = !1;
    const p = () => {
      a || (a = !0, t.removeEventListener("transitionend", p), l());
    };
    t.addEventListener("transitionend", p, { once: !0 }), setTimeout(p, o + 50);
  });
}
function J(t, l) {
  const { base: i, from: e, to: n } = ct(t, l);
  return i.length === 0 && e.length === 0 && n.length === 0 ? Promise.resolve() : (t.classList.add(...i, ...e), ft().then(() => (t.classList.remove(...e), t.classList.add(...n), ht(t))).then(() => {
    t.classList.remove(...i, ...n);
  }));
}
function Q(t) {
  const l = [];
  return (W(t, "data-hui-dialog-enter") || W(t, "data-hui-dialog-leave")) && l.push(t), l.push(...Array.from(t.querySelectorAll(
    "[data-hui-dialog-enter], [data-hui-dialog-leave]"
  ))), l;
}
function pt(t) {
  if (t.hasAttribute("data-hui-dialog-initialized")) return;
  t.setAttribute("data-hui-dialog-initialized", "");
  let l = null, i = !1;
  const e = t.hasAttribute("data-hui-dialog-no-escape"), n = t.hasAttribute("data-hui-dialog-no-backdrop-close"), o = t.hasAttribute("data-hui-dialog-scroll-lock");
  function a() {
    if (t.open || i) return;
    l = document.activeElement, t.showModal(), t.setAttribute("data-hui-dialog-open", ""), o && (document.body.style.overflow = "hidden");
    const m = at(t);
    m.length > 0 && m[0].focus();
    const f = Q(t);
    if (f.length > 0) {
      const v = f.filter((E) => W(E, "data-hui-dialog-enter")).map((E) => J(E, "data-hui-dialog-enter"));
      Promise.all(v);
    }
    t.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
  }
  function p() {
    if (!t.open || i) return;
    const f = Q(t).filter((E) => W(E, "data-hui-dialog-leave"));
    function v() {
      t.close(), t.removeAttribute("data-hui-dialog-open"), o && (document.querySelector(
        "dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]"
      ) || (document.body.style.overflow = "")), l && l.focus && l.focus(), l = null, i = !1, t.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
    }
    if (f.length > 0) {
      i = !0;
      const E = f.map((D) => J(D, "data-hui-dialog-leave"));
      Promise.all(E).then(v);
    } else
      v();
  }
  t.addEventListener("keydown", (m) => {
    dt(t, m);
  }), t.addEventListener("cancel", (m) => {
    m.preventDefault(), e || p();
  }), t.addEventListener("click", (m) => {
    m.target === t && !n && p();
  }), t.addEventListener("click", (m) => {
    m.target.closest("[data-hui-dialog-close]") && p();
  });
  const g = t.querySelector("[data-hui-dialog-title]"), S = t.querySelector("[data-hui-dialog-description]");
  g && (g.id || (g.id = `hui-dialog-title-${Z()}`), t.setAttribute("aria-labelledby", g.id)), S && (S.id || (S.id = `hui-dialog-desc-${Z()}`), t.setAttribute("aria-describedby", S.id)), t._hui = { open: a, close: p }, t.hasAttribute("data-hui-dialog-open") && (t.removeAttribute("data-hui-dialog-open"), a());
}
let bt = 0;
function Z() {
  return `hui-${++bt}-${Date.now()}`;
}
function mt(t) {
  Array.from(t.querySelectorAll("[data-hui-dialog-trigger]")).forEach((i) => {
    i.hasAttribute("data-hui-dialog-trigger-bound") || (i.setAttribute("data-hui-dialog-trigger-bound", ""), i.addEventListener("click", () => {
      const e = i.getAttribute("data-hui-dialog-trigger");
      if (!e) return;
      const n = document.getElementById(e);
      !n || !n._hui || n._hui.open();
    }));
  });
}
function tt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-dialog]")).forEach(pt), mt(t);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => tt()) : tt());
function et(t = document) {
  const l = Array.from(
    t.querySelectorAll("[data-hui-disclosure]")
  ), i = (n, o) => {
    const a = n.hasAttribute("open");
    if (o === "close" || o === void 0 && a) {
      n.removeAttribute("open"), n.removeAttribute("data-opened");
      return;
    }
    (o === "open" || o === void 0 && !a) && (n.setAttribute("open", ""), n.setAttribute("data-opened", String(Date.now())));
  }, e = (n, o, a) => {
    if (!Number.isFinite(o) || o <= 0) return;
    const g = Array.from(
      n.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((f) => f.hasAttribute("open")).sort((f, v) => {
      const E = Number(f.getAttribute("data-opened") ?? "0"), D = Number(v.getAttribute("data-opened") ?? "0");
      return E - D;
    });
    let m = g.length - o;
    if (!(m <= 0)) {
      for (const f of g) {
        if (m <= 0) break;
        a && f === a || (i(f, "close"), m--);
      }
      m > 0 && a && a.hasAttribute("open") && i(a, "close");
    }
  };
  l.forEach((n) => {
    const o = n.querySelector(
      "[data-hui-disclosure-summary]"
    );
    o && o.addEventListener("click", (a) => {
      var S;
      if (a.preventDefault(), n.hasAttribute("data-disabled")) return;
      const p = (S = n.parentElement) != null && S.matches("[data-hui-disclosure-container]") ? n.parentElement : null, g = !n.hasAttribute("open");
      if (i(n), p && g) {
        const m = p.getAttribute("data-max-count"), f = m ? parseInt(m, 10) : NaN;
        e(p, f, n);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => et()) : et());
function U(t, l, i) {
  return Math.min(Math.max(t, l), i);
}
function Y(t, l, i) {
  return i === l ? 0 : (t - l) / (i - l) * 100;
}
function nt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-range-slider]")).forEach((i) => {
    const e = i.querySelector("[data-hui-range-slider-track]") || i, n = i.querySelector("[data-hui-range-slider-track-value]"), o = i.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), a = i.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), p = !!a, g = [o, a].filter(Boolean), S = Array.from(i.querySelectorAll('[data-hui-range-slider-value="min"]')), m = Array.from(i.querySelectorAll('[data-hui-range-slider-value="max"]')), f = S.filter((h) => h instanceof HTMLInputElement), v = m.filter((h) => h instanceof HTMLInputElement), E = S.filter((h) => !(h instanceof HTMLInputElement)), D = m.filter((h) => !(h instanceof HTMLInputElement));
    if (!o && !a) return;
    const _ = () => {
      const h = o || a, r = Number(h.min || "0"), y = Number(h.max || "100"), b = Number(h.step || "1");
      return { min: r, max: y, step: b };
    }, { min: w, max: k, step: c } = _();
    function s() {
      const h = g.some((r) => !r.disabled);
      i.setAttribute("aria-disabled", h ? "false" : "true");
    }
    function d(h = "init") {
      let r = Number((o == null ? void 0 : o.value) ?? w), y = p ? Number(a.value) : k;
      if (r = U(r, w, k), y = U(y, w, k), p && (h === "min" && r > y && (r = y), h === "max" && y < r && (y = r)), o && Number(o.value) !== r && (o.value = String(r)), p && Number(a.value) !== y && (a.value = String(y)), f.forEach((b) => {
        Number(b.value) !== r && (b.value = String(r));
      }), v.forEach((b) => {
        p && Number(b.value) !== y && (b.value = String(y));
      }), E.forEach((b) => {
        b.textContent !== String(r) && (b.textContent = String(r));
      }), D.forEach((b) => {
        const L = String(y);
        b.textContent !== L && (b.textContent = L);
      }), n)
        if (p) {
          const b = Y(r, w, k), L = Y(y, w, k);
          n.style.left = `${b}%`, n.style.width = `${Math.max(0, L - b)}%`;
        } else {
          const b = Y(r, w, k);
          n.style.left = `${b}%`, n.style.width = `${Math.max(0, 100 - b)}%`;
        }
    }
    o && (o.addEventListener("input", () => d("min")), o.addEventListener("change", () => d("min"))), a && (a.addEventListener("input", () => d("max")), a.addEventListener("change", () => d("max")));
    const u = (h) => {
      const r = c || 1;
      return Math.round((h - w) / r) * r + w;
    };
    if (f.length && o) {
      const h = () => {
        const r = Number(f[f.length - 1].value);
        if (Number.isNaN(r)) return;
        const y = u(r), b = p ? Number(a.value) : k, L = U(y, w, b);
        String(L) !== o.value ? (o.value = String(L), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 }))) : d("min");
      };
      f.forEach((r) => {
        r.addEventListener("input", h), r.addEventListener("change", h);
      });
    }
    if (v.length && a) {
      const h = () => {
        const r = Number(v[v.length - 1].value);
        if (Number.isNaN(r)) return;
        const y = u(r), b = o ? Number(o.value) : w, L = U(y, b, k);
        String(L) !== a.value ? (a.value = String(L), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : d("max");
      };
      v.forEach((r) => {
        r.addEventListener("input", h), r.addEventListener("change", h);
      });
    }
    function N(h) {
      if ((!o || o.disabled) && (!a || a.disabled)) return;
      const r = e.getBoundingClientRect(), y = U((h - r.left) / r.width, 0, 1), b = w + y * (k - w), L = Math.round((b - w) / (c || 1)) * (c || 1) + w, B = Number((o == null ? void 0 : o.value) ?? w), $ = p ? Number(a.value) : k, X = Math.abs(L - B), R = p ? Math.abs(L - $) : 1 / 0;
      let P = "min";
      if (p && !a.disabled)
        if (o && !o.disabled)
          if (R === X) {
            const I = (B + $) / 2;
            P = L > I ? "max" : "min";
          } else
            P = R < X ? "max" : "min";
        else
          P = "max";
      if (P === "min" && o) {
        const I = U(L, w, p ? Number(a.value) : k);
        String(I) !== o.value ? (o.value = String(I), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 }))) : d("min");
      } else if (P === "max" && a) {
        const I = U(L, o ? Number(o.value) : w, k);
        String(I) !== a.value ? (a.value = String(I), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : d("max");
      }
    }
    function A(h) {
      let r = 0, y = !1, b = null;
      const L = 4, B = (x) => {
        b !== null && x.pointerId !== b || Math.abs(x.clientX - r) > L && (y = !0);
      }, $ = (x) => {
        b !== null && x.pointerId !== b || (window.removeEventListener("pointermove", B, !0), window.removeEventListener("pointerup", $, !0), window.removeEventListener("pointercancel", $, !0), y || (N(x.clientX), x.preventDefault(), x.stopPropagation()), y = !1, b = null);
      };
      h.addEventListener("pointerdown", (x) => {
        r = x.clientX, y = !1, b = x.pointerId, window.addEventListener("pointermove", B, !0), window.addEventListener("pointerup", $, !0), window.addEventListener("pointercancel", $, !0);
      }, !0);
      let X = 0, R = !1;
      const P = (x) => {
        Math.abs(x.clientX - X) > L && (R = !0);
      }, I = (x) => {
        window.removeEventListener("mousemove", P, !0), window.removeEventListener("mouseup", I, !0), R || (N(x.clientX), x.preventDefault(), x.stopPropagation()), R = !1;
      };
      h.addEventListener("mousedown", (x) => {
        X = x.clientX, R = !1, window.addEventListener("mousemove", P, !0), window.addEventListener("mouseup", I, !0);
      }, !0);
    }
    A(e);
    const T = new MutationObserver(() => s());
    g.forEach((h) => T.observe(h, { attributes: !0, attributeFilter: ["disabled"] })), s(), d("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => nt()) : nt());
function F(t, l) {
  return t.hasAttribute(l);
}
function K(t) {
  for (let l = 0; l < t.length; l++)
    if (!F(t[l], "data-disabled")) return l;
  return 0;
}
function it(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tabs]")).forEach((i) => {
    const e = i.querySelector("[data-hui-tablist]") || i, n = Array.from(i.querySelectorAll("[data-hui-tab]")), o = Array.from(i.querySelectorAll("[data-hui-tabpanel]"));
    if (!n.length || !o.length) return;
    const a = i.getAttribute("data-hui-tabs-orientation") === "vertical" || i.hasAttribute("data-hui-tabs-vertical");
    e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", a ? "vertical" : "horizontal");
    const p = Math.random().toString(36).slice(2);
    n.forEach((c, s) => {
      c.id || (c.id = `hui-tab-${p}-${s}`);
    }), o.forEach((c, s) => {
      c.id || (c.id = `hui-tabpanel-${p}-${s}`);
    });
    const g = Math.min(n.length, o.length);
    for (let c = 0; c < g; c++) {
      const s = n[c], d = o[c];
      s.setAttribute("role", "tab"), d.setAttribute("role", "tabpanel"), s.setAttribute("aria-controls", d.id), d.setAttribute("aria-labelledby", s.id);
    }
    function S() {
      const c = i.getAttribute("data-hui-tabs-initial-index");
      if (c !== null) {
        const s = parseInt(c, 10);
        if (!Number.isNaN(s) && s >= 0 && s < g) return s;
      }
      for (let s = 0; s < g; s++) {
        const d = n[s], u = o[s];
        if (F(d, "data-active") || F(u, "data-active"))
          return s;
      }
      return K(n);
    }
    function m(c, s) {
      let d = c;
      for (let u = 0; u < g; u++)
        if (d = (d + s + g) % g, !F(n[d], "data-disabled")) return d;
      return c;
    }
    let f = Math.max(0, Math.min(S(), g - 1));
    F(n[f], "data-disabled") && (f = K(n));
    let v = !1;
    function E(c, s, d) {
      const u = c.hasAttribute(s);
      d && !u && c.setAttribute(s, ""), !d && u && c.removeAttribute(s);
    }
    function D(c, s, d) {
      c.getAttribute(s) !== d && c.setAttribute(s, d);
    }
    function _(c = !1) {
      v = !0;
      for (let s = 0; s < g; s++) {
        const d = s === f, u = n[s], N = o[s];
        D(u, "aria-selected", d ? "true" : "false"), u.tabIndex = d && !F(u, "data-disabled") ? 0 : -1, E(u, "data-active", d), E(N, "data-active", d), E(N, "hidden", !d);
      }
      c && n[f].focus(), v = !1;
    }
    function w(c, s = !1) {
      if (!(c < 0 || c >= g) && !F(n[c], "data-disabled")) {
        if (c === f) {
          s && n[f].focus();
          return;
        }
        f = c, _(s);
      }
    }
    n.forEach((c, s) => {
      c.addEventListener("click", (d) => {
        if (F(c, "data-disabled")) {
          d.preventDefault();
          return;
        }
        w(s, !0);
      });
    });
    const k = (c) => {
      const s = c.key;
      let d = !1;
      a ? (s === "ArrowUp" && (w(m(f, -1), !0), d = !0), s === "ArrowDown" && (w(m(f, 1), !0), d = !0)) : (s === "ArrowLeft" && (w(m(f, -1), !0), d = !0), s === "ArrowRight" && (w(m(f, 1), !0), d = !0)), s === "Home" && (w(K(n), !0), d = !0), s === "End" && (w((() => {
        for (let u = g - 1; u >= 0; u--)
          if (!F(n[u], "data-disabled")) return u;
        return f;
      })(), !0), d = !0), (s === "Enter" || s === " ") && (w(f, !0), d = !0), d && (c.preventDefault(), c.stopPropagation());
    };
    e.addEventListener("keydown", k);
    try {
      const c = new MutationObserver((s) => {
        if (v) return;
        let d = !1;
        for (const u of s)
          u.type === "attributes" && (u.attributeName === "data-disabled" || u.attributeName === "data-active") && (d = !0);
        if (d) {
          if (F(n[f], "data-disabled"))
            f = K(n);
          else
            for (let u = 0; u < g; u++)
              if (u !== f && F(n[u], "data-active")) {
                f = u;
                break;
              }
          _(!1);
        }
      });
      n.forEach((s) => c.observe(s, { attributes: !0, attributeFilter: ["data-disabled", "data-active"] }));
    } catch {
    }
    _(!1);
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => it()) : it());
function rt(t = document) {
  Array.from(t.querySelectorAll("[data-hui-toggle]")).forEach((i) => {
    const e = i.querySelector(".hui-toggle-input") || void 0, n = i.querySelector(".hui-toggle-thumb") || void 0, o = () => i.getAttribute("aria-disabled") === "true", a = (v) => {
      const E = v ? "true" : "false";
      i.setAttribute("aria-checked", E), n && n.setAttribute("aria-checked", E);
    }, p = () => i.getAttribute("aria-checked") === "true", g = e ? !!e.checked : p();
    a(g), n && n.setAttribute("aria-disabled", o() ? "true" : "false");
    function S(v) {
      e && e.checked !== v && (e.checked = v, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function m(v) {
      a(v), S(v);
    }
    function f() {
      o() || m(!p());
    }
    i.addEventListener("click", (v) => {
      o() || f();
    }), i.addEventListener("keydown", (v) => {
      if (o()) return;
      v.key === "Spacebar" && (v.preventDefault(), f());
    }), e && (e.addEventListener("change", () => m(!!e.checked)), new MutationObserver(() => {
      i.setAttribute("aria-disabled", e.disabled ? "true" : "false"), n && n.setAttribute("aria-disabled", e.disabled ? "true" : "false"), m(!!e.checked);
    }).observe(e, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => rt()) : rt());
function O(t, l, i) {
  return Math.min(Math.max(t, l), i);
}
function ot(t = document) {
  Array.from(t.querySelectorAll("[data-hui-tooltip]")).forEach((i) => {
    let e = i.querySelector("[data-hui-tooltip-content]");
    if (!e || e === null) return;
    e = e, e.style.position = "fixed", e.style.left = "-10000px", e.style.top = "-10000px";
    let n = !1, o = !1, a = null, p = !1;
    function g() {
      return i.hasAttribute("data-hui-tooltip-disabled");
    }
    function S() {
      return i.hasAttribute("data-hui-tooltip-open");
    }
    function m(u) {
      (u.key === "Escape" || u.key === "Esc") && D();
    }
    function f() {
      if (e === null) return { w: 0, h: 0 };
      const u = e.style.display, N = e.style.visibility;
      e.style.visibility = "hidden", e.style.display = "block";
      const A = e.getBoundingClientRect(), T = A.width, h = A.height;
      return e.style.display = u || "", e.style.visibility = N || "", { w: T, h };
    }
    function v() {
      if (e === null) return;
      const { innerWidth: u, innerHeight: N } = window, A = i.getBoundingClientRect(), { w: T, h } = f(), r = 8, y = e.getAttribute("data-hui-tooltip-position") || "top", b = y === "bottom" || y === "left" || y === "right" ? y : "top", L = A.top, B = N - A.bottom, $ = A.left, X = u - A.right, R = L >= h + r, P = B >= h + r, I = $ >= T + r, x = X >= T + r, st = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let j;
      b === "top" || b === "bottom" ? j = $ >= X ? ["left", "right"] : ["right", "left"] : j = L >= B ? ["top", "bottom"] : ["bottom", "top"];
      const ut = [b, st[b], ...j];
      let H = null;
      for (const M of ut)
        if (M === "top" && R || M === "bottom" && P || M === "left" && I || M === "right" && x) {
          H = M;
          break;
        }
      if (H === null) {
        const M = {
          top: L,
          bottom: B,
          left: $,
          right: X
        };
        H = ["top", "bottom", "left", "right"].reduce((z, V) => M[V] > M[z] ? V : z, "top");
      }
      let C, q;
      if (H === "top" ? (q = A.top - h - r, C = A.left + A.width / 2 - T / 2, q = O(q, r, Math.max(r, N - r - h)), C = O(C, r, Math.max(r, u - r - T))) : H === "bottom" ? (q = A.bottom + r, C = A.left + A.width / 2 - T / 2, q = O(q, r, Math.max(r, N - r - h)), C = O(C, r, Math.max(r, u - r - T))) : H === "left" ? (C = A.left - T - r, q = A.top + A.height / 2 - h / 2, C = O(C, r, Math.max(r, u - r - T)), q = O(q, r, Math.max(r, N - r - h))) : (C = A.right + r, q = A.top + A.height / 2 - h / 2, C = O(C, r, Math.max(r, u - r - T)), q = O(q, r, Math.max(r, N - r - h))), e.style.left = `${Math.round(C)}px`, e.style.top = `${Math.round(q)}px`, e.setAttribute("data-placement", H), H === "top" || H === "bottom") {
        const M = A.left + A.width / 2, z = O(M - C, 6, Math.max(6, T - 6));
        e.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(z)}px`), e.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const M = A.top + A.height / 2, z = O(M - q, 6, Math.max(6, h - 6));
        e.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(z)}px`), e.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const M = getComputedStyle(e).backgroundColor;
        !M || M === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(M) ? e.style.removeProperty("--hui-tooltip-bg") : e.style.setProperty("--hui-tooltip-bg", M);
      } catch {
      }
    }
    function E() {
      e !== null && (g() && !S() || n || (n = !0, e.style.display = "block", e.setAttribute("aria-hidden", "false"), e.setAttribute("data-open", "true"), v(), window.addEventListener("scroll", w, !0), window.addEventListener("resize", k, !0), document.addEventListener("pointerdown", _, !0), document.addEventListener("keydown", m, !0)));
    }
    function D() {
      e !== null && n && (g() && S() || (n = !1, e.style.display = "none", e.setAttribute("aria-hidden", "true"), e.setAttribute("data-open", "false"), window.removeEventListener("scroll", w, !0), window.removeEventListener("resize", k, !0), document.removeEventListener("pointerdown", _, !0), document.removeEventListener("keydown", m, !0)));
    }
    function _(u) {
      i.contains(u.target) || D();
    }
    function w() {
      n && v();
    }
    function k() {
      n && v();
    }
    function c() {
      a !== null && window.clearTimeout(a), a = window.setTimeout(() => {
        o || D();
      }, 60);
    }
    function s(u) {
      p = u.pointerType === "touch", !p && (o = !0, a !== null && (window.clearTimeout(a), a = null), E());
    }
    function d() {
      p || (o = !1, c());
    }
    i.addEventListener("pointerenter", s), i.addEventListener("pointerleave", d), e.addEventListener("pointerenter", s), e.addEventListener("pointerleave", d), i.addEventListener("focusin", () => E()), i.addEventListener("focusout", () => {
      setTimeout(() => {
        const u = document.activeElement;
        u && i.contains(u) || D();
      }, 0);
    }), i.addEventListener("pointerup", (u) => {
      (u.pointerType === "touch" || u.pointerType === "pen") && (p = !0, E());
    }), i.addEventListener("click", (u) => {
      p && E();
    }), i.hasAttribute("data-hui-tooltip-open") && E();
    try {
      new MutationObserver((N) => {
        for (const A of N)
          A.type === "attributes" && (A.attributeName === "data-hui-tooltip-disabled" && (g() ? S() ? E() : D() : S() && E()), A.attributeName === "data-hui-tooltip-open" && (S() ? E() : D()));
      }).observe(i, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ot()) : ot());
function vt(...t) {
  return t.filter(Boolean).join(" ");
}
export {
  vt as cn
};
