function V(a = document) {
  Array.from(a.querySelectorAll("[data-ui-avatar]")).forEach((r) => {
    const t = r.querySelector("img"), e = r.querySelector("[data-ui-avatar-fallback]");
    function i() {
      t && (t.style.display = "none"), e && (e.style.display = "flex", e.setAttribute("aria-hidden", "false"));
    }
    if (t) {
      t.addEventListener("error", i, { once: !0 });
      const o = t;
      typeof o.naturalWidth == "number" && o.naturalWidth === 0 && o.complete === !0 && i();
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
function it(a) {
  return Array.from(a.querySelectorAll(at));
}
function st(a, b) {
  if (b.key !== "Tab") return;
  const r = it(a);
  if (r.length === 0) {
    b.preventDefault();
    return;
  }
  const t = r[0], e = r[r.length - 1];
  b.shiftKey ? document.activeElement === t && (b.preventDefault(), e.focus()) : document.activeElement === e && (b.preventDefault(), t.focus());
}
function ut(a) {
  if (a.hasAttribute("data-hui-dialog-initialized")) return;
  a.setAttribute("data-hui-dialog-initialized", "");
  let b = null;
  function r() {
    if (a.open) return;
    b = document.activeElement, a.showModal(), a.setAttribute("data-hui-dialog-open", "");
    const o = it(a);
    o.length > 0 && o[0].focus(), a.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
  }
  function t() {
    a.open && (a.close(), a.removeAttribute("data-hui-dialog-open"), b && b.focus && b.focus(), b = null, a.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 })));
  }
  a.addEventListener("keydown", (o) => {
    st(a, o);
  }), a.addEventListener("cancel", (o) => {
    o.preventDefault(), t();
  }), a.addEventListener("click", (o) => {
    o.target === a && t();
  }), a.addEventListener("click", (o) => {
    o.target.closest("[data-hui-dialog-close]") && t();
  });
  const e = a.querySelector("[data-hui-dialog-title]"), i = a.querySelector("[data-hui-dialog-description]");
  e && (e.id || (e.id = `hui-dialog-title-${G()}`), a.setAttribute("aria-labelledby", e.id)), i && (i.id || (i.id = `hui-dialog-desc-${G()}`), a.setAttribute("aria-describedby", i.id)), a._hui = { open: r, close: t }, a.hasAttribute("data-hui-dialog-open") && (a.removeAttribute("data-hui-dialog-open"), r());
}
let lt = 0;
function G() {
  return `hui-${++lt}-${Date.now()}`;
}
function dt(a) {
  Array.from(a.querySelectorAll("[data-hui-dialog-trigger]")).forEach((r) => {
    r.hasAttribute("data-hui-dialog-trigger-bound") || (r.setAttribute("data-hui-dialog-trigger-bound", ""), r.addEventListener("click", () => {
      const t = r.getAttribute("data-hui-dialog-trigger");
      if (!t) return;
      const e = document.getElementById(t);
      !e || !e._hui || e._hui.open();
    }));
  });
}
function J(a = document) {
  Array.from(a.querySelectorAll("[data-hui-dialog]")).forEach(ut), dt(a);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => J()) : J());
