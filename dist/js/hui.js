function V(g = document) {
  Array.from(g.querySelectorAll("[data-ui-avatar]")).forEach((o) => {
    const e = o.querySelector("img"), i = o.querySelector("[data-ui-avatar-fallback]");
    function n() {
      e && (e.style.display = "none"), i && (i.style.display = "flex", i.setAttribute("aria-hidden", "false"));
    }
    if (e) {
      e.addEventListener("error", n, { once: !0 });
      const a = e;
      typeof a.naturalWidth == "number" && a.naturalWidth === 0 && a.complete === !0 && n();
    } else
      i && (i.style.display = "flex", i.setAttribute("aria-hidden", "false"));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => V()) : V());
function G(g = document) {
  const A = Array.from(
    g.querySelectorAll("[data-hui-disclosure]")
  ), o = (i, n) => {
    const a = i.hasAttribute("open");
    if (n === "close" || n === void 0 && a) {
      i.removeAttribute("open"), i.removeAttribute("data-opened");
      return;
    }
    (n === "open" || n === void 0 && !a) && (i.setAttribute("open", ""), i.setAttribute("data-opened", String(Date.now())));
  }, e = (i, n, a) => {
    if (!Number.isFinite(n) || n <= 0) return;
    const y = Array.from(
      i.querySelectorAll(":scope > [data-hui-disclosure]")
    ).filter((c) => c.hasAttribute("open")).sort((c, v) => {
      const L = Number(c.getAttribute("data-opened") ?? "0"), I = Number(v.getAttribute("data-opened") ?? "0");
      return L - I;
    });
    let E = y.length - n;
    if (!(E <= 0)) {
      for (const c of y) {
        if (E <= 0) break;
        a && c === a || (o(c, "close"), E--);
      }
      E > 0 && a && a.hasAttribute("open") && o(a, "close");
    }
  };
  A.forEach((i) => {
    const n = i.querySelector(
      "[data-hui-disclosure-summary]"
    );
    n && n.addEventListener("click", (a) => {
      var k;
      if (a.preventDefault(), i.hasAttribute("data-disabled")) return;
      const m = (k = i.parentElement) != null && k.matches("[data-hui-disclosure-container]") ? i.parentElement : null, y = !i.hasAttribute("open");
      if (o(i), m && y) {
        const E = m.getAttribute("data-max-count"), c = E ? parseInt(E, 10) : NaN;
        e(m, c, i);
      }
    });
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => G()) : G());
function W(g, A, o) {
  return Math.min(Math.max(g, A), o);
}
function Y(g, A, o) {
  return o === A ? 0 : (g - A) / (o - A) * 100;
}
function J(g = document) {
  Array.from(g.querySelectorAll("[data-hui-range-slider]")).forEach((o) => {
    const e = o.querySelector("[data-hui-range-slider-track]") || o, i = o.querySelector("[data-hui-range-slider-track-value]"), n = o.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]'), a = o.querySelector('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]'), m = !!a, y = [n, a].filter(Boolean), k = Array.from(o.querySelectorAll('[data-hui-range-slider-value="min"]')), E = Array.from(o.querySelectorAll('[data-hui-range-slider-value="max"]')), c = k.filter((d) => d instanceof HTMLInputElement), v = E.filter((d) => d instanceof HTMLInputElement), L = k.filter((d) => !(d instanceof HTMLInputElement)), I = E.filter((d) => !(d instanceof HTMLInputElement));
    if (!n && !a) return;
    const z = () => {
      const d = n || a, t = Number(d.min || "0"), p = Number(d.max || "100"), f = Number(d.step || "1");
      return { min: t, max: p, step: f };
    }, { min: b, max: S, step: l } = z();
    function r() {
      const d = y.some((t) => !t.disabled);
      o.setAttribute("aria-disabled", d ? "false" : "true");
    }
    function u(d = "init") {
      let t = Number((n == null ? void 0 : n.value) ?? b), p = m ? Number(a.value) : S;
      if (t = W(t, b, S), p = W(p, b, S), m && (d === "min" && t > p && (t = p), d === "max" && p < t && (p = t)), n && Number(n.value) !== t && (n.value = String(t)), m && Number(a.value) !== p && (a.value = String(p)), c.forEach((f) => {
        Number(f.value) !== t && (f.value = String(t));
      }), v.forEach((f) => {
        m && Number(f.value) !== p && (f.value = String(p));
      }), L.forEach((f) => {
        f.textContent !== String(t) && (f.textContent = String(t));
      }), I.forEach((f) => {
        const w = String(p);
        f.textContent !== w && (f.textContent = w);
      }), i)
        if (m) {
          const f = Y(t, b, S), w = Y(p, b, S);
          i.style.left = `${f}%`, i.style.width = `${Math.max(0, w - f)}%`;
        } else {
          const f = Y(t, b, S);
          i.style.left = `${f}%`, i.style.width = `${Math.max(0, 100 - f)}%`;
        }
    }
    n && (n.addEventListener("input", () => u("min")), n.addEventListener("change", () => u("min"))), a && (a.addEventListener("input", () => u("max")), a.addEventListener("change", () => u("max")));
    const s = (d) => {
      const t = l || 1;
      return Math.round((d - b) / t) * t + b;
    };
    if (c.length && n) {
      const d = () => {
        const t = Number(c[c.length - 1].value);
        if (Number.isNaN(t)) return;
        const p = s(t), f = m ? Number(a.value) : S, w = W(p, b, f);
        String(w) !== n.value ? (n.value = String(w), n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 }))) : u("min");
      };
      c.forEach((t) => {
        t.addEventListener("input", d), t.addEventListener("change", d);
      });
    }
    if (v.length && a) {
      const d = () => {
        const t = Number(v[v.length - 1].value);
        if (Number.isNaN(t)) return;
        const p = s(t), f = n ? Number(n.value) : b, w = W(p, f, S);
        String(w) !== a.value ? (a.value = String(w), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : u("max");
      };
      v.forEach((t) => {
        t.addEventListener("input", d), t.addEventListener("change", d);
      });
    }
    function N(d) {
      if ((!n || n.disabled) && (!a || a.disabled)) return;
      const t = e.getBoundingClientRect(), p = W((d - t.left) / t.width, 0, 1), f = b + p * (S - b), w = Math.round((f - b) / (l || 1)) * (l || 1) + b, X = Number((n == null ? void 0 : n.value) ?? b), O = m ? Number(a.value) : S, B = Math.abs(w - X), R = m ? Math.abs(w - O) : 1 / 0;
      let $ = "min";
      if (m && !a.disabled)
        if (n && !n.disabled)
          if (R === B) {
            const q = (X + O) / 2;
            $ = w > q ? "max" : "min";
          } else
            $ = R < B ? "max" : "min";
        else
          $ = "max";
      if ($ === "min" && n) {
        const q = W(w, b, m ? Number(a.value) : S);
        String(q) !== n.value ? (n.value = String(q), n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 }))) : u("min");
      } else if ($ === "max" && a) {
        const q = W(w, n ? Number(n.value) : b, S);
        String(q) !== a.value ? (a.value = String(q), a.dispatchEvent(new Event("input", { bubbles: !0 })), a.dispatchEvent(new Event("change", { bubbles: !0 }))) : u("max");
      }
    }
    function h(d) {
      let t = 0, p = !1, f = null;
      const w = 4, X = (x) => {
        f !== null && x.pointerId !== f || Math.abs(x.clientX - t) > w && (p = !0);
      }, O = (x) => {
        f !== null && x.pointerId !== f || (window.removeEventListener("pointermove", X, !0), window.removeEventListener("pointerup", O, !0), window.removeEventListener("pointercancel", O, !0), p || (N(x.clientX), x.preventDefault(), x.stopPropagation()), p = !1, f = null);
      };
      d.addEventListener("pointerdown", (x) => {
        t = x.clientX, p = !1, f = x.pointerId, window.addEventListener("pointermove", X, !0), window.addEventListener("pointerup", O, !0), window.addEventListener("pointercancel", O, !0);
      }, !0);
      let B = 0, R = !1;
      const $ = (x) => {
        Math.abs(x.clientX - B) > w && (R = !0);
      }, q = (x) => {
        window.removeEventListener("mousemove", $, !0), window.removeEventListener("mouseup", q, !0), R || (N(x.clientX), x.preventDefault(), x.stopPropagation()), R = !1;
      };
      d.addEventListener("mousedown", (x) => {
        B = x.clientX, R = !1, window.addEventListener("mousemove", $, !0), window.addEventListener("mouseup", q, !0);
      }, !0);
    }
    h(e);
    const C = new MutationObserver(() => r());
    y.forEach((d) => C.observe(d, { attributes: !0, attributeFilter: ["disabled"] })), r(), u("init");
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => J()) : J());
function P(g, A) {
  return g.hasAttribute(A);
}
function _(g) {
  for (let A = 0; A < g.length; A++)
    if (!P(g[A], "data-disabled")) return A;
  return 0;
}
function Q(g = document) {
  Array.from(g.querySelectorAll("[data-hui-tabs]")).forEach((o) => {
    const e = o.querySelector("[data-hui-tablist]") || o, i = Array.from(o.querySelectorAll("[data-hui-tab]")), n = Array.from(o.querySelectorAll("[data-hui-tabpanel]"));
    if (!i.length || !n.length) return;
    const a = o.getAttribute("data-hui-tabs-orientation") === "vertical" || o.hasAttribute("data-hui-tabs-vertical");
    e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", a ? "vertical" : "horizontal");
    const m = Math.random().toString(36).slice(2);
    i.forEach((l, r) => {
      l.id || (l.id = `hui-tab-${m}-${r}`);
    }), n.forEach((l, r) => {
      l.id || (l.id = `hui-tabpanel-${m}-${r}`);
    });
    const y = Math.min(i.length, n.length);
    for (let l = 0; l < y; l++) {
      const r = i[l], u = n[l];
      r.setAttribute("role", "tab"), u.setAttribute("role", "tabpanel"), r.setAttribute("aria-controls", u.id), u.setAttribute("aria-labelledby", r.id);
    }
    function k() {
      const l = o.getAttribute("data-hui-tabs-initial-index");
      if (l !== null) {
        const r = parseInt(l, 10);
        if (!Number.isNaN(r) && r >= 0 && r < y) return r;
      }
      for (let r = 0; r < y; r++) {
        const u = i[r], s = n[r];
        if (P(u, "data-active") || P(s, "data-active"))
          return r;
      }
      return _(i);
    }
    function E(l, r) {
      let u = l;
      for (let s = 0; s < y; s++)
        if (u = (u + r + y) % y, !P(i[u], "data-disabled")) return u;
      return l;
    }
    let c = Math.max(0, Math.min(k(), y - 1));
    P(i[c], "data-disabled") && (c = _(i));
    let v = !1;
    function L(l, r, u) {
      const s = l.hasAttribute(r);
      u && !s && l.setAttribute(r, ""), !u && s && l.removeAttribute(r);
    }
    function I(l, r, u) {
      l.getAttribute(r) !== u && l.setAttribute(r, u);
    }
    function z(l = !1) {
      v = !0;
      for (let r = 0; r < y; r++) {
        const u = r === c, s = i[r], N = n[r];
        I(s, "aria-selected", u ? "true" : "false"), s.tabIndex = u && !P(s, "data-disabled") ? 0 : -1, L(s, "data-active", u), L(N, "data-active", u), L(N, "hidden", !u);
      }
      l && i[c].focus(), v = !1;
    }
    function b(l, r = !1) {
      if (!(l < 0 || l >= y) && !P(i[l], "data-disabled")) {
        if (l === c) {
          r && i[c].focus();
          return;
        }
        c = l, z(r);
      }
    }
    i.forEach((l, r) => {
      l.addEventListener("click", (u) => {
        if (P(l, "data-disabled")) {
          u.preventDefault();
          return;
        }
        b(r, !0);
      });
    });
    const S = (l) => {
      const r = l.key;
      let u = !1;
      a ? (r === "ArrowUp" && (b(E(c, -1), !0), u = !0), r === "ArrowDown" && (b(E(c, 1), !0), u = !0)) : (r === "ArrowLeft" && (b(E(c, -1), !0), u = !0), r === "ArrowRight" && (b(E(c, 1), !0), u = !0)), r === "Home" && (b(_(i), !0), u = !0), r === "End" && (b((() => {
        for (let s = y - 1; s >= 0; s--)
          if (!P(i[s], "data-disabled")) return s;
        return c;
      })(), !0), u = !0), (r === "Enter" || r === " ") && (b(c, !0), u = !0), u && (l.preventDefault(), l.stopPropagation());
    };
    e.addEventListener("keydown", S);
    try {
      const l = new MutationObserver((r) => {
        if (v) return;
        let u = !1;
        for (const s of r)
          s.type === "attributes" && (s.attributeName === "data-disabled" || s.attributeName === "data-active") && (u = !0);
        if (u) {
          if (P(i[c], "data-disabled"))
            c = _(i);
          else
            for (let s = 0; s < y; s++)
              if (s !== c && P(i[s], "data-active")) {
                c = s;
                break;
              }
          z(!1);
        }
      });
      i.forEach((r) => l.observe(r, { attributes: !0, attributeFilter: ["data-disabled", "data-active"] }));
    } catch {
    }
    z(!1);
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Q()) : Q());
function Z(g = document) {
  Array.from(g.querySelectorAll("[data-hui-toggle]")).forEach((o) => {
    const e = o.querySelector(".hui-toggle-input") || void 0, i = o.querySelector(".hui-toggle-thumb") || void 0, n = () => o.getAttribute("aria-disabled") === "true", a = (v) => {
      const L = v ? "true" : "false";
      o.setAttribute("aria-checked", L), i && i.setAttribute("aria-checked", L);
    }, m = () => o.getAttribute("aria-checked") === "true", y = e ? !!e.checked : m();
    a(y), i && i.setAttribute("aria-disabled", n() ? "true" : "false");
    function k(v) {
      e && e.checked !== v && (e.checked = v, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    function E(v) {
      a(v), k(v);
    }
    function c() {
      n() || E(!m());
    }
    o.addEventListener("click", (v) => {
      n() || c();
    }), o.addEventListener("keydown", (v) => {
      if (n()) return;
      v.key === "Spacebar" && (v.preventDefault(), c());
    }), e && (e.addEventListener("change", () => E(!!e.checked)), new MutationObserver(() => {
      o.setAttribute("aria-disabled", e.disabled ? "true" : "false"), i && i.setAttribute("aria-disabled", e.disabled ? "true" : "false"), E(!!e.checked);
    }).observe(e, { attributes: !0, attributeFilter: ["disabled", "checked"] }));
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Z()) : Z());
function F(g, A, o) {
  return Math.min(Math.max(g, A), o);
}
function tt(g = document) {
  Array.from(g.querySelectorAll("[data-hui-tooltip]")).forEach((o) => {
    let e = o.querySelector("[data-hui-tooltip-content]");
    if (!e || e === null) return;
    e = e, e.style.position = "fixed", e.style.left = "-10000px", e.style.top = "-10000px";
    let i = !1, n = !1, a = null, m = !1;
    function y() {
      return o.hasAttribute("data-hui-tooltip-disabled");
    }
    function k() {
      return o.hasAttribute("data-hui-tooltip-open");
    }
    function E(s) {
      (s.key === "Escape" || s.key === "Esc") && I();
    }
    function c() {
      if (e === null) return { w: 0, h: 0 };
      const s = e.style.display, N = e.style.visibility;
      e.style.visibility = "hidden", e.style.display = "block";
      const h = e.getBoundingClientRect(), C = h.width, d = h.height;
      return e.style.display = s || "", e.style.visibility = N || "", { w: C, h: d };
    }
    function v() {
      if (e === null) return;
      const { innerWidth: s, innerHeight: N } = window, h = o.getBoundingClientRect(), { w: C, h: d } = c(), t = 8, p = e.getAttribute("data-hui-tooltip-position") || "top", f = p === "bottom" || p === "left" || p === "right" ? p : "top", w = h.top, X = N - h.bottom, O = h.left, B = s - h.right, R = w >= d + t, $ = X >= d + t, q = O >= C + t, x = B >= C + t, et = { top: "bottom", bottom: "top", left: "right", right: "left" };
      let K;
      f === "top" || f === "bottom" ? K = O >= B ? ["left", "right"] : ["right", "left"] : K = w >= X ? ["top", "bottom"] : ["bottom", "top"];
      const nt = [f, et[f], ...K];
      let H = null;
      for (const M of nt)
        if (M === "top" && R || M === "bottom" && $ || M === "left" && q || M === "right" && x) {
          H = M;
          break;
        }
      if (H === null) {
        const M = {
          top: w,
          bottom: X,
          left: O,
          right: B
        };
        H = ["top", "bottom", "left", "right"].reduce((U, j) => M[j] > M[U] ? j : U, "top");
      }
      let D, T;
      if (H === "top" ? (T = h.top - d - t, D = h.left + h.width / 2 - C / 2, T = F(T, t, Math.max(t, N - t - d)), D = F(D, t, Math.max(t, s - t - C))) : H === "bottom" ? (T = h.bottom + t, D = h.left + h.width / 2 - C / 2, T = F(T, t, Math.max(t, N - t - d)), D = F(D, t, Math.max(t, s - t - C))) : H === "left" ? (D = h.left - C - t, T = h.top + h.height / 2 - d / 2, D = F(D, t, Math.max(t, s - t - C)), T = F(T, t, Math.max(t, N - t - d))) : (D = h.right + t, T = h.top + h.height / 2 - d / 2, D = F(D, t, Math.max(t, s - t - C)), T = F(T, t, Math.max(t, N - t - d))), e.style.left = `${Math.round(D)}px`, e.style.top = `${Math.round(T)}px`, e.setAttribute("data-placement", H), H === "top" || H === "bottom") {
        const M = h.left + h.width / 2, U = F(M - D, 6, Math.max(6, C - 6));
        e.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(U)}px`), e.style.removeProperty("--hui-tooltip-arrow-y");
      } else {
        const M = h.top + h.height / 2, U = F(M - T, 6, Math.max(6, d - 6));
        e.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(U)}px`), e.style.removeProperty("--hui-tooltip-arrow-x");
      }
      try {
        const M = getComputedStyle(e).backgroundColor;
        !M || M === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(M) ? e.style.removeProperty("--hui-tooltip-bg") : e.style.setProperty("--hui-tooltip-bg", M);
      } catch {
      }
    }
    function L() {
      e !== null && (y() && !k() || i || (i = !0, e.style.display = "block", e.setAttribute("aria-hidden", "false"), e.setAttribute("data-open", "true"), v(), window.addEventListener("scroll", b, !0), window.addEventListener("resize", S, !0), document.addEventListener("pointerdown", z, !0), document.addEventListener("keydown", E, !0)));
    }
    function I() {
      e !== null && i && (y() && k() || (i = !1, e.style.display = "none", e.setAttribute("aria-hidden", "true"), e.setAttribute("data-open", "false"), window.removeEventListener("scroll", b, !0), window.removeEventListener("resize", S, !0), document.removeEventListener("pointerdown", z, !0), document.removeEventListener("keydown", E, !0)));
    }
    function z(s) {
      o.contains(s.target) || I();
    }
    function b() {
      i && v();
    }
    function S() {
      i && v();
    }
    function l() {
      a !== null && window.clearTimeout(a), a = window.setTimeout(() => {
        n || I();
      }, 60);
    }
    function r(s) {
      m = s.pointerType === "touch", !m && (n = !0, a !== null && (window.clearTimeout(a), a = null), L());
    }
    function u() {
      m || (n = !1, l());
    }
    o.addEventListener("pointerenter", r), o.addEventListener("pointerleave", u), e.addEventListener("pointerenter", r), e.addEventListener("pointerleave", u), o.addEventListener("focusin", () => L()), o.addEventListener("focusout", () => {
      setTimeout(() => {
        const s = document.activeElement;
        s && o.contains(s) || I();
      }, 0);
    }), o.addEventListener("pointerup", (s) => {
      (s.pointerType === "touch" || s.pointerType === "pen") && (m = !0, L());
    }), o.addEventListener("click", (s) => {
      m && L();
    }), o.hasAttribute("data-hui-tooltip-open") && L();
    try {
      new MutationObserver((N) => {
        for (const h of N)
          h.type === "attributes" && (h.attributeName === "data-hui-tooltip-disabled" && (y() ? k() ? L() : I() : k() && L()), h.attributeName === "data-hui-tooltip-open" && (k() ? L() : I()));
      }).observe(o, { attributes: !0, attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"] });
    } catch {
    }
  });
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => tt()) : tt());
function it(...g) {
  return g.filter(Boolean).join(" ");
}
export {
  it as cn
};
