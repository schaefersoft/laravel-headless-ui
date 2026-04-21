function V(o = document) {
  Array.from(o.querySelectorAll("[data-ui-avatar]")).forEach((r) => {
    const t = r.querySelector("img"), e = r.querySelector("[data-ui-avatar-fallback]");
    function i() {
      t && (t.style.display = "none"), e && (e.style.display = "flex", e.setAttribute("aria-hidden", "false"));
    }
    if (t) {
      t.addEventListener("error", i, { once: !0 });
      const a = t;
      typeof a.naturalWidth == "number" && a.naturalWidth === 0 && a.complete === !0 && i();
    } else
      e && (e.style.display = "flex", e.setAttribute("aria-hidden", "false"));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => V()) : V());
const at = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function it(o) {
  return Array.from(o.querySelectorAll(at));
}
function st(o, b) {
  if (b.key !== "Tab") return;
  const r = it(o);
  if (r.length === 0) {
    b.preventDefault();
    return;
  }
  const t = r[0], e = r[r.length - 1];
  b.shiftKey ? document.activeElement === t && (b.preventDefault(), e.focus()) : document.activeElement === e && (b.preventDefault(), t.focus());
}
function ut(o) {
  if (o.hasAttribute("data-hui-dialog-initialized")) return;
  o.setAttribute("data-hui-dialog-initialized", "");
  let b = null;
  const r = o.hasAttribute("data-hui-dialog-no-escape"), t = o.hasAttribute("data-hui-dialog-no-backdrop-close"), e = o.hasAttribute("data-hui-dialog-scroll-lock");
  function i() {
    if (o.open) return;
    b = document.activeElement, o.showModal(), o.setAttribute("data-hui-dialog-open", ""), e && (document.body.style.overflow = "hidden");
    const E = it(o);
    E.length > 0 && E[0].focus(), o.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
  }
  function a() {
    o.open && (o.close(), o.removeAttribute("data-hui-dialog-open"), e && (document.querySelector(
      "dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]"
    ) || (document.body.style.overflow = "")), b && b.focus && b.focus(), b = null, o.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 })));
  }
  o.addEventListener("keydown", (E) => {
    st(o, E);
  }), o.addEventListener("cancel", (E) => {
    E.preventDefault(), r || a();
  }), o.addEventListener("click", (E) => {
    E.target === o && !t && a();
  }), o.addEventListener("click", (E) => {
    E.target.closest("[data-hui-dialog-close]") && a();
  });
  const h = o.querySelector("[data-hui-dialog-title]"), m = o.querySelector("[data-hui-dialog-description]");
  h && (h.id || (h.id = `hui-dialog-title-${G()}`), o.setAttribute("aria-labelledby", h.id)), m && (m.id || (m.id = `hui-dialog-desc-${G()}`), o.setAttribute("aria-describedby", m.id)), o._hui = { open: i, close: a }, o.hasAttribute("data-hui-dialog-open") && (o.removeAttribute("data-hui-dialog-open"), i());
}
let lt = 0;
function G() {
  return `hui-${++lt}-${Date.now()}`;
}
function dt(o) {
  Array.from(o.querySelectorAll("[data-hui-dialog-trigger]")).forEach((r) => {
    r.hasAttribute("data-hui-dialog-trigger-bound") || (r.setAttribute("data-hui-dialog-trigger-bound", ""), r.addEventListener("click", () => {
      const t = r.getAttribute("data-hui-dialog-trigger");
      if (!t) return;
      const e = document.getElementById(t);
      !e || !e._hui || e._hui.open();
    }));
  });
}
function J(o = document) {
  Array.from(o.querySelectorAll("[data-hui-dialog]")).forEach(ut), dt(o);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => J()) : J());