function Q(a = document) {
  const b = Array.from(
    a.querySelectorAll("[data-hui-disclosure]")
  ), r = (e, i) => {
    const o = e.hasAttribute("open");
    if (i === "close" || i === void 0 && o) {
      e.removeAttribute("open"), e.removeAttribute("data-opened");
      return;
    }
    (i === "open" || i === void 0 && !o) && (e.setAttribute("open", ""), e.setAttribute("data-opened", String(Date.now())));
  }, t = (e, i, o) => {
    if (!Number.isFinite(i) || i <= 0) return;
    const E = Array.from(
      e.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((f) => f.hasAttribute("open")).sort((f, g) => {
      const L = Number(f.getAttribute("data-opened") ?? "0"), I = Number(g.getAttribute("data-opened") ?? "0");
      return L - I;
    });
    let A = E.length - i;
    if (!(A <= 0)) {
      for (const f of E) {
        if (A <= 0) break;
        o && f === o || (r(f, "close"), A--);
      }
      A > 0 && o && o.hasAttribute("open") && r(o, "close");
    }
  };
  b.forEach((e) => {
    const i = e.querySelector(
      "[data-hui-disclosure-summary]"
    );
    i && i.addEventListener("click", (o) => {
      var k;
      if (o.preventDefault(), e.hasAttribute("data-disabled")) return;
      const m = (k = e.parentElement) != null && k.matches("[data-hui-disclosure-container]") ? e.parentElement : null, E = !e.hasAttribute("open");
      if (r(e), m && E) {
        const A = m.getAttribute("data-max-count"), f = A ? parseInt(A, 10) : NaN;
        t(m, f, e);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Q()) : Q());
function U(a, b, r) {
  return Math.min(Math.max(a, b), r);
}
function j(a, b, r) {
  return r === b ? 0 : (a - b) / (r - b) * 100;
}
function Z(a = document) {
  Array.from(a.querySelectorAll("[data-hui-range-slider]")).forEach((r) => {
    const t = r.querySelector("[data-hui-range-slider-track]") || r, e = r.querySelector("[data-hui-range-slider-track-value]"), i = r.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), o = r.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), m = !!o, E = [i, o].filter(Boolean), k = Array.from(r.querySelectorAll('[data-hui-range-slider-value="min"]')), A = Array.from(r.querySelectorAll('[data-hui-range-slider-value="max"]')), f = k.filter((c) => c instanceof HTMLInputElement), g = A.filter((c) => c instanceof HTMLInputElement), L = k.filter((c) => !(c instanceof HTMLInputElement)), I = A.filter((c) => !(c instanceof HTMLInputElement));
    if (!i && !o) return;
    const _ = () => {
      const c = i || o, n = Number(c.min || "0"), h = Number(c.max || "100"), p = Number(c.step || "1");
      return { min: n, max: h, step: p };
    }, { min: v, max: S, step: d } = _();
    function s() {
      const c = E.some((n) => !n.disabled);
      r.setAttribute("aria-disabled", c ? "false" : "true");
    }
    function l(c = "init") {
      let n = Number((i == null ? void 0 : i.value) ?? v), h = m ? Number(o.value) : S;
      if (n = U(n, v, S), h = U(h, v, S), m && (c === "min" && n > h && (n = h), c === "max" && h < n && (h = n)), i && Number(i.value) !== n && (i.value = String(n)), m && Number(o.value) !== h && (o.value = String(h)), f.forEach((p) => {
        Number(p.value) !== n && (p.value = String(n));
      }), g.forEach((p) => {
        m && Number(p.value) !== h && (p.value = String(h));
      }), L.forEach((p) => {
        p.textContent !== String(n) && (p.textContent = String(n));
      }), I.forEach((p) => {
        const w = String(h);
        p.textContent !== w && (p.textContent = w);
      }), e)
        if (m) {
          const p = j(n, v, S), w = j(h, v, S);
          e.style.left = `${p}%`, e.style.width = `${Math.max(0, w - p)}%`;
        } else {
          const p = j(n, v, S);
          e.style.left = `${p}%`, e.style.width = `${Math.max(0, 100 - p)}%`;
        }
    }
    i && (i.addEventListener("input", () => l("min")), i.addEventListener("change", () => l("min"))), o && (o.addEventListener("input", () => l("max")), o.addEventListener("change", () => l("max")));
    const u = (c) => {
      const n = d || 1;
      return Math.round((c - v) / n) * n + v;
    };
    if (f.length && i) {
      const c = () => {
        const n = Number(f[f.length - 1].value);
        if (Number.isNaN(n)) return;
        const h = u(n), p = m ? Number(o.value) : S, w = U(h, v, p);
        String(w) !== i.value ? (i.value = String(w), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("min");
      };
      f.forEach((n) => {
        n.addEventListener("input", c), n.addEventListener("change", c);
      });
    }
    if (g.length && o) {
      const c = () => {
        const n = Number(g[g.length - 1].value);
        if (Number.isNaN(n)) return;
        const h = u(n), p = i ? Number(i.value) : v, w = U(h, p, S);
        String(w) !== o.value ? (o.value = String(w), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("max");
      };
      g.forEach((n) => {
        n.addEventListener("input", c), n.addEventListener("change", c);
      });
    }
    function N(c) {
      if ((!i || i.disabled) && (!o || o.disabled)) return;
      const n = t.getBoundingClientRect(), h = U((c - n.left) / n.width, 0, 1), p = v + h * (S - v), w = Math.round((p - v) / (d || 1)) * (d || 1) + v, B = Number((i == null ? void 0 : i.value) ?? v), O = m ? Number(o.value) : S, X = Math.abs(w - B), R = m ? Math.abs(w - O) : 1 / 0;
      let F = "min";
      if (m && !o.disabled)
        if (i && !i.disabled)
          if (R === X) {
            const T = (B + O) / 2;
            F = w > T ? "max" : "min";
          } else
            F = R < X ? "max" : "min";
        else
          F = "max";
      if (F === "min" && i) {
        const T = U(w, v, m ? Number(o.value) : S);
        String(T) !== i.value ? (i.value = String(T), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("min");
      } else if (F === "max" && o) {
        const T = U(w, i ? Number(i.value) : v, S);
        String(T) !== o.value ? (o.value = String(T), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 }))) : l("max");
      }
    }
    function y(c) {
      let n = 0, h = !1, p = null;
      const w = 4, B = (x) => {
        p !== null && x.pointerId !== p || Math.abs(x.clientX - n) > w && (h = !0);
      }, O = (x) => {
        p !== null && x.pointerId !== p || (window.removeEventListener("pointermove", B, !0), window.removeEventListener("pointerup", O, !0), window.removeEventListener("pointercancel", O, !0), h || (N(x.clientX), x.preventDefault(), x.stopPropagation()), h = !1, p = null);
      };
      c.addEventListener("pointerdown", (x) => {
        n = x.clientX, h = !1, p = x.pointerId, window.addEventListener("pointermove", B, !0), window.addEventListener("pointerup", O, !0), window.addEventListener("pointercancel", O, !0);
      }, !0);
      let X = 0, R = !1;
      const F = (x) => {
        Math.abs(x.clientX - X) > w && (R = !0);
      }, T = (x) => {
        window.removeEventListener("mousemove", F, !0), window.removeEventListener("mouseup", T, !0), R || (N(x.clientX), x.preventDefault(), x.stopPropagation()), R = !1;
      };
      c.addEventListener("mousedown", (x) => {
        X = x.clientX, R = !1, window.addEventListener("mousemove", F, !0), window.addEventListener("mouseup", T, !0);
      }, !0);
    }
    y(t);
    const D = new MutationObserver(() => s());
    E.forEach((c) => D.observe(c, { attributes: !0, attributeFilter: ["disabled"] })), s(), l("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Z()) : Z());
function $(a, b) {
  return a.hasAttribute(b);
}
function K(a) {
  for (let b = 0; b < a.length; b++)
    if (!$(a[b], "data-disabled")) return b;
  return 0;
}
function tt(a = document) {
  Array.from(a.querySelectorAll("[data-hui-tabs]")).forEach((r) => {
    const t = r.querySelector("[data-hui-tablist]") || r, e = Array.from(r.querySelectorAll("[data-hui-tab]")), i = Array.from(r.querySelectorAll("[data-hui-tabpanel]"));
    if (!e.length || !i.length) return;
    const o = r.getAttribute("data-hui-tabs-orientation") === "vertical" || r.hasAttribute("data-hui-tabs-vertical");
    t.setAttribute("role", "tablist"), t.setAttribute("aria-orientation", o ? "vertical" : "horizontal");
    const m = Math.random().toString(36).slice(2);
    e.forEach((d, s) => {
      d.id || (d.id = `hui-tab-${m}-${s}`);
    }), i.forEach((d, s) => {
      d.id || (d.id = `hui-tabpanel-${m}-${s}`);
    });
    const E = Math.min(e.length, i.length);
    for (let d = 0; d < E; d++) {
      const s = e[d], l = i[d];
      s.setAttribute("role", "tab"), l.setAttribute("role", "tabpanel"), s.setAttribute("aria-controls", l.id), l.setAttribute("aria-labelledby", s.id);
    }
    function k() {
      const d = r.getAttribute("data-hui-tabs-initial-index");
      if (d !== null) {
        const s = parseInt(d, 10);
        if (!Number.isNaN(s) && s >= 0 && s < E) return s;
      }
      for (let s = 0; s < E; s++) {
        const l = e[s], u = i[s];
        if ($(l, "data-active") || $(u, "data-active"))
          return s;
      }
      return K(e);
    }
    function A(d, s) {
      let l = d;
      for (let u = 0; u < E; u++)
        if (l = (l + s + E) % E, !$(e[l], "data-disabled")) return l;
      return d;
    }
    let f = Math.max(0, Math.min(k(), E - 1));
    $(e[f], "data-disabled") && (f = K(e));
    let g = !1;
    function L(d, s, l) {
      const u = d.hasAttribute(s);
      l && !u && d.setAttribute(s, ""), !l && u && d.removeAttribute(s);
    }
    function I(d, s, l) {
      d.getAttribute(s) !== l && d.setAttribute(s, l);
    }
    function _(d = !1) {
      g = !0;
      for (let s = 0; s < E; s++) {
        const l = s === f, u = e[s], N = i[s];
        I(u, "aria-selected", l ? "true" : "false"), u.tabIndex = l && !$(u, "data-disabled") ? 0 : -1, L(u, "data-active", l), L(N, "data-active", l), L(N, "hidden", !l);
      }
      d && e[f].focus(), g = !1;
    }
    function v(d, s = !1) {
      if (!(d < 0 || d >= E) && !$(e[d], "data-disabled")) {
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
        v(s, !0);
      });
    });
    const S = (d) => {
      const s = d.key;
      let l = !1;
      o ? (s === "ArrowUp" && (v(A(f, -1), !0), l = !0), s === "ArrowDown" && (v(A(f, 1), !0), l = !0)) : (s === "ArrowLeft" && (v(A(f, -1), !0), l = !0), s === "ArrowRight" && (v(A(f, 1), !0), l = !0)), s === "Home" && (v(K(e), !0), l = !0), s === "End" && (v((() => {
        for (let u = E - 1; u >= 0; u--)
          if (!$(e[u], "data-disabled")) return u;
        return f;
      })(), !0), l = !0), (s === "Enter" || s === " ") && (v(f, !0), l = !0), l && (d.preventDefault(), d.stopPropagation());
    };
    t.addEventListener("keydown", S);
    try {
      const d = new MutationObserver((s) => {
        if (g) return;
        let l = !1;
        for (const u of s)
          u.type === "attributes" && (u.attributeName === "data-disabled" || u.attributeName === "data-active") && (l = !0);
        if (l) {
          if ($(e[f], "data-disabled"))
            f = K(e);
          else
            for (let u = 0; u < E; u++)
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
function et(a = document) {
  Array.from(a.querySelectorAll("[data-hui-toggle]")).forEach((r) => {
    const t = r.querySelector(".hui-toggle-input") || void 0, e = r.querySelector(".hui-toggle-thumb") || void 0, i = () => r.getAttribute("aria-disabled") === "true", o = (g) => {
      const L = g ? "true" : "false";
      r.setAttribute("aria-checked", L), e && e.setAttribute("aria-checked", L);
    }, m = () => r.getAttribute("aria-checked") === "true", E = t ? !!t.checked : m();
    o(E), e && e.setAttribute("aria-disabled", i() ? "true" : "false");
    function k(g) {
      t && t.checked !== g && (t.checked = g, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function A(g) {
      o(g), k(g);
    }
    function f() {
      i() || A(!m());
    }
    r.addEventListener("click", (g) => {
      i() || f();
    }), r.addEventListener("keydown", (g) => {
      if (i()) return;
      g.key === "Spacebar" && (g.preventDefault(), f());
    }), t && (t.addEventListener("change", () => A(!!t.checked)), new MutationObserver(() => {
      r.setAttribute("aria-disabled", t.disabled ? "true" : "false"), e && e.setAttribute("aria-disabled", t.disabled ? "true" : "false"), A(!!t.checked);
    }).observe(t, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => et()) : et());
function P(a, b, r) {
  return Math.min(Math.max(a, b), r);
}
function nt(a = document) {
  Array.from(a.querySelectorAll("[data-hui-tooltip]")).forEach((r) => {
    let t = r.querySelector("[data-hui-tooltip-content]");
    if (!t || t === null) return;
    t = t, t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "-10000px";
    let e = !1, i = !1, o = null, m = !1;
    function E() {
      return r.hasAttribute("data-hui-tooltip-disabled");
    }
    function k() {
      return r.hasAttribute("data-hui-tooltip-open");
    }
    function A(u) {
      (u.key === "Escape" || u.key === "Esc") && I();
    }
    function f() {
      if (t === null) return { w: 0, h: 0 };
      const u = t.style.display, N = t.style.visibility;
      t.style.visibility = "hidden", t.style.display = "block";
      const y = t.getBoundingClientRect(), D = y.width, c = y.height;
      return t.style.display = u || "", t.style.visibility = N || "", { w: D, h: c };
    }
    function g() {
      if (t === null) return;
      const { innerWidth: u, innerHeight: N } = window, y = r.getBoundingClientRect(), { w: D, h: c } = f(), n = 8, h = t.getAttribute("data-hui-tooltip-position") || "top", p = h === "bottom" || h === "left" || h === "right" ? h : "top", w = y.top, B = N - y.bottom, O = y.left, X = u - y.right, R = w >= c + n, F = B >= c + n, T = O >= D + n, x = X >= D + n, rt = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let W;
      p === "top" || p === "bottom" ? W = O >= X ? ["left", "right"] : ["right", "left"] : W = w >= B ? ["top", "bottom"] : ["bottom", "top"];
      const ot = [p, rt[p], ...W];
      let H = null;
      for (const M of ot)
        if (M === "top" && R || M === "bottom" && F || M === "left" && T || M === "right" && x) {
          H = M;
          break;
        }
      if (H === null) {
        const M = {
          top: w,
          bottom: B,
          left: O,
          right: X
        };
        H = ["top", "bottom", "left", "right"].reduce((z, Y) => M[Y] > M[z] ? Y : z, "top");
      }
      let C, q;
      if (H === "top" ? (q = y.top - c - n, C = y.left + y.width / 2 - D / 2, q = P(q, n, Math.max(n, N - n - c)), C = P(C, n, Math.max(n, u - n - D))) : H === "bottom" ? (q = y.bottom + n, C = y.left + y.width / 2 - D / 2, q = P(q, n, Math.max(n, N - n - c)), C = P(C, n, Math.max(n, u - n - D))) : H === "left" ? (C = y.left - D - n, q = y.top + y.height / 2 - c / 2, C = P(C, n, Math.max(n, u - n - D)), q = P(q, n, Math.max(n, N - n - c))) : (C = y.right + n, q = y.top + y.height / 2 - c / 2, C = P(C, n, Math.max(n, u - n - D)), q = P(q, n, Math.max(n, N - n - c))), t.style.left = `${Math.round(C)}px`, t.style.top = `${Math.round(q)}px`, t.setAttribute("data-placement", H), H === "top" || H === "bottom") {
        const M = y.left + y.width / 2, z = P(M - C, 6, Math.max(6, D - 6));
        t.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(z)}px`), t.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const M = y.top + y.height / 2, z = P(M - q, 6, Math.max(6, c - 6));
        t.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(z)}px`), t.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const M = getComputedStyle(t).backgroundColor;
        !M || M === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(M) ? t.style.removeProperty("--hui-tooltip-bg") : t.style.setProperty("--hui-tooltip-bg", M);
      } catch {
      }
    }
    function L() {
      t !== null && (E() && !k() || e || (e = !0, t.style.display = "block", t.setAttribute("aria-hidden", "false"), t.setAttribute("data-open", "true"), g(), window.addEventListener("scroll", v, !0), window.addEventListener("resize", S, !0), document.addEventListener("pointerdown", _, !0), document.addEventListener("keydown", A, !0)));
    }
    function I() {
      t !== null && e && (E() && k() || (e = !1, t.style.display = "none", t.setAttribute("aria-hidden", "true"), t.setAttribute("data-open", "false"), window.removeEventListener("scroll", v, !0), window.removeEventListener("resize", S, !0), document.removeEventListener("pointerdown", _, !0), document.removeEventListener("keydown", A, !0)));
    }
    function _(u) {
      r.contains(u.target) || I();
    }
    function v() {
      e && g();
    }
    function S() {
      e && g();
    }
    function d() {
      o !== null && window.clearTimeout(o), o = window.setTimeout(() => {
        i || I();
      }, 60);
    }
    function s(u) {
      m = u.pointerType === "touch", !m && (i = !0, o !== null && (window.clearTimeout(o), o = null), L());
    }
    function l() {
      m || (i = !1, d());
    }
    r.addEventListener("pointerenter", s), r.addEventListener("pointerleave", l), t.addEventListener("pointerenter", s), t.addEventListener("pointerleave", l), r.addEventListener("focusin", () => L()), r.addEventListener("focusout", () => {
      setTimeout(() => {
        const u = document.activeElement;
        u && r.contains(u) || I();
      }, 0);
    }), r.addEventListener("pointerup", (u) => {
      (u.pointerType === "touch" || u.pointerType === "pen") && (m = !0, L());
    }), r.addEventListener("click", (u) => {
      m && L();
    }), r.hasAttribute("data-hui-tooltip-open") && L();
    try {
      new MutationObserver((N) => {
        for (const y of N)
          y.type === "attributes" && (y.attributeName === "data-hui-tooltip-disabled" && (E() ? k() ? L() : I() : k() && L()), y.attributeName === "data-hui-tooltip-open" && (k() ? L() : I()));
      }).observe(r, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => nt()) : nt());
function ct(...a) {
  return a.filter(Boolean).join(" ");
}
export {
  ct as cn
};
