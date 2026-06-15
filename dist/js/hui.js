//#region resources/js/avatar/avatar.ts
function e(e = document) {
	Array.from(e.querySelectorAll("[data-ui-avatar]")).forEach((e) => {
		let t = e.querySelector("img"), n = e.querySelector("[data-ui-avatar-fallback]");
		function r() {
			t && (t.style.display = "none"), n && (n.style.display = "flex", n.setAttribute("aria-hidden", "false"));
		}
		if (t) {
			t.addEventListener("error", r, { once: !0 });
			let e = t;
			typeof e.naturalWidth == "number" && e.naturalWidth === 0 && e.complete === !0 && r();
		} else n && (n.style.display = "flex", n.setAttribute("aria-hidden", "false"));
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => e()) : e());
//#endregion
//#region resources/js/dialog/dialog.ts
var t = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function n(e) {
	return Array.from(e.querySelectorAll(t));
}
function r(e, t) {
	if (t.key !== "Tab") return;
	let r = n(e);
	if (r.length === 0) {
		t.preventDefault();
		return;
	}
	let i = r[0], a = r[r.length - 1];
	t.shiftKey ? document.activeElement === i && (t.preventDefault(), a.focus()) : document.activeElement === a && (t.preventDefault(), i.focus());
}
function i(e, t) {
	return {
		base: (e.getAttribute(`${t}`) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function a(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function o() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function s(e) {
	return new Promise((t) => {
		let n = getComputedStyle(e), r = (parseFloat(n.transitionDuration || "0") + parseFloat(n.transitionDelay || "0")) * 1e3;
		if (r <= 0) {
			t();
			return;
		}
		let i = !1, a = () => {
			i || (i = !0, e.removeEventListener("transitionend", a), t());
		};
		e.addEventListener("transitionend", a, { once: !0 }), setTimeout(a, r + 50);
	});
}
function c(e, t) {
	let { base: n, from: r } = i(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function l(e, t) {
	let { base: n, from: r, to: a } = i(e, t);
	return n.length === 0 && r.length === 0 && a.length === 0 ? Promise.resolve() : o().then(() => (e.classList.remove(...r), e.classList.add(...a), s(e))).then(() => {
		e.classList.remove(...n, ...a);
	});
}
function u(e, t) {
	let { base: n, from: r, to: a } = i(e, t);
	return n.length === 0 && r.length === 0 && a.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), o().then(() => (e.classList.remove(...r), e.classList.add(...a), s(e))));
}
function d(e, t) {
	let { base: n, to: r } = i(e, t);
	e.classList.remove(...n, ...r);
}
function f(e) {
	let t = [];
	return (a(e, "data-hui-dialog-enter") || a(e, "data-hui-dialog-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-dialog-enter], [data-hui-dialog-leave]"))), t;
}
function p(e) {
	if (e.hasAttribute("data-hui-dialog-initialized")) return;
	e.setAttribute("data-hui-dialog-initialized", "");
	let t = null, i = !1, o = e.hasAttribute("data-hui-dialog-no-escape"), s = e.hasAttribute("data-hui-dialog-no-backdrop-close"), p = e.hasAttribute("data-hui-dialog-scroll-lock");
	function m() {
		if (e.open || i) return;
		t = document.activeElement;
		let r = f(e).filter((e) => a(e, "data-hui-dialog-enter"));
		r.forEach((e) => c(e, "data-hui-dialog-enter")), e.showModal(), e.setAttribute("data-hui-dialog-open", ""), p && (document.body.style.overflow = "hidden");
		let o = n(e);
		o.length > 0 && o[0].focus(), r.length > 0 && Promise.all(r.map((e) => l(e, "data-hui-dialog-enter"))), e.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
	}
	function g() {
		if (!e.open || i) return;
		let n = f(e).filter((e) => a(e, "data-hui-dialog-leave"));
		function r() {
			e.close(), e.removeAttribute("data-hui-dialog-open"), p && (document.querySelector("dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, i = !1, e.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
		}
		if (n.length > 0) {
			i = !0;
			let e = n.map((e) => u(e, "data-hui-dialog-leave"));
			Promise.all(e).then(() => {
				r(), n.forEach((e) => d(e, "data-hui-dialog-leave"));
			});
		} else r();
	}
	e.addEventListener("keydown", (t) => {
		r(e, t);
	}), e.addEventListener("cancel", (e) => {
		e.preventDefault(), o || g();
	}), e.addEventListener("click", (t) => {
		if (s) return;
		let n = t.target;
		(n === e || n.hasAttribute("data-hui-dialog-background")) && g();
	}), e.addEventListener("click", (e) => {
		e.target.closest("[data-hui-dialog-close]") && g();
	});
	let _ = e.querySelector("[data-hui-dialog-title]"), v = e.querySelector("[data-hui-dialog-description]");
	_ && (_.id ||= `hui-dialog-title-${h()}`, e.setAttribute("aria-labelledby", _.id)), v && (v.id ||= `hui-dialog-desc-${h()}`, e.setAttribute("aria-describedby", v.id)), e._hui = {
		open: m,
		close: g
	}, e.hasAttribute("data-hui-dialog-open") && (e.removeAttribute("data-hui-dialog-open"), m());
}
var m = 0;
function h() {
	return `hui-${++m}-${Date.now()}`;
}
function g(e) {
	Array.from(e.querySelectorAll("[data-hui-dialog-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-dialog-trigger-bound") || (e.setAttribute("data-hui-dialog-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-dialog-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			!n || !n._hui || n._hui.open();
		}));
	});
}
function _(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dialog]")).forEach(p), g(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => _()) : _());
//#endregion
//#region resources/js/disclosure/disclosure.ts
function v(e = document) {
	let t = Array.from(e.querySelectorAll("[data-hui-disclosure]")), n = (e, t) => {
		let n = e.hasAttribute("open");
		if (t === "close" || t === void 0 && n) {
			e.removeAttribute("open"), e.removeAttribute("data-opened");
			return;
		}
		(t === "open" || t === void 0 && !n) && (e.setAttribute("open", ""), e.setAttribute("data-opened", String(Date.now())));
	}, r = (e, t, r) => {
		if (!Number.isFinite(t) || t <= 0) return;
		let i = Array.from(e.querySelectorAll(":scope > [data-hui-disclosure]")).filter((e) => e.hasAttribute("open")).sort((e, t) => Number(e.getAttribute("data-opened") ?? "0") - Number(t.getAttribute("data-opened") ?? "0")), a = i.length - t;
		if (!(a <= 0)) {
			for (let e of i) {
				if (a <= 0) break;
				r && e === r || (n(e, "close"), a--);
			}
			a > 0 && r && r.hasAttribute("open") && n(r, "close");
		}
	};
	t.forEach((e) => {
		let t = e.querySelector("[data-hui-disclosure-summary]");
		t && t.addEventListener("click", (t) => {
			if (t.preventDefault(), e.hasAttribute("data-disabled")) return;
			let i = e.parentElement?.matches("[data-hui-disclosure-container]") ? e.parentElement : null, a = !e.hasAttribute("open");
			if (n(e), i && a) {
				let t = i.getAttribute("data-max-count");
				r(i, t ? parseInt(t, 10) : NaN, e);
			}
		});
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => v()) : v());
//#endregion
//#region resources/js/dropdown/dropdown.ts
var y = "[data-hui-dropdown-item]:not([data-disabled])";
function b(e, t) {
	let n = e.getBoundingClientRect(), { innerHeight: r } = window;
	t.style.maxHeight = "";
	let i = t.hasAttribute("hidden");
	i && t.removeAttribute("hidden");
	let a = t.style.visibility, o = t.style.display;
	t.style.visibility = "hidden", t.style.display = "block";
	let s = t.getBoundingClientRect().height;
	t.style.visibility = a, t.style.display = o, i && t.setAttribute("hidden", "");
	let c = r - n.bottom - 4 - 8, l = n.top - 4 - 8, u;
	u = c >= s ? "bottom" : l >= s ? "top" : c >= l ? "bottom" : "top", u === "bottom" ? (t.style.top = "calc(100% + 4px)", t.style.bottom = "", c < s && (t.style.maxHeight = `${Math.floor(c)}px`)) : (t.style.bottom = "calc(100% + 4px)", t.style.top = "", l < s && (t.style.maxHeight = `${Math.floor(l)}px`)), t.setAttribute("data-placement", u);
}
function x(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function S(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function C() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function w(e) {
	return new Promise((t) => {
		let n = getComputedStyle(e), r = (parseFloat(n.transitionDuration || "0") + parseFloat(n.transitionDelay || "0")) * 1e3;
		if (r <= 0) {
			t();
			return;
		}
		let i = !1, a = () => {
			i || (i = !0, e.removeEventListener("transitionend", a), t());
		};
		e.addEventListener("transitionend", a, { once: !0 }), setTimeout(a, r + 50);
	});
}
function ee(e) {
	if (!S(e, "data-hui-dropdown-enter")) return Promise.resolve();
	let { base: t, from: n, to: r } = x(e, "data-hui-dropdown-enter");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), C().then(() => (e.classList.remove(...n), e.classList.add(...r), w(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function te(e) {
	if (!S(e, "data-hui-dropdown-leave")) return Promise.resolve();
	let { base: t, from: n, to: r } = x(e, "data-hui-dropdown-leave");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), C().then(() => (e.classList.remove(...n), e.classList.add(...r), w(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function T(e) {
	if (e.hasAttribute("data-hui-dropdown-initialized")) return;
	e.setAttribute("data-hui-dropdown-initialized", "");
	let t = e.querySelector("[data-hui-dropdown-trigger]"), n = e.querySelector("[data-hui-dropdown-items]");
	if (!t || !n) return;
	let r = !1, i = !1, a = -1, o = "", s = null;
	function c() {
		return Array.from(n.querySelectorAll(y));
	}
	function l(e) {
		c().forEach((t, n) => {
			n === e ? (t.setAttribute("data-active", ""), t.setAttribute("tabindex", "0"), t.focus()) : (t.removeAttribute("data-active"), t.setAttribute("tabindex", "-1"));
		}), a = e;
	}
	function u() {
		c().forEach((e) => {
			e.removeAttribute("data-active"), e.setAttribute("tabindex", "-1");
		}), a = -1;
	}
	function d(a = !1) {
		r || i || (r = !0, b(t, n), n.style.display = "block", n.removeAttribute("hidden"), t.setAttribute("aria-expanded", "true"), e.setAttribute("data-open", ""), a && c().length > 0 && l(0), ee(n), requestAnimationFrame(() => {
			document.addEventListener("pointerdown", m, !0);
		}), e.dispatchEvent(new CustomEvent("hui:dropdown:open", { bubbles: !0 })));
	}
	function f(a = !0) {
		if (!r || i) return;
		function o() {
			r = !1, i = !1, n.style.display = "none", n.setAttribute("hidden", ""), t.setAttribute("aria-expanded", "false"), e.removeAttribute("data-open"), u(), document.removeEventListener("pointerdown", m, !0), a && t.focus(), e.dispatchEvent(new CustomEvent("hui:dropdown:close", { bubbles: !0 }));
		}
		S(n, "data-hui-dropdown-leave") ? (i = !0, te(n).then(o)) : o();
	}
	function p() {
		r ? f() : d();
	}
	function m(t) {
		e.contains(t.target) || f(!1);
	}
	function h(e) {
		o += e.toLowerCase(), s && clearTimeout(s), s = setTimeout(() => {
			o = "";
		}, 350);
		let t = c().findIndex((e) => (e.textContent || "").trim().toLowerCase().startsWith(o));
		t !== -1 && l(t);
	}
	function g(e) {
		let t = c();
		if (t.length !== 0) switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), r ? l(a < t.length - 1 ? a + 1 : 0) : d(!0);
				break;
			case "ArrowUp":
				e.preventDefault(), r ? l(a > 0 ? a - 1 : t.length - 1) : (d(), l(t.length - 1));
				break;
			case "Home":
				r && (e.preventDefault(), l(0));
				break;
			case "End":
				r && (e.preventDefault(), l(t.length - 1));
				break;
			case "Enter":
			case " ":
				e.preventDefault(), r && a >= 0 && a < t.length ? (t[a].click(), f()) : r || d(!0);
				break;
			case "Escape":
				r && (e.preventDefault(), f());
				break;
			case "Tab":
				r && f();
				break;
			default:
				r && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), h(e.key));
				break;
		}
	}
	let _ = n.id;
	_ || (_ = `hui-dropdown-items-${++ne}-${Date.now()}`, n.id = _), t.setAttribute("aria-haspopup", "true"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", _), n.setAttribute("role", "menu"), n.style.display = "none", n.setAttribute("hidden", ""), c().forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.setAttribute("tabindex", "-1");
	}), Array.from(n.querySelectorAll("[data-hui-dropdown-item]")).forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.hasAttribute("data-disabled") && e.setAttribute("aria-disabled", "true");
	}), t.addEventListener("click", (e) => {
		e.preventDefault(), p();
	}), t.addEventListener("keydown", g), n.addEventListener("keydown", g), n.addEventListener("click", (e) => {
		let t = e.target.closest(y);
		t && (t.dispatchEvent(new CustomEvent("hui:dropdown:select", {
			bubbles: !0,
			detail: { value: t.getAttribute("data-value") || t.textContent?.trim() }
		})), f());
	}), n.addEventListener("pointerenter", (e) => {
		let t = e.target.closest(y);
		if (t) {
			let e = c().indexOf(t);
			e !== -1 && l(e);
		}
	}, !0), n.addEventListener("pointerleave", (e) => {
		e.target.closest(y) && u();
	}, !0), e._hui = {
		open: d,
		close: f,
		toggle: p
	};
}
var ne = 0;
function E(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dropdown]")).forEach(T);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => E()) : E());
//#endregion
//#region resources/js/flyout/flyout.ts
var D = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function O(e) {
	return Array.from(e.querySelectorAll(D));
}
function re(e, t) {
	if (t.key !== "Tab") return;
	let n = O(e);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = n[0], i = n[n.length - 1];
	t.shiftKey ? document.activeElement === r && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus());
}
function k(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function A(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function j() {
	return new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(() => e())));
}
function M(e) {
	return new Promise((t) => {
		let n = getComputedStyle(e), r = (parseFloat(n.transitionDuration || "0") + parseFloat(n.transitionDelay || "0")) * 1e3;
		if (r <= 0) {
			t();
			return;
		}
		let i = !1, a = () => {
			i || (i = !0, e.removeEventListener("transitionend", a), t());
		};
		e.addEventListener("transitionend", a, { once: !0 }), setTimeout(a, r + 50);
	});
}
function N(e, t) {
	let { base: n, from: r } = k(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function P(e, t) {
	let { base: n, from: r, to: i } = k(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : j().then(() => (e.classList.remove(...r), e.classList.add(...i), M(e))).then(() => {
		e.classList.remove(...n, ...i);
	});
}
function F(e, t) {
	let { base: n, from: r, to: i } = k(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), j().then(() => (e.classList.remove(...r), e.classList.add(...i), M(e))));
}
function I(e, t) {
	let { base: n, to: r } = k(e, t);
	e.classList.remove(...n, ...r);
}
function L(e) {
	let t = [];
	return (A(e, "data-hui-flyout-enter") || A(e, "data-hui-flyout-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-flyout-enter], [data-hui-flyout-leave]"))), t;
}
function R(e) {
	let t = e.getAttribute("data-hui-flyout-inline");
	if (!t) return null;
	let n = parseInt(t, 10);
	return Number.isFinite(n) && n > 0 ? n : null;
}
function z(e) {
	let t = R(e);
	return t === null ? !1 : window.innerWidth >= t;
}
function B(e) {
	if (e.hasAttribute("data-hui-flyout-initialized")) return;
	e.setAttribute("data-hui-flyout-initialized", "");
	let t = null, n = !1, r = e.hasAttribute("data-hui-flyout-no-escape"), i = e.hasAttribute("data-hui-flyout-no-backdrop-close"), a = e.hasAttribute("data-hui-flyout-scroll-lock");
	function o() {
		R(e) !== null && (z(e) ? (e.setAttribute("data-hui-flyout-mode", "inline"), e.open && e.hasAttribute("data-hui-flyout-open") && e.close(), e.removeAttribute("data-hui-flyout-open")) : e.setAttribute("data-hui-flyout-mode", "flyout"));
	}
	function s() {
		if (z(e) || e.open || n) return;
		t = document.activeElement;
		let r = L(e).filter((e) => A(e, "data-hui-flyout-enter"));
		r.forEach((e) => N(e, "data-hui-flyout-enter")), e.showModal(), e.setAttribute("data-hui-flyout-open", ""), a && (document.body.style.overflow = "hidden");
		let i = O(e);
		i.length > 0 && i[0].focus(), r.length > 0 && Promise.all(r.map((e) => P(e, "data-hui-flyout-enter"))), e.dispatchEvent(new CustomEvent("hui:flyout:open", { bubbles: !0 }));
	}
	function c() {
		if (z(e) || !e.open || n) return;
		let r = L(e).filter((e) => A(e, "data-hui-flyout-leave"));
		function i() {
			e.close(), e.removeAttribute("data-hui-flyout-open"), a && (document.querySelector("dialog[data-hui-flyout][data-hui-flyout-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, n = !1, e.dispatchEvent(new CustomEvent("hui:flyout:close", { bubbles: !0 }));
		}
		if (r.length > 0) {
			n = !0;
			let e = r.map((e) => F(e, "data-hui-flyout-leave"));
			Promise.all(e).then(() => {
				i(), r.forEach((e) => I(e, "data-hui-flyout-leave"));
			});
		} else i();
	}
	e.addEventListener("keydown", (t) => {
		re(e, t);
	}), e.addEventListener("cancel", (e) => {
		e.preventDefault(), r || c();
	}), e.addEventListener("click", (t) => {
		if (i) return;
		let n = t.target;
		(n === e || n.hasAttribute("data-hui-flyout-background")) && c();
	}), e.addEventListener("click", (e) => {
		e.target.closest("[data-hui-flyout-close]") && c();
	});
	let l = e.querySelector("[data-hui-flyout-title]"), u = e.querySelector("[data-hui-flyout-description]");
	l && (l.id ||= `hui-flyout-title-${H()}`, e.setAttribute("aria-labelledby", l.id)), u && (u.id ||= `hui-flyout-desc-${H()}`, e.setAttribute("aria-describedby", u.id));
	let d = R(e);
	d !== null && (window.matchMedia(`(min-width: ${d}px)`).addEventListener("change", o), o()), e._hui = {
		open: s,
		close: c
	}, e.hasAttribute("data-hui-flyout-open") && (e.removeAttribute("data-hui-flyout-open"), s());
}
var V = 0;
function H() {
	return `hui-${++V}-${Date.now()}`;
}
function U(e) {
	Array.from(e.querySelectorAll("[data-hui-flyout-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-flyout-trigger-bound") || (e.setAttribute("data-hui-flyout-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-flyout-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			!n || !n._hui || n._hui.open();
		}));
	});
}
function W(e = document) {
	Array.from(e.querySelectorAll("[data-hui-flyout]")).forEach(B), U(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => W()) : W());
//#endregion
//#region resources/js/range-slider/range-slider.ts
function G(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function K(e, t, n) {
	return n === t ? 0 : (e - t) / (n - t) * 100;
}
function q(e = document) {
	Array.from(e.querySelectorAll("[data-hui-range-slider]")).forEach((e) => {
		let t = e.querySelector("[data-hui-range-slider-track]") || e, n = e.querySelector("[data-hui-range-slider-track-value]"), r = e.querySelector("input.hui-range-slider-thumb[data-hui-range-slider-thumb=\"min\"]"), i = e.querySelector("input.hui-range-slider-thumb[data-hui-range-slider-thumb=\"max\"]"), a = !!i, o = [r, i].filter(Boolean), s = Array.from(e.querySelectorAll("[data-hui-range-slider-value=\"min\"]")), c = Array.from(e.querySelectorAll("[data-hui-range-slider-value=\"max\"]")), l = s.filter((e) => e instanceof HTMLInputElement), u = c.filter((e) => e instanceof HTMLInputElement), d = s.filter((e) => !(e instanceof HTMLInputElement)), f = c.filter((e) => !(e instanceof HTMLInputElement));
		if (!r && !i) return;
		let { min: p, max: m, step: h } = (() => {
			let e = r || i;
			return {
				min: Number(e.min || "0"),
				max: Number(e.max || "100"),
				step: Number(e.step || "1")
			};
		})();
		function g() {
			let t = o.some((e) => !e.disabled);
			e.setAttribute("aria-disabled", t ? "false" : "true");
		}
		function _(e = "init") {
			let t = Number(r?.value ?? p), o = a ? Number(i.value) : m;
			if (t = G(t, p, m), o = G(o, p, m), a && (e === "min" && t > o && (t = o), e === "max" && o < t && (o = t)), r && Number(r.value) !== t && (r.value = String(t)), a && Number(i.value) !== o && (i.value = String(o)), l.forEach((e) => {
				Number(e.value) !== t && (e.value = String(t));
			}), u.forEach((e) => {
				a && Number(e.value) !== o && (e.value = String(o));
			}), d.forEach((e) => {
				e.textContent !== String(t) && (e.textContent = String(t));
			}), f.forEach((e) => {
				let t = String(o);
				e.textContent !== t && (e.textContent = t);
			}), n) if (a) {
				let e = K(t, p, m), r = K(o, p, m);
				n.style.left = `${e}%`, n.style.width = `${Math.max(0, r - e)}%`;
			} else {
				let e = K(t, p, m);
				n.style.left = `${e}%`, n.style.width = `${Math.max(0, 100 - e)}%`;
			}
		}
		r && (r.addEventListener("input", () => _("min")), r.addEventListener("change", () => _("min"))), i && (i.addEventListener("input", () => _("max")), i.addEventListener("change", () => _("max")));
		let v = (e) => {
			let t = h || 1;
			return Math.round((e - p) / t) * t + p;
		};
		if (l.length && r) {
			let e = () => {
				let e = Number(l[l.length - 1].value);
				if (Number.isNaN(e)) return;
				let t = G(v(e), p, a ? Number(i.value) : m);
				String(t) === r.value ? _("min") : (r.value = String(t), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
			};
			l.forEach((t) => {
				t.addEventListener("input", e), t.addEventListener("change", e);
			});
		}
		if (u.length && i) {
			let e = () => {
				let e = Number(u[u.length - 1].value);
				if (Number.isNaN(e)) return;
				let t = G(v(e), r ? Number(r.value) : p, m);
				String(t) === i.value ? _("max") : (i.value = String(t), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
			};
			u.forEach((t) => {
				t.addEventListener("input", e), t.addEventListener("change", e);
			});
		}
		function y(e) {
			if ((!r || r.disabled) && (!i || i.disabled)) return;
			let n = t.getBoundingClientRect(), o = p + G((e - n.left) / n.width, 0, 1) * (m - p), s = Math.round((o - p) / (h || 1)) * (h || 1) + p, c = Number(r?.value ?? p), l = a ? Number(i.value) : m, u = Math.abs(s - c), d = a ? Math.abs(s - l) : Infinity, f = "min";
			if (a && !i.disabled && (f = r && !r.disabled ? d === u ? s > (c + l) / 2 ? "max" : "min" : d < u ? "max" : "min" : "max"), f === "min" && r) {
				let e = G(s, p, a ? Number(i.value) : m);
				String(e) === r.value ? _("min") : (r.value = String(e), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
			} else if (f === "max" && i) {
				let e = G(s, r ? Number(r.value) : p, m);
				String(e) === i.value ? _("max") : (i.value = String(e), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
		}
		function b(e) {
			let t = 0, n = !1, r = null, i = (e) => {
				r !== null && e.pointerId !== r || Math.abs(e.clientX - t) > 4 && (n = !0);
			}, a = (e) => {
				r !== null && e.pointerId !== r || (window.removeEventListener("pointermove", i, !0), window.removeEventListener("pointerup", a, !0), window.removeEventListener("pointercancel", a, !0), n || (y(e.clientX), e.preventDefault(), e.stopPropagation()), n = !1, r = null);
			};
			e.addEventListener("pointerdown", (e) => {
				t = e.clientX, n = !1, r = e.pointerId, window.addEventListener("pointermove", i, !0), window.addEventListener("pointerup", a, !0), window.addEventListener("pointercancel", a, !0);
			}, !0);
			let o = 0, s = !1, c = (e) => {
				Math.abs(e.clientX - o) > 4 && (s = !0);
			}, l = (e) => {
				window.removeEventListener("mousemove", c, !0), window.removeEventListener("mouseup", l, !0), s || (y(e.clientX), e.preventDefault(), e.stopPropagation()), s = !1;
			};
			e.addEventListener("mousedown", (e) => {
				o = e.clientX, s = !1, window.addEventListener("mousemove", c, !0), window.addEventListener("mouseup", l, !0);
			}, !0);
		}
		b(t);
		let x = new MutationObserver(() => g());
		o.forEach((e) => x.observe(e, {
			attributes: !0,
			attributeFilter: ["disabled"]
		})), g(), _("init");
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => q()) : q());
//#endregion
//#region resources/js/tabs/tabs.ts
function J(e, t) {
	return e.hasAttribute(t);
}
function Y(e) {
	for (let t = 0; t < e.length; t++) if (!J(e[t], "data-disabled")) return t;
	return 0;
}
function X(e = document) {
	Array.from(e.querySelectorAll("[data-hui-tabs]")).forEach((e) => {
		let t = e.querySelector("[data-hui-tablist]") || e, n = Array.from(e.querySelectorAll("[data-hui-tab]")), r = Array.from(e.querySelectorAll("[data-hui-tabpanel]"));
		if (!n.length || !r.length) return;
		let i = e.getAttribute("data-hui-tabs-orientation") === "vertical" || e.hasAttribute("data-hui-tabs-vertical");
		t.setAttribute("role", "tablist"), t.setAttribute("aria-orientation", i ? "vertical" : "horizontal");
		let a = Math.random().toString(36).slice(2);
		n.forEach((e, t) => {
			e.id ||= `hui-tab-${a}-${t}`;
		}), r.forEach((e, t) => {
			e.id ||= `hui-tabpanel-${a}-${t}`;
		});
		let o = Math.min(n.length, r.length);
		for (let e = 0; e < o; e++) {
			let t = n[e], i = r[e];
			t.setAttribute("role", "tab"), i.setAttribute("role", "tabpanel"), t.setAttribute("aria-controls", i.id), i.setAttribute("aria-labelledby", t.id);
		}
		function s() {
			let t = e.getAttribute("data-hui-tabs-initial-index");
			if (t !== null) {
				let e = parseInt(t, 10);
				if (!Number.isNaN(e) && e >= 0 && e < o) return e;
			}
			for (let e = 0; e < o; e++) {
				let t = n[e], i = r[e];
				if (J(t, "data-active") || J(i, "data-active")) return e;
			}
			return Y(n);
		}
		function c(e, t) {
			let r = e;
			for (let e = 0; e < o; e++) if (r = (r + t + o) % o, !J(n[r], "data-disabled")) return r;
			return e;
		}
		let l = Math.max(0, Math.min(s(), o - 1));
		J(n[l], "data-disabled") && (l = Y(n));
		let u = !1;
		function d(e, t, n) {
			let r = e.hasAttribute(t);
			n && !r && e.setAttribute(t, ""), !n && r && e.removeAttribute(t);
		}
		function f(e, t, n) {
			e.getAttribute(t) !== n && e.setAttribute(t, n);
		}
		function p(e = !1) {
			u = !0;
			for (let e = 0; e < o; e++) {
				let t = e === l, i = n[e], a = r[e];
				f(i, "aria-selected", t ? "true" : "false"), i.tabIndex = t && !J(i, "data-disabled") ? 0 : -1, d(i, "data-active", t), d(a, "data-active", t), d(a, "hidden", !t);
			}
			e && n[l].focus(), u = !1;
		}
		function m(e, t = !1) {
			if (!(e < 0 || e >= o) && !J(n[e], "data-disabled")) {
				if (e === l) {
					t && n[l].focus();
					return;
				}
				l = e, p(t);
			}
		}
		n.forEach((e, t) => {
			e.addEventListener("click", (n) => {
				if (J(e, "data-disabled")) {
					n.preventDefault();
					return;
				}
				m(t, !0);
			});
		}), t.addEventListener("keydown", (e) => {
			let t = e.key, r = !1;
			i ? (t === "ArrowUp" && (m(c(l, -1), !0), r = !0), t === "ArrowDown" && (m(c(l, 1), !0), r = !0)) : (t === "ArrowLeft" && (m(c(l, -1), !0), r = !0), t === "ArrowRight" && (m(c(l, 1), !0), r = !0)), t === "Home" && (m(Y(n), !0), r = !0), t === "End" && (m((() => {
				for (let e = o - 1; e >= 0; e--) if (!J(n[e], "data-disabled")) return e;
				return l;
			})(), !0), r = !0), (t === "Enter" || t === " ") && (m(l, !0), r = !0), r && (e.preventDefault(), e.stopPropagation());
		});
		try {
			let e = new MutationObserver((e) => {
				if (u) return;
				let t = !1;
				for (let n of e) n.type === "attributes" && (n.attributeName === "data-disabled" || n.attributeName === "data-active") && (t = !0);
				if (t) {
					if (J(n[l], "data-disabled")) l = Y(n);
					else for (let e = 0; e < o; e++) if (e !== l && J(n[e], "data-active")) {
						l = e;
						break;
					}
					p(!1);
				}
			});
			n.forEach((t) => e.observe(t, {
				attributes: !0,
				attributeFilter: ["data-disabled", "data-active"]
			}));
		} catch {}
		p(!1);
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => X()) : X());
//#endregion
//#region resources/js/toggle/toggle.ts
function Z(e = document) {
	Array.from(e.querySelectorAll("[data-hui-toggle]")).forEach((e) => {
		let t = e.querySelector(".hui-toggle-input") || void 0, n = e.querySelector(".hui-toggle-thumb") || void 0, r = () => e.getAttribute("aria-disabled") === "true", i = (t) => {
			let r = t ? "true" : "false";
			e.setAttribute("aria-checked", r), n && n.setAttribute("aria-checked", r);
		}, a = () => e.getAttribute("aria-checked") === "true";
		i(t ? !!t.checked : a()), n && n.setAttribute("aria-disabled", r() ? "true" : "false");
		function o(e) {
			t && t.checked !== e && (t.checked = e, t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
		function s(e) {
			i(e), o(e);
		}
		function c() {
			r() || s(!a());
		}
		e.addEventListener("click", (e) => {
			r() || c();
		}), e.addEventListener("keydown", (e) => {
			r() || e.key === "Spacebar" && (e.preventDefault(), c());
		}), t && (t.addEventListener("change", () => s(!!t.checked)), new MutationObserver(() => {
			e.setAttribute("aria-disabled", t.disabled ? "true" : "false"), n && n.setAttribute("aria-disabled", t.disabled ? "true" : "false"), s(!!t.checked);
		}).observe(t, {
			attributes: !0,
			attributeFilter: ["disabled", "checked"]
		}));
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Z()) : Z());
//#endregion
//#region resources/js/tooltip/tooltip.ts
function Q(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function $(e = document) {
	Array.from(e.querySelectorAll("[data-hui-tooltip]")).forEach((e) => {
		let t = e.querySelector("[data-hui-tooltip-content]");
		if (!t || t === null) return;
		t = t, t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "-10000px";
		let n = !1, r = !1, i = null, a = !1;
		function o() {
			return e.hasAttribute("data-hui-tooltip-disabled");
		}
		function s() {
			return e.hasAttribute("data-hui-tooltip-open");
		}
		function c(e) {
			(e.key === "Escape" || e.key === "Esc") && f();
		}
		function l() {
			if (t === null) return {
				w: 0,
				h: 0
			};
			let e = t.style.display, n = t.style.visibility;
			t.style.visibility = "hidden", t.style.display = "block";
			let r = t.getBoundingClientRect(), i = r.width, a = r.height;
			return t.style.display = e || "", t.style.visibility = n || "", {
				w: i,
				h: a
			};
		}
		function u() {
			if (t === null) return;
			let { innerWidth: n, innerHeight: r } = window, i = e.getBoundingClientRect(), { w: a, h: o } = l(), s = t.getAttribute("data-hui-tooltip-position") || "top", c = s === "bottom" || s === "left" || s === "right" ? s : "top", u = i.top, d = r - i.bottom, f = i.left, p = n - i.right, m = u >= o + 8, h = d >= o + 8, g = f >= a + 8, _ = p >= a + 8, v = {
				top: "bottom",
				bottom: "top",
				left: "right",
				right: "left"
			}, y;
			y = c === "top" || c === "bottom" ? f >= p ? ["left", "right"] : ["right", "left"] : u >= d ? ["top", "bottom"] : ["bottom", "top"];
			let b = [
				c,
				v[c],
				...y
			], x = null;
			for (let e of b) if (e === "top" && m || e === "bottom" && h || e === "left" && g || e === "right" && _) {
				x = e;
				break;
			}
			if (x === null) {
				let e = {
					top: u,
					bottom: d,
					left: f,
					right: p
				};
				x = [
					"top",
					"bottom",
					"left",
					"right"
				].reduce((t, n) => e[n] > e[t] ? n : t, "top");
			}
			let S, C;
			if (x === "top" ? (C = i.top - o - 8, S = i.left + i.width / 2 - a / 2, C = Q(C, 8, Math.max(8, r - 8 - o)), S = Q(S, 8, Math.max(8, n - 8 - a))) : x === "bottom" ? (C = i.bottom + 8, S = i.left + i.width / 2 - a / 2, C = Q(C, 8, Math.max(8, r - 8 - o)), S = Q(S, 8, Math.max(8, n - 8 - a))) : x === "left" ? (S = i.left - a - 8, C = i.top + i.height / 2 - o / 2, S = Q(S, 8, Math.max(8, n - 8 - a)), C = Q(C, 8, Math.max(8, r - 8 - o))) : (S = i.right + 8, C = i.top + i.height / 2 - o / 2, S = Q(S, 8, Math.max(8, n - 8 - a)), C = Q(C, 8, Math.max(8, r - 8 - o))), t.style.left = `${Math.round(S)}px`, t.style.top = `${Math.round(C)}px`, t.setAttribute("data-placement", x), x === "top" || x === "bottom") {
				let e = Q(i.left + i.width / 2 - S, 6, Math.max(6, a - 6));
				t.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(e)}px`), t.style.removeProperty("--hui-tooltip-arrow-y");
			} else {
				let e = Q(i.top + i.height / 2 - C, 6, Math.max(6, o - 6));
				t.style.setProperty("--hui-tooltip-arrow-y", `${Math.round(e)}px`), t.style.removeProperty("--hui-tooltip-arrow-x");
			}
			try {
				let e = getComputedStyle(t).backgroundColor;
				!e || e === "transparent" || /rgba\([^\)]*,\s*0\s*\)/.test(e) ? t.style.removeProperty("--hui-tooltip-bg") : t.style.setProperty("--hui-tooltip-bg", e);
			} catch {}
		}
		function d() {
			t !== null && (o() && !s() || n || (n = !0, t.style.display = "block", t.setAttribute("aria-hidden", "false"), t.setAttribute("data-open", "true"), u(), window.addEventListener("scroll", m, !0), window.addEventListener("resize", h, !0), document.addEventListener("pointerdown", p, !0), document.addEventListener("keydown", c, !0)));
		}
		function f() {
			t !== null && n && (o() && s() || (n = !1, t.style.display = "none", t.setAttribute("aria-hidden", "true"), t.setAttribute("data-open", "false"), window.removeEventListener("scroll", m, !0), window.removeEventListener("resize", h, !0), document.removeEventListener("pointerdown", p, !0), document.removeEventListener("keydown", c, !0)));
		}
		function p(t) {
			e.contains(t.target) || f();
		}
		function m() {
			n && u();
		}
		function h() {
			n && u();
		}
		function g() {
			i !== null && window.clearTimeout(i), i = window.setTimeout(() => {
				r || f();
			}, 60);
		}
		function _(e) {
			a = e.pointerType === "touch", !a && (r = !0, i !== null && (window.clearTimeout(i), i = null), d());
		}
		function v() {
			a || (r = !1, g());
		}
		e.addEventListener("pointerenter", _), e.addEventListener("pointerleave", v), t.addEventListener("pointerenter", _), t.addEventListener("pointerleave", v), e.addEventListener("focusin", () => d()), e.addEventListener("focusout", () => {
			setTimeout(() => {
				let t = document.activeElement;
				t && e.contains(t) || f();
			}, 0);
		}), e.addEventListener("pointerup", (e) => {
			(e.pointerType === "touch" || e.pointerType === "pen") && (a = !0, d());
		}), e.addEventListener("click", (e) => {
			a && d();
		}), e.hasAttribute("data-hui-tooltip-open") && d();
		try {
			new MutationObserver((e) => {
				for (let t of e) t.type === "attributes" && (t.attributeName === "data-hui-tooltip-disabled" && (o() ? s() ? d() : f() : s() && d()), t.attributeName === "data-hui-tooltip-open" && (s() ? d() : f()));
			}).observe(e, {
				attributes: !0,
				attributeFilter: ["data-hui-tooltip-open", "data-hui-tooltip-disabled"]
			});
		} catch {}
	});
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => $()) : $());
//#endregion
//#region resources/js/hui.ts
function ie(...e) {
	return e.filter(Boolean).join(" ");
}
//#endregion
export { ie as cn };