function Q(o = document) {
  const b = Array.from(
    o.querySelectorAll("[data-hui-disclosure]")
  ), r = (e, i) => {
    const a = e.hasAttribute("open");
    if (i === "close" || i === void 0 && a) {
      e.removeAttribute("open"), e.removeAttribute("data-opened");
      return;
    }
    (i === "open" || i === void 0 && !a) && (e.setAttribute("open", ""), e.setAttribute("data-opened", String(Date.now())));
  }, t = (e, i, a) => {
    if (!Number.isFinite(i) || i <= 0) return;
    const m = Array.from(
      e.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((f) => f.hasAttribute("open")).sort((f, w) => {
      const x = Number(f.getAttribute("data-opened") ?? "0"), I = Number(w.getAttribute("data-opened") ?? "0");
      return x - I;
    });
    let A = m.length - i;
    if (!(A <= 0)) {
      for (const f of m) {
        if (A <= 0) break;
        a && f === a || (r(f, "close"), A--);
      }
      A > 0 && a && a.hasAttribute("open") && r(a, "close");
    }
  };
  b.forEach((e) => {
    const i = e.querySelector(
      "[data-hui-disclosure-summary]"
    );
    i && i.addEventListener("click", (a) => {
      var E;
      if (a.preventDefault(), e.hasAttribute("data-disabled")) return;
      const h = (E = e.parentElement) != null && E.matches("[data-hui-disclosure-container]") ? e.parentElement : null, m = !e.hasAttribute("open");
      if (r(e), h && m) {
        const A = h.getAttribute("data-max-count"), f = A ? parseInt(A, 10) : NaN;
        t(h, f, e);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Q()) : Q());
function U(o, b, r) {
  return Math.min(Math.max(o, b), r);
}
function j(o, b, r) {
  return r === b ? 0 : (o - b) / (r - b) * 100;
}
function Z(o = document) {
  Array.from(o.querySelectorAll("[data-hui-range-slider]")).forEach((r) => {
    const t = r.querySelector("[data-hui-range-slider-track]") || r, e = r.querySelector("[data-hui-range-slider-track-value]"), i = r.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), a = r.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), h = !!a, m = [i, a].filter(Boolean), E = Array.from(r.querySelectorAll('[data-hui-range-slider-value="min"]')), A = Array.from(r.querySelectorAll('[data-hui-range-slider-value="max"]')), f = E.filter((c) => c instanceof HTMLInputElement), w = A.filter((c) => c instanceof HTMLInputElement), x = E.filter((c) => !(c instanceof HTMLInputElement)), I = A.filter((c) => !(c instanceof HTMLInputElement));
    if (!i && !a) return;
    const _ = () => {
      const c = i || a, n = Number(c.min || "0"), v = Number(c.max || "100"), p = Number(c.step || "1");
      return { min: n, max: v, step: p };
    }, { min: y, max: k, step: d } = _();
    function s() {
      const c = m.some((n) => !n.disabled);
      r.setAttribute("aria-disabled", c ? "false" : "true");
    }
    function l(c = "init") {
      let n = Number((i == null ? void 0 : i.value) ?? y), v = h ? Number(a.value) : k;
      if (n = U(n, y, k), v = U(v, y, k), h && (c === "min" && n > v && (n = v), c === "max" && v < n && (v = n)), i && Number(i.value) !== n && (i.value = String(n)), h && Number(a.value) !== v && (a.value = String(v)), f.forEach((p) => {
        Number(p.value) !== n && (p.value = String(n));
      }), w.forEach((p) => {
        h && Number(p.value) !== v && (p.value = String(v));
      }), x.forEach((p) => {
        p.textContent !== String(n) && (p.textContent = String(n));
      }), I.forEach((p) => {
        const L = String(v);
        p.textContent !== L && (p.textContent = L);
      }), e)
        if (h) {
          const p = j(n, y, k), L = j(v, y, k);
          e.style.left = `${p}%`, e.style.width = `${Math.max(0, L - p)}%`;
        } else {
          const p = j(n, y, k);
          e.style.left = `${p}%`, e.style.width = `${Math.max(0, 100 - p)}%`;
        }
    }
    i && (i.addEventListener("input", () => l("min")), i.addEventListener("change", () => l("min"))), a && (a.addEventListener("input", () => l("max")), a.addEventListener("change", () => l("max")));
    const u = (c) => {
      const n = d || 1;
      return Math.round((c - y) / n) * n + y;
    };
    if (f.length && i) {
      const c = () => {
        const n = Number(f[f.length - 1].value);
        if (Number.isNaN(n)) return;
        const v = u(n), p = h ? Number(a.value) : k, L = U(v, y, p);
        String(L) !== i.value ? (i.value = String(L), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("min");
      };
      f.forEach((n) => {
        n.addEventListener("input", c), n.addEventListener("change", c);
      });
    }
    if (w.length && a) {
      const c = () => {
        const n = Number(w[w.length - 1].value);
        if (Number.isNaN(n)) return;
        const v = u(n), p = i ? Number(i.value) : y, L = U(v, p, k);
        String(L) !== a.value ? (a.value = String(L), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("max");
      };
      w.forEach((n) => {
        n.addEventListener("input", c), n.addEventListener("change", c);
      });
    }
    function N(c) {
      if ((!i || i.disabled) && (!a || a.disabled)) return;
      const n = t.getBoundingClientRect(), v = U((c - n.left) / n.width, 0, 1), p = y + v * (k - y), L = Math.round((p - y) / (d || 1)) * (d || 1) + y, B = Number((i == null ? void 0 : i.value) ?? y), O = h ? Number(a.value) : k, X = Math.abs(L - B), R = h ? Math.abs(L - O) : 1 / 0;
      let F = "min";
      if (h && !a.disabled)
        if (i && !i.disabled)
          if (R === X) {
            const T = (B + O) / 2;
            F = L > T ? "max" : "min";
          } else
            F = R < X ? "max" : "min";
        else
          F = "max";
      if (F === "min" && i) {
        const T = U(L, y, h ? Number(a.value) : k);
        String(T) !== i.value ? (i.value = String(T), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("min");
      } else if (F === "max" && a) {
        const T = U(L, i ? Number(i.value) : y, k);
        String(T) !== a.value ? (a.value = String(T), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("max");
      }
    }
    function g(c) {
      let n = 0, v = !1, p = null;
      const L = 4, B = (S) => {
        p !== null && S.pointerId !== p || Math.abs(S.clientX - n) > L && (v = !0);
      }, O = (S) => {
        p !== null && S.pointerId !== p || (window.removeEventListener("pointermove", B, !0), window.removeEventListener("pointerup", O, !0), window.removeEventListener("pointercancel", O, !0), v || (N(S.clientX), S.preventDefault(), S.stopPropagation()), v = !1, p = null);
      };
      c.addEventListener("pointerdown", (S) => {
        n = S.clientX, v = !1, p = S.pointerId, window.addEventListener("pointermove", B, !0), window.addEventListener("pointerup", O, !0), window.addEventListener("pointercancel", O, !0);
      }, !0);
      let X = 0, R = !1;
      const F = (S) => {
        Math.abs(S.clientX - X) > L && (R = !0);
      }, T = (S) => {
        window.removeEventListener("mousemove", F, !0), window.removeEventListener("mouseup", T, !0), R || (N(S.clientX), S.preventDefault(), S.stopPropagation()), R = !1;
      };
      c.addEventListener("mousedown", (S) => {
        X = S.clientX, R = !1, window.addEventListener("mousemove", F, !0), window.addEventListener("mouseup", T, !0);
      }, !0);
    }
    g(t);
    const D = new MutationObserver(() => s());
    m.forEach((c) => D.observe(c, { attributes: !0, attributeFilter: ["disabled"] })), s(), l("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Z()) : Z());
function $(o, b) {
  return o.hasAttribute(b);
}
function K(o) {
  for (let b = 0; b < o.length; b++)
    if (!$(o[b], "data-disabled")) return b;
  return 0;
}
function tt(o = document) {
  Array.from(o.querySelectorAll("[data-hui-tabs]")).forEach((r) => {
    const t = r.querySelector("[data-hui-tablist]") || r, e = Array.from(r.querySelectorAll("[data-hui-tab]")), i = Array.from(r.querySelectorAll("[data-hui-tabpanel]"));
    if (!e.length || !i.length) return;
    const a = r.getAttribute("data-hui-tabs-orientation") === "vertical" || r.hasAttribute("data-hui-tabs-vertical");
    t.setAttribute("role", "tablist"), t.setAttribute("aria-orientation", a ? "vertical" : "horizontal");
    const h = Math.random().toString(36).slice(2);
    e.forEach((d, s) => {
      d.id || (d.id = `hui-tab-${h}-${s}`);
    }), i.forEach((d, s) => {
      d.id || (d.id = `hui-tabpanel-${h}-${s}`);
    });
    const m = Math.min(e.length, i.length);
    for (let d = 0; d < m; d++) {
      const s = e[d], l = i[d];
      s.setAttribute("role", "tab"), l.setAttribute("role", "tabpanel"), s.setAttribute("aria-controls", l.id), l.setAttribute("aria-labelledby", s.id);
    }
    function E() {
      const d = r.getAttribute("data-hui-tabs-initial-index");
      if (d !== null) {
        const s = parseInt(d, 10);
        if (!Number.isNaN(s) && s >= 0 && s < m) return s;
      }
      for (let s = 0; s < m; s++) {
        const l = e[s], u = i[s];
        if ($(l, "data-active") || $(u, "data-active"))
          return s;
      }
      return K(e);
    }
    function A(d, s) {
      let l = d;
      for (let u = 0; u < m; u++)
        if (l = (l + s + m) % m, !$(e[l], "data-disabled")) return l;
      return d;
    }
    let f = Math.max(0, Math.min(E(), m - 1));
    $(e[f], "data-disabled") && (f = K(e));
    let w = !1;
    function x(d, s, l) {
      const u = d.hasAttribute(s);
      l && !u && d.setAttribute(s, ""), !l && u && d.removeAttribute(s);
    }
    function I(d, s, l) {
      d.getAttribute(s) !== l && d.setAttribute(s, l);
    }
    function _(d = !1) {
      w = !0;
      for (let s = 0; s < m; s++) {
        const l = s === f, u = e[s], N = i[s];
        I(u, "aria-selected", l ? "true" : "false"), u.tabIndex = l && !$(u, "data-disabled") ? 0 : -1, x(u, "data-active", l), x(N, "data-active", l), x(N, "hidden", !l);
      }
      d && e[f].focus(), w = !1;
    }
    function y(d, s = !1) {
      if (!(d < 0 || d >= m) && !$(e[d], "data-disabled")) {
        if (d === f) {
          s && e[f].focus();
          return;
        }
        f = d, _(s);
      }
    }
    e.forEach((d, s) => {
      d.addEventListener("click", (l) => {
        if ($(d, "data-disabled")) {
          l.preventDefault();
          return;
        }
        y(s, !0);
      });
    });
    const k = (d) => {
      const s = d.key;
      let l = !1;
      a ? (s === "ArrowUp" && (y(A(f, -1), !0), l = !0), s === "ArrowDown" && (y(A(f, 1), !0), l = !0)) : (s === "ArrowLeft" && (y(A(f, -1), !0), l = !0), s === "ArrowRight" && (y(A(f, 1), !0), l = !0)), s === "Home" && (y(K(e), !0), l = !0), s === "End" && (y((() => {
        for (let u = m - 1; u >= 0; u--)
          if (!$(e[u], "data-disabled")) return u;
        return f;
      })(), !0), l = !0), (s === "Enter" || s === " ") && (y(f, !0), l = !0), l && (d.preventDefault(), d.stopPropagation());
    };
    t.addEventListener("keydown", k);
    try {
      const d = new MutationObserver((s) => {
        if (w) return;
        let l = !1;
        for (const u of s)
          u.type === "attributes" && (u.attributeName === "data-disabled" || u.attributeName === "data-active") && (l = !0);
        if (l) {
          if ($(e[f], "data-disabled"))
            f = K(e);
          else
            for (let u = 0; u < m; u++)
              if (u !== f && $(e[u], "data-active")) {
                f = u;
                break;
              }
          _(!1);
        }
      });
      e.forEach((s) => d.observe(s, { attributes: !0, attributeFilter: ["data-disabled", "data-active"] }));
    } catch {
    }
    _(!1);
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => tt()) : tt());
function et(o = document) {
  Array.from(o.querySelectorAll("[data-hui-toggle]")).forEach((r) => {
    const t = r.querySelector(".hui-toggle-input") || void 0, e = r.querySelector(".hui-toggle-thumb") || void 0, i = () => r.getAttribute("aria-disabled") === "true", a = (w) => {
      const x = w ? "true" : "false";
      r.setAttribute("aria-checked", x), e && e.setAttribute("aria-checked", x);
    }, h = () => r.getAttribute("aria-checked") === "true", m = t ? !!t.checked : h();
    a(m), e && e.setAttribute("aria-disabled", i() ? "true" : "false");
    function E(w) {
      t && t.checked !== w && (t.checked = w, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function A(w) {
      a(w), E(w);
    }
    function f() {
      i() || A(!h());
    }
    r.addEventListener("click", (w) => {
      i() || f();
    }), r.addEventListener("keydown", (w) => {
      if (i()) return;
      w.key === "Spacebar" && (w.preventDefault(), f());
    }), t && (t.addEventListener("change", () => A(!!t.checked)), new MutationObserver(() => {
      r.setAttribute("aria-disabled", t.disabled ? "true" : "false"), e && e.setAttribute("aria-disabled", t.disabled ? "true" : "false"), A(!!t.checked);
    }).observe(t, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => et()) : et());
function P(o, b, r) {
  return Math.min(Math.max(o, b), r);
}
function nt(o = document) {
  Array.from(o.querySelectorAll("[data-hui-tooltip]")).forEach((r) => {
    let t = r.querySelector("[data-hui-tooltip-content]");
    if (!t || t === null) return;
    t = t, t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "-10000px";
    let e = !1, i = !1, a = null, h = !1;
    function m() {
      return r.hasAttribute("data-hui-tooltip-disabled");
    }
    function E() {
      return r.hasAttribute("data-hui-tooltip-open");
    }
    function A(u) {
      (u.key === "Escape" || u.key === "Esc") && I();
    }
    function f() {
      if (t === null) return { w: 0, h: 0 };
      const u = t.style.display, N = t.style.visibility;
      t.style.visibility = "hidden", t.style.display = "block";
      const g = t.getBoundingClientRect(), D = g.width, c = g.height;
      return t.style.display = u || "", t.style.visibility = N || "", { w: D, h: c };
    }
    function w() {
      if (t === null) return;
      const { innerWidth: u, innerHeight: N } = window, g = r.getBoundingClientRect(), { w: D, h: c } = f(), n = 8, v = t.getAttribute("data-hui-tooltip-position") || "top", p = v === "bottom" || v === "left" || v === "right" ? v : "top", L = g.top, B = N - g.bottom, O = g.left, X = u - g.right, R = L >= c + n, F = B >= c + n, T = O >= D + n, S = X >= D + n, rt = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let W;
      p === "top" || p === "bottom" ? W = O >= X ? ["left", "right"] : ["right", "left"] : W = L >= B ? ["top", "bottom"] : ["bottom", "top"];
      const ot = [p, rt[p], ...W];
      let H = null;
      for (const M of ot)
        if (M === "top" && R || M === "bottom" && F || M === "left" && T || M === "right" && S) {
          H = M;
          break;
        }
      if (H === null) {
        const M = {
          top: L,
          bottom: B,
          left: O,
          right: X
        };
        H = ["top", "bottom", "left", "right"].reduce((z, Y) => M[Y] > M[z] ? Y : z, "top");
      }
      let C, q;
      if (H === "top" ? (q = g.top - c - n, C = g.left + g.width / 2 - D / 2, q = P(q, n, Math.max(n, N - n - c)), C = P(C, n, Math.max(n, u - n - D))) : H === "bottom" ? (q = g.bottom + n, C = g.left + g.width / 2 - D / 2, q = P(q, n, Math.max(n, N - n - c)), C = P(C, n, Math.max(n, u - n - D))) : H === "left" ? (C = g.left - D - n, q = g.top + g.height / 2 - c / 2, C = P(C, n, Math.max(n, u - n - D)), q = P(q, n, Math.max(n, N - n - c))) : (C = g.right + n, q = g.top + g.height / 2 - c / 2, C = P(C, n, Math.max(n, u - n - D)), q = P(q, n, Math.max(n, N - n - c))), t.style.left = `${Math.round(C)}px`, t.style.top = `${Math.round(q)}px`, t.setAttribute("data-placement", H), H === "top" || H === "bottom") {
        const M = g.left + g.width / 2, z = P(M - C, 6, Math.max(6, D - 6));
        t.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(z)}px`), t.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const M = g.top + g.height / 2, z = P(M - q, 6, Math.max(6, c - 6));
        t.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(z)}px`), t.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const M = getComputedStyle(t).backgroundColor;
        !M || M === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(M) ? t.style.removeProperty("--hui-tooltip-bg") : t.style.setProperty("--hui-tooltip-bg", M);
      } catch {
      }
    }
    function x() {
      t !== null && (m() && !E() || e || (e = !0, t.style.display = "block", t.setAttribute("aria-hidden", "false"), t.setAttribute("data-open", "true"), w(), window.addEventListener("scroll", y, !0), window.addEventListener("resize", k, !0), document.addEventListener("pointerdown", _, !0), document.addEventListener("keydown", A, !0)));
    }
    function I() {
      t !== null && e && (m() && E() || (e = !1, t.style.display = "none", t.setAttribute("aria-hidden", "true"), t.setAttribute("data-open", "false"), window.removeEventListener("scroll", y, !0), window.removeEventListener("resize", k, !0), document.removeEventListener("pointerdown", _, !0), document.removeEventListener("keydown", A, !0)));
    }
    function _(u) {
      r.contains(u.target) || I();
    }
    function y() {
      e && w();
    }
    function k() {
      e && w();
    }
    function d() {
      a !== null && window.clearTimeout(a), a = window.setTimeout(() => {
        i || I();
      }, 60);
    }
    function s(u) {
      h = u.pointerType === "touch", !h && (i = !0, a !== null && (window.clearTimeout(a), a = null), x());
    }
    function l() {
      h || (i = !1, d());
    }
    r.addEventListener("pointerenter", s), r.addEventListener("pointerleave", l), t.addEventListener("pointerenter", s), t.addEventListener("pointerleave", l), r.addEventListener("focusin", () => x()), r.addEventListener("focusout", () => {
      setTimeout(() => {
        const u = document.activeElement;
        u && r.contains(u) || I();
      }, 0);
    }), r.addEventListener("pointerup", (u) => {
      (u.pointerType === "touch" || u.pointerType === "pen") && (h = !0, x());
    }), r.addEventListener("click", (u) => {
      h && x();
    }), r.hasAttribute("data-hui-tooltip-open") && x();
    try {
      new MutationObserver((N) => {
        for (const g of N)
          g.type === "attributes" && (g.attributeName === "data-hui-tooltip-disabled" && (m() ? E() ? x() : I() : E() && x()), g.attributeName === "data-hui-tooltip-open" && (E() ? x() : I()));
      }).observe(r, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => nt()) : nt());
function ct(...o) {
  return o.filter(Boolean).join(" ");
}
export {
  ct as cn
};
