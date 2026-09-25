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
//#region resources/js/combobox/combobox.ts
var t = 8, n = "[data-hui-combobox-option]", r = 0;
function i(e) {
	return `hui-combobox-${e}-${++r}`;
}
function a(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function o(e) {
	return e.toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function s(e) {
	let [t, n] = (e || "bottom start").trim().toLowerCase().split(/\s+/);
	return {
		side: t === "top" ? "top" : "bottom",
		align: n === "start" || n === "end" ? n : "center"
	};
}
function c() {
	let e = window.visualViewport;
	return e && e.width > 0 && e.height > 0 ? {
		top: e.offsetTop,
		left: e.offsetLeft,
		right: e.offsetLeft + e.width,
		bottom: e.offsetTop + e.height
	} : {
		top: 0,
		left: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	};
}
function l(e) {
	let t = e.parentElement;
	if (!t) return {
		x: 0,
		y: 0
	};
	let n = Array.from(t.children).find((e) => e.hasAttribute("data-hui-combobox-probe"));
	n || (n = document.createElement("span"), n.setAttribute("data-hui-combobox-probe", ""), n.setAttribute("aria-hidden", "true"), n.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;", t.insertBefore(n, e));
	let r = n.getBoundingClientRect();
	return {
		x: r.left,
		y: r.top
	};
}
function u(e, n) {
	let { side: r, align: i } = s(n.getAttribute("data-hui-combobox-anchor")), o = parseFloat(n.getAttribute("data-hui-combobox-gap") || "4") || 0, u = c(), d = e.getBoundingClientRect();
	n.style.setProperty("--hui-combobox-anchor-width", `${d.width}px`), n.style.maxWidth = `${Math.max(0, u.right - u.left - t * 2)}px`, n.style.maxHeight = "";
	let { width: f, height: p } = n.getBoundingClientRect(), m = u.bottom - d.bottom - o - t, h = d.top - u.top - o - t, g = r === "bottom" ? m : h, _ = g < p && (r === "bottom" ? h : m) > g ? r === "bottom" ? "top" : "bottom" : r, v = Math.max(0, _ === "bottom" ? m : h);
	p > v && (n.style.maxHeight = `${Math.floor(v)}px`);
	let y = Math.min(p, v), b = getComputedStyle(e).direction === "rtl", x;
	x = i === "center" ? d.left + d.width / 2 - f / 2 : i === "start" === b ? d.right - f : d.left, x = a(x, u.left + t, Math.max(u.left + t, u.right - t - f));
	let S = _ === "bottom" ? d.bottom + o : d.top - o - y, C = l(n);
	n.style.left = `${Math.round(x - C.x)}px`, n.style.top = `${Math.round(S - C.y)}px`, n.setAttribute("data-placement", _), n.setAttribute("data-align", i);
}
function d(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function f(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function p() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function m(e) {
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
function h(e, t) {
	if (!f(e, t)) return Promise.resolve();
	let { base: n, from: r, to: i } = d(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), p().then(() => (e.classList.remove(...r), e.classList.add(...i), m(e))).then(() => {
		e.classList.remove(...n, ...i);
	}));
}
function g(e) {
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return (Array.isArray(t) ? t : [t]).filter((e) => e != null && e !== "").map(String);
	} catch {
		return [e];
	}
}
function _(e) {
	if (e.hasAttribute("data-hui-combobox-initialized")) return;
	let t = e.querySelector("[data-hui-combobox-input]"), r = e.querySelector("[data-hui-combobox-options]");
	if (!t || !r) return;
	e.setAttribute("data-hui-combobox-initialized", "");
	let a = e.querySelector("[data-hui-combobox-button]"), s = e.querySelector("[data-hui-combobox-no-results]"), c = e.querySelector("[data-hui-combobox-chips]"), l = c?.querySelector("template[data-hui-combobox-chip-template]") ?? null, d = e.querySelector("[data-hui-combobox-reference]") ?? t, p = e.hasAttribute("data-hui-combobox-multiple"), m = e.hasAttribute("data-hui-combobox-searchable"), _ = e.hasAttribute("data-hui-combobox-nullable"), v = e.hasAttribute("data-hui-combobox-immediate"), y = e.hasAttribute("data-hui-combobox-filter"), b = e.getAttribute("data-hui-combobox-name"), x = /* @__PURE__ */ new Map(), S = g(e.getAttribute("data-hui-combobox-value")), C = [], w = !1, T = !1, E = null, D = "", O = "", k = null, A = null;
	function j() {
		return e.hasAttribute("data-hui-combobox-disabled");
	}
	function M() {
		return Array.from(r.querySelectorAll(n));
	}
	function N() {
		return M().filter((e) => !e.hasAttribute("data-disabled") && !e.hasAttribute("data-hui-combobox-filtered"));
	}
	function P(e) {
		return e.getAttribute("data-label") ?? (e.textContent || "").trim();
	}
	function F(e) {
		return e.getAttribute("data-value") ?? P(e);
	}
	function I(e) {
		return x.get(e) ?? e;
	}
	function L() {
		M().forEach((e) => {
			e.id ||= i("option"), e.setAttribute("role", "option"), x.set(F(e), P(e));
			let t = C.includes(F(e));
			e.setAttribute("aria-selected", t ? "true" : "false"), e.toggleAttribute("data-selected", t), e.hasAttribute("data-disabled") ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
		});
	}
	function R() {
		let e = m && y ? o(D.trim()) : "";
		M().forEach((t) => {
			let n = e === "" || o(P(t)).includes(e);
			t.toggleAttribute("data-hui-combobox-filtered", !n), t.hidden = !n;
		});
		let t = M().some((e) => !e.hasAttribute("data-hui-combobox-filtered"));
		r.toggleAttribute("data-empty", !t), s && (s.hidden = t), E && !N().includes(E) && z(null);
	}
	function z(e, n = !0) {
		M().forEach((t) => t.toggleAttribute("data-active", t === e)), E = e, e ? (t.setAttribute("aria-activedescendant", e.id), n && typeof e.scrollIntoView == "function" && e.scrollIntoView({ block: "nearest" })) : t.removeAttribute("aria-activedescendant");
	}
	function ee(e) {
		let t = N();
		if (t.length === 0) return;
		let n = E ? t.indexOf(E) : -1;
		z(t[n === -1 ? e > 0 ? 0 : t.length - 1 : (n + e + t.length) % t.length]);
	}
	function B(e) {
		let t = N();
		z(t.length ? t[e === "first" ? 0 : t.length - 1] : null);
	}
	function V(e) {
		let t = N().find((e) => C.includes(F(e)));
		t ? z(t) : e && B(e);
	}
	function te() {
		e.querySelectorAll("input[data-hui-combobox-hidden-input]").forEach((e) => e.remove()), b && (p ? C : [C[0] ?? ""]).forEach((t) => {
			let n = document.createElement("input");
			n.type = "hidden", n.name = b, n.value = t, n.disabled = j(), n.setAttribute("data-hui-combobox-hidden-input", ""), e.appendChild(n);
		});
	}
	function ne(e) {
		let t = I(e), n, r = l?.content.firstElementChild;
		if (r) n = r.cloneNode(!0);
		else {
			n = document.createElement("span");
			let e = document.createElement("span");
			e.setAttribute("data-hui-combobox-chip-label", "");
			let t = document.createElement("button");
			t.setAttribute("data-hui-combobox-chip-remove", ""), t.textContent = "×", n.append(e, t);
		}
		n.setAttribute("data-hui-combobox-chip", ""), n.setAttribute("data-value", e);
		let i = n.querySelector("[data-hui-combobox-chip-label]");
		i && (i.textContent = t);
		let a = n.querySelector("[data-hui-combobox-chip-remove]");
		return a && (a instanceof HTMLButtonElement && (a.type = "button", a.disabled = j()), a.hasAttribute("aria-label") || a.setAttribute("aria-label", `Remove ${t}`)), n;
	}
	function re() {
		c && (c.querySelectorAll("[data-hui-combobox-chip]").forEach((e) => e.remove()), C.forEach((e) => c.appendChild(ne(e))));
	}
	function H() {
		p ? t.value = D : t.value = C.length ? I(C[0]) : "";
	}
	function U(t, n = !0) {
		let r = Array.from(new Set(t.map(String)));
		C = p ? r : r.slice(0, 1), L(), te(), re(), e.toggleAttribute("data-has-value", C.length > 0), n && e.dispatchEvent(new CustomEvent("hui:combobox:change", {
			bubbles: !0,
			detail: {
				value: p ? [...C] : C[0] ?? null,
				label: p ? C.map(I) : C.length ? I(C[0]) : null
			}
		}));
	}
	function W(e) {
		if (e.hasAttribute("data-disabled") || j()) return;
		let n = F(e);
		if (x.set(n, P(e)), !p) {
			C[0] !== n && U([n]), D = "", H(), J();
			return;
		}
		U(C.includes(n) ? C.filter((e) => e !== n) : [...C, n]), D !== "" && (D = "", t.value = "", R(), G()), N().includes(e) && z(e, !1);
	}
	function ie(e) {
		j() || !C.includes(e) || U(C.filter((t) => t !== e));
	}
	function ae() {
		w && u(d, r);
	}
	function G() {
		!w || A !== null || (A = requestAnimationFrame(() => {
			A = null, ae();
		}));
	}
	let K = null;
	function oe() {
		document.addEventListener("pointerdown", ce, !0), window.addEventListener("scroll", G, !0), window.addEventListener("resize", G), window.visualViewport?.addEventListener("resize", G), window.visualViewport?.addEventListener("scroll", G), typeof ResizeObserver < "u" && (K = new ResizeObserver(G), K.observe(d), K.observe(r));
	}
	function se() {
		document.removeEventListener("pointerdown", ce, !0), window.removeEventListener("scroll", G, !0), window.removeEventListener("resize", G), window.visualViewport?.removeEventListener("resize", G), window.visualViewport?.removeEventListener("scroll", G), K?.disconnect(), K = null, A !== null && (cancelAnimationFrame(A), A = null);
	}
	function q() {
		w || T || j() || (w = !0, R(), r.hidden = !1, r.style.removeProperty("display"), ae(), t.setAttribute("aria-expanded", "true"), a?.setAttribute("aria-expanded", "true"), e.setAttribute("data-open", ""), V(null), oe(), h(r, "data-hui-combobox-enter"), e.dispatchEvent(new CustomEvent("hui:combobox:open", { bubbles: !0 })));
	}
	function J() {
		if (!w || T) return;
		let n = () => {
			w = !1, T = !1, r.hidden = !0, r.style.display = "none", t.setAttribute("aria-expanded", "false"), a?.setAttribute("aria-expanded", "false"), e.removeAttribute("data-open"), se(), z(null), !p && _ && m && t.value.trim() === "" && C.length && U([]), D = "", H(), R(), e.dispatchEvent(new CustomEvent("hui:combobox:close", { bubbles: !0 }));
		};
		f(r, "data-hui-combobox-leave") ? (T = !0, h(r, "data-hui-combobox-leave").then(n)) : n();
	}
	function Y() {
		w ? J() : q();
	}
	function ce(t) {
		e.contains(t.target) || J();
	}
	function le(e) {
		O += o(e), k && clearTimeout(k), k = setTimeout(() => {
			O = "";
		}, 350);
		let t = N().find((e) => o(P(e)).startsWith(O));
		t && z(t);
	}
	function ue(e) {
		if (!(e.isComposing || j())) switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), w ? ee(1) : (q(), !e.altKey && !E && B("first"));
				break;
			case "ArrowUp":
				e.preventDefault(), e.altKey ? J() : w ? ee(-1) : (q(), E || B("last"));
				break;
			case "Home":
			case "End":
				w && !m && (e.preventDefault(), B(e.key === "Home" ? "first" : "last"));
				break;
			case "PageUp":
			case "PageDown":
				w && (e.preventDefault(), B(e.key === "PageUp" ? "first" : "last"));
				break;
			case "Enter":
				w ? (e.preventDefault(), E ? W(E) : J()) : m || (e.preventDefault(), q());
				break;
			case " ":
				m || (e.preventDefault(), w && E ? W(E) : w || q());
				break;
			case "Escape":
				w ? (e.preventDefault(), e.stopPropagation(), J()) : m && p && t.value !== "" && (e.preventDefault(), D = "", t.value = "", R());
				break;
			case "Tab":
				w && J();
				break;
			case "Backspace":
				p && t.value === "" && C.length > 0 && ie(C[C.length - 1]);
				break;
			default:
				!m && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), w || q(), le(e.key));
				break;
		}
	}
	function de() {
		if (!m || j()) return;
		D = t.value, w || q(), R();
		let n = N();
		z(D.trim() !== "" && n.length ? n[0] : null), G(), e.dispatchEvent(new CustomEvent("hui:combobox:search", {
			bubbles: !0,
			detail: { query: D }
		}));
	}
	function fe() {
		let n = j();
		e.toggleAttribute("data-disabled", n), t.disabled = n, a && (a.disabled = n), e.querySelectorAll("input[data-hui-combobox-hidden-input]").forEach((e) => {
			e.disabled = n;
		}), c?.querySelectorAll("button[data-hui-combobox-chip-remove]").forEach((e) => {
			e.disabled = n;
		}), n && J();
	}
	t.id ||= i("input"), r.id ||= i("options"), t.setAttribute("role", "combobox"), t.setAttribute("aria-haspopup", "listbox"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", r.id), t.setAttribute("aria-autocomplete", m ? "list" : "none"), t.setAttribute("autocomplete", "off"), t.readOnly = !m, r.setAttribute("role", "listbox"), r.hidden = !0, r.style.display = "none", p && r.setAttribute("aria-multiselectable", "true"), a && (a.type = "button", a.tabIndex = -1, a.setAttribute("aria-haspopup", "listbox"), a.setAttribute("aria-expanded", "false"), a.setAttribute("aria-controls", r.id)), L(), U(S, !1), H(), R(), fe(), t.addEventListener("keydown", ue), t.addEventListener("input", de), t.addEventListener("click", () => {
		m ? q() : Y();
	}), t.addEventListener("focus", () => {
		v && q();
	}), a?.addEventListener("pointerdown", (e) => e.preventDefault()), a?.addEventListener("click", (e) => {
		e.preventDefault(), !j() && (Y(), t.focus({ preventScroll: !0 }));
	}), e.addEventListener("focusout", () => {
		setTimeout(() => {
			let t = document.activeElement;
			t && e.contains(t) || J();
		}, 0);
	}), r.addEventListener("pointerdown", (e) => e.preventDefault()), r.addEventListener("click", (e) => {
		let t = e.target.closest(n);
		t && r.contains(t) && W(t);
	}), r.addEventListener("pointermove", (e) => {
		let t = e.target.closest(n);
		t && t !== E && !t.hasAttribute("data-disabled") && z(t, !1);
	}), r.addEventListener("pointerleave", () => z(null)), c?.addEventListener("click", (e) => {
		let n = e.target.closest("[data-hui-combobox-chip-remove]")?.closest("[data-hui-combobox-chip]");
		n && (e.preventDefault(), ie(n.getAttribute("data-value") || ""), t.focus({ preventScroll: !0 }));
	}), e.closest("form")?.addEventListener("reset", () => {
		setTimeout(() => {
			D = "", U(S), H(), R();
		}, 0);
	});
	try {
		new MutationObserver(() => {
			L(), R(), w && (!E && D.trim() !== "" && B("first"), G());
		}).observe(r, {
			childList: !0,
			subtree: !0
		}), new MutationObserver(fe).observe(e, {
			attributes: !0,
			attributeFilter: ["data-hui-combobox-disabled"]
		});
	} catch {}
	e.hasAttribute("data-hui-combobox-open") && q(), e._hui = {
		open: q,
		close: J,
		toggle: Y,
		getValue: () => p ? [...C] : C[0] ?? null,
		setValue: (e) => {
			U(e === null ? [] : Array.isArray(e) ? e : [e]), H();
		}
	};
}
function v(e) {
	return document.getElementById(e)?._hui ?? null;
}
function y(e) {
	v(e)?.open();
}
function b(e) {
	v(e)?.close();
}
function x(e) {
	return v(e)?.getValue() ?? null;
}
function S(e, t) {
	v(e)?.setValue(t);
}
function C(e = document) {
	Array.from(e.querySelectorAll("[data-hui-combobox]")).forEach(_);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => C()) : C());
//#endregion
//#region resources/js/dialog/dialog.ts
var w = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function T(e) {
	return Array.from(e.querySelectorAll(w));
}
function E(e, t) {
	if (t.key !== "Tab") return;
	let n = T(e);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = n[0], i = n[n.length - 1];
	t.shiftKey ? document.activeElement === r && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus());
}
function D(e, t) {
	return {
		base: (e.getAttribute(`${t}`) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function O(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function k() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function A(e) {
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
function j(e, t) {
	let { base: n, from: r } = D(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function M(e, t) {
	let { base: n, from: r, to: i } = D(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : k().then(() => (e.classList.remove(...r), e.classList.add(...i), A(e))).then(() => {
		e.classList.remove(...n, ...i);
	});
}
function N(e, t) {
	let { base: n, from: r, to: i } = D(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), k().then(() => (e.classList.remove(...r), e.classList.add(...i), A(e))));
}
function P(e, t) {
	let { base: n, to: r } = D(e, t);
	e.classList.remove(...n, ...r);
}
function F(e) {
	let t = [];
	return (O(e, "data-hui-dialog-enter") || O(e, "data-hui-dialog-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-dialog-enter], [data-hui-dialog-leave]"))), t;
}
function I(e) {
	if (e.hasAttribute("data-hui-dialog-initialized")) return;
	e.setAttribute("data-hui-dialog-initialized", "");
	let t = null, n = !1, r = e.hasAttribute("data-hui-dialog-no-escape"), i = e.hasAttribute("data-hui-dialog-no-backdrop-close"), a = e.hasAttribute("data-hui-dialog-scroll-lock");
	function o() {
		if (e.open || n) return;
		t = document.activeElement;
		let r = F(e).filter((e) => O(e, "data-hui-dialog-enter"));
		r.forEach((e) => j(e, "data-hui-dialog-enter")), e.showModal(), e.setAttribute("data-hui-dialog-open", ""), a && (document.body.style.overflow = "hidden");
		let i = T(e);
		i.length > 0 && i[0].focus(), r.length > 0 && Promise.all(r.map((e) => M(e, "data-hui-dialog-enter"))), e.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
	}
	function s() {
		if (!e.open || n) return;
		let r = F(e).filter((e) => O(e, "data-hui-dialog-leave"));
		function i() {
			e.close(), e.removeAttribute("data-hui-dialog-open"), a && (document.querySelector("dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, n = !1, e.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
		}
		if (r.length > 0) {
			n = !0;
			let e = r.map((e) => N(e, "data-hui-dialog-leave"));
			Promise.all(e).then(() => {
				i(), r.forEach((e) => P(e, "data-hui-dialog-leave"));
			});
		} else i();
	}
	e.addEventListener("keydown", (t) => {
		E(e, t);
	}), e.addEventListener("cancel", (e) => {
		e.preventDefault(), r || s();
	}), e.addEventListener("click", (t) => {
		if (i) return;
		let n = t.target;
		(n === e || n.hasAttribute("data-hui-dialog-background")) && s();
	}), e.addEventListener("click", (e) => {
		e.target.closest("[data-hui-dialog-close]") && s();
	});
	let c = e.querySelector("[data-hui-dialog-title]"), l = e.querySelector("[data-hui-dialog-description]");
	c && (c.id ||= `hui-dialog-title-${R()}`, e.setAttribute("aria-labelledby", c.id)), l && (l.id ||= `hui-dialog-desc-${R()}`, e.setAttribute("aria-describedby", l.id)), e._hui = {
		open: o,
		close: s
	}, e.hasAttribute("data-hui-dialog-open") && (e.removeAttribute("data-hui-dialog-open"), o());
}
var L = 0;
function R() {
	return `hui-${++L}-${Date.now()}`;
}
function z(e) {
	Array.from(e.querySelectorAll("[data-hui-dialog-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-dialog-trigger-bound") || (e.setAttribute("data-hui-dialog-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-dialog-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			!n || !n._hui || n._hui.open();
		}));
	});
}
function ee(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dialog]")).forEach(I), z(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ee()) : ee());
//#endregion
//#region resources/js/disclosure/disclosure.ts
function B(e = document) {
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => B()) : B());
//#endregion
//#region resources/js/dropdown/dropdown.ts
var V = "[data-hui-dropdown-item]:not([data-disabled])";
function te(e, t) {
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
function ne(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function re(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function H() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function U(e) {
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
function W(e) {
	if (!re(e, "data-hui-dropdown-enter")) return Promise.resolve();
	let { base: t, from: n, to: r } = ne(e, "data-hui-dropdown-enter");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), H().then(() => (e.classList.remove(...n), e.classList.add(...r), U(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function ie(e) {
	if (!re(e, "data-hui-dropdown-leave")) return Promise.resolve();
	let { base: t, from: n, to: r } = ne(e, "data-hui-dropdown-leave");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), H().then(() => (e.classList.remove(...n), e.classList.add(...r), U(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function ae(e) {
	if (e.hasAttribute("data-hui-dropdown-initialized")) return;
	e.setAttribute("data-hui-dropdown-initialized", "");
	let t = e.querySelector("[data-hui-dropdown-trigger]"), n = e.querySelector("[data-hui-dropdown-items]");
	if (!t || !n) return;
	let r = !1, i = !1, a = -1, o = "", s = null;
	function c() {
		return Array.from(n.querySelectorAll(V));
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
		r || i || (r = !0, te(t, n), n.style.display = "block", n.removeAttribute("hidden"), t.setAttribute("aria-expanded", "true"), e.setAttribute("data-open", ""), a && c().length > 0 && l(0), W(n), requestAnimationFrame(() => {
			document.addEventListener("pointerdown", m, !0);
		}), e.dispatchEvent(new CustomEvent("hui:dropdown:open", { bubbles: !0 })));
	}
	function f(a = !0) {
		if (!r || i) return;
		function o() {
			r = !1, i = !1, n.style.display = "none", n.setAttribute("hidden", ""), t.setAttribute("aria-expanded", "false"), e.removeAttribute("data-open"), u(), document.removeEventListener("pointerdown", m, !0), a && t.focus(), e.dispatchEvent(new CustomEvent("hui:dropdown:close", { bubbles: !0 }));
		}
		re(n, "data-hui-dropdown-leave") ? (i = !0, ie(n).then(o)) : o();
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
	_ || (_ = `hui-dropdown-items-${++G}-${Date.now()}`, n.id = _), t.setAttribute("aria-haspopup", "true"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", _), n.setAttribute("role", "menu"), n.style.display = "none", n.setAttribute("hidden", ""), c().forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.setAttribute("tabindex", "-1");
	}), Array.from(n.querySelectorAll("[data-hui-dropdown-item]")).forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.hasAttribute("data-disabled") && e.setAttribute("aria-disabled", "true");
	}), t.addEventListener("click", (e) => {
		e.preventDefault(), p();
	}), t.addEventListener("keydown", g), n.addEventListener("keydown", g), n.addEventListener("click", (e) => {
		let t = e.target.closest(V);
		t && (t.dispatchEvent(new CustomEvent("hui:dropdown:select", {
			bubbles: !0,
			detail: { value: t.getAttribute("data-value") || t.textContent?.trim() }
		})), f());
	}), n.addEventListener("pointerenter", (e) => {
		let t = e.target.closest(V);
		if (t) {
			let e = c().indexOf(t);
			e !== -1 && l(e);
		}
	}, !0), n.addEventListener("pointerleave", (e) => {
		e.target.closest(V) && u();
	}, !0), e._hui = {
		open: d,
		close: f,
		toggle: p
	};
}
var G = 0;
function K(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dropdown]")).forEach(ae);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => K()) : K());
//#endregion
//#region resources/js/flyout/flyout.ts
var oe = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function se(e) {
	return Array.from(e.querySelectorAll(oe));
}
function q(e, t) {
	if (t.key !== "Tab") return;
	let n = se(e);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = n[0], i = n[n.length - 1];
	t.shiftKey ? document.activeElement === r && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus());
}
function J(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function Y(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function ce() {
	return new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(() => e())));
}
function le(e) {
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
function ue(e, t) {
	let { base: n, from: r } = J(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function de(e, t) {
	let { base: n, from: r, to: i } = J(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : ce().then(() => (e.classList.remove(...r), e.classList.add(...i), le(e))).then(() => {
		e.classList.remove(...n, ...i);
	});
}
function fe(e, t) {
	let { base: n, from: r, to: i } = J(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), ce().then(() => (e.classList.remove(...r), e.classList.add(...i), le(e))));
}
function pe(e, t) {
	let { base: n, to: r } = J(e, t);
	e.classList.remove(...n, ...r);
}
function me(e) {
	let t = [];
	return (Y(e, "data-hui-flyout-enter") || Y(e, "data-hui-flyout-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-flyout-enter], [data-hui-flyout-leave]"))), t;
}
function he(e) {
	let t = e.getAttribute("data-hui-flyout-inline");
	if (!t) return null;
	let n = parseInt(t, 10);
	return Number.isFinite(n) && n > 0 ? n : null;
}
function X(e) {
	let t = he(e);
	return t === null ? !1 : window.innerWidth >= t;
}
var ge = {
	left: "x",
	right: "x",
	top: "y",
	bottom: "y"
}, _e = {
	left: -1,
	right: 1,
	top: -1,
	bottom: 1
};
function ve(e) {
	let t = e.getAttribute("data-hui-flyout-position");
	return t === "left" || t === "top" || t === "bottom" ? t : "right";
}
function ye(e) {
	let t = e.getAttribute("data-hui-flyout-swipe");
	return t === "open" || t === "close" || t === "both" ? t : null;
}
function be(e, t) {
	return t === "left" || t === "right" ? !0 : t === "bottom" ? e.scrollTop <= 0 : e.scrollTop + e.clientHeight >= e.scrollHeight - 1;
}
function xe(e, t, n) {
	switch (e) {
		case "left": return {
			inward: t,
			cross: n
		};
		case "right": return {
			inward: -t,
			cross: n
		};
		case "top": return {
			inward: n,
			cross: t
		};
		case "bottom": return {
			inward: -n,
			cross: t
		};
	}
}
function Se(e, t, n, r) {
	switch (n) {
		case "left": return e <= r;
		case "right": return e >= window.innerWidth - r;
		case "top": return t <= r;
		case "bottom": return t >= window.innerHeight - r;
	}
}
function Ce(e) {
	if (e.hasAttribute("data-hui-flyout-initialized")) return;
	e.setAttribute("data-hui-flyout-initialized", "");
	let t = null, n = !1, r = e.hasAttribute("data-hui-flyout-no-escape"), i = e.hasAttribute("data-hui-flyout-no-backdrop-close"), a = e.hasAttribute("data-hui-flyout-scroll-lock");
	function o() {
		X(e) && (e.open && e.close(), e.removeAttribute("data-hui-flyout-open"));
	}
	function s() {
		if (X(e) || e.open || n) return;
		t = document.activeElement;
		let r = me(e).filter((e) => Y(e, "data-hui-flyout-enter"));
		r.forEach((e) => ue(e, "data-hui-flyout-enter")), e.showModal(), e.setAttribute("data-hui-flyout-open", ""), a && (document.body.style.overflow = "hidden");
		let i = se(e);
		i.length > 0 && i[0].focus(), r.length > 0 && Promise.all(r.map((e) => de(e, "data-hui-flyout-enter"))), e.dispatchEvent(new CustomEvent("hui:flyout:open", { bubbles: !0 }));
	}
	function c(r = {}) {
		if (X(e) || !e.open || n) return;
		let i = me(e), o = r.immediate ? [] : i.filter((e) => Y(e, "data-hui-flyout-leave"));
		function s() {
			e.close(), e.removeAttribute("data-hui-flyout-open"), a && (document.querySelector("dialog[data-hui-flyout][data-hui-flyout-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, n = !1, e.dispatchEvent(new CustomEvent("hui:flyout:close", { bubbles: !0 }));
		}
		if (o.length > 0) {
			n = !0;
			let e = o.map((e) => fe(e, "data-hui-flyout-leave"));
			Promise.all(e).then(() => {
				s(), o.forEach((e) => pe(e, "data-hui-flyout-leave"));
			});
		} else s();
	}
	e.addEventListener("keydown", (t) => {
		q(e, t);
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
	l && (l.id ||= `hui-flyout-title-${Te()}`, e.setAttribute("aria-labelledby", l.id)), u && (u.id ||= `hui-flyout-desc-${Te()}`, e.setAttribute("aria-describedby", u.id));
	let d = he(e);
	d !== null && (window.matchMedia(`(min-width: ${d}px)`).addEventListener("change", o), o());
	function f(t) {
		let r = ge[t], i = _e[t];
		Array.from(e.querySelectorAll("[data-hui-flyout-panel]")).forEach((a) => {
			let o = 0, s = 0, l = 0, u = 0, d = 0, f = 0, p = !1, m = !1;
			function h() {
				p = !1, m = !1, u = 0, d = 0;
			}
			function g(e, t) {
				a.style.transition = "transform 0.2s cubic-bezier(0.3, 0, 0.2, 1)", a.style.transform = e, le(a).then(() => {
					t && t(), a.style.transition = "", a.style.transform = "";
				});
			}
			a.addEventListener("touchstart", (t) => {
				if (t.touches.length !== 1 || !e.open || X(e) || n) return;
				let i = t.touches[0];
				o = i.clientX, s = i.clientY, l = t.timeStamp, f = r === "x" ? a.getBoundingClientRect().width : a.getBoundingClientRect().height, h();
			}, { passive: !0 }), a.addEventListener("touchmove", (n) => {
				if (n.touches.length !== 1 || !e.open || X(e)) return;
				let c = n.touches[0], f = r === "x" ? c.clientX - o : c.clientY - s, h = r === "x" ? c.clientY - s : c.clientX - o, g = f * i;
				if (!p) {
					if (Math.abs(f) < 8 && Math.abs(h) < 8) return;
					p = !0, m = Math.abs(f) > Math.abs(h) && g > 0 && be(a, t), m && (a.style.transition = "none");
				}
				if (!m) return;
				n.preventDefault();
				let _ = Math.max(0, g), v = n.timeStamp - l;
				v > 0 && (d = (_ - u) / v), u = _, l = n.timeStamp, a.style.transform = r === "x" ? `translateX(${i * _}px)` : `translateY(${i * _}px)`;
			}, { passive: !1 });
			function _() {
				if (!m) {
					h();
					return;
				}
				let e = f > 0 && u > f * .4 || d > .5;
				h(), n = !0, e ? g(r === "x" ? `translateX(${i * 100}%)` : `translateY(${i * 100}%)`, () => {
					n = !1, c({ immediate: !0 });
				}) : g(r === "x" ? "translateX(0)" : "translateY(0)", () => {
					n = !1;
				});
			}
			a.addEventListener("touchend", _, { passive: !0 }), a.addEventListener("touchcancel", _, { passive: !0 });
		});
	}
	function p(t) {
		let r = !1, i = 0, a = 0;
		document.addEventListener("touchstart", (o) => {
			if (!e.isConnected || o.touches.length !== 1 || e.open || X(e) || n) return;
			let s = o.touches[0];
			Se(s.clientX, s.clientY, t, 24) && (r = !0, i = s.clientX, a = s.clientY);
		}, { passive: !0 }), document.addEventListener("touchmove", (e) => {
			if (!r || e.touches.length !== 1) return;
			let n = e.touches[0], { inward: o, cross: c } = xe(t, n.clientX - i, n.clientY - a);
			o > 48 && o > Math.abs(c) && (r = !1, s());
		}, { passive: !0 });
		let o = () => {
			r = !1;
		};
		document.addEventListener("touchend", o, { passive: !0 }), document.addEventListener("touchcancel", o, { passive: !0 });
	}
	let m = ye(e);
	if (m) {
		let t = ve(e);
		(m === "close" || m === "both") && f(t), (m === "open" || m === "both") && p(t);
	}
	e._hui = {
		open: s,
		close: c
	}, e.hasAttribute("data-hui-flyout-open") && (e.removeAttribute("data-hui-flyout-open"), s());
}
var we = 0;
function Te() {
	return `hui-${++we}-${Date.now()}`;
}
function Ee(e) {
	Array.from(e.querySelectorAll("[data-hui-flyout-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-flyout-trigger-bound") || (e.setAttribute("data-hui-flyout-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-flyout-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			!n || !n._hui || n._hui.open();
		}));
	});
}
function De(e = document) {
	Array.from(e.querySelectorAll("[data-hui-flyout]")).forEach(Ce), Ee(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => De()) : De());
//#endregion
//#region resources/js/range-slider/range-slider.ts
function Z(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function Oe(e, t, n) {
	return n === t ? 0 : (e - t) / (n - t) * 100;
}
function ke(e = document) {
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
			if (t = Z(t, p, m), o = Z(o, p, m), a && (e === "min" && t > o && (t = o), e === "max" && o < t && (o = t)), r && Number(r.value) !== t && (r.value = String(t)), a && Number(i.value) !== o && (i.value = String(o)), l.forEach((e) => {
				Number(e.value) !== t && (e.value = String(t));
			}), u.forEach((e) => {
				a && Number(e.value) !== o && (e.value = String(o));
			}), d.forEach((e) => {
				e.textContent !== String(t) && (e.textContent = String(t));
			}), f.forEach((e) => {
				let t = String(o);
				e.textContent !== t && (e.textContent = t);
			}), n) if (a) {
				let e = Oe(t, p, m), r = Oe(o, p, m);
				n.style.left = `${e}%`, n.style.width = `${Math.max(0, r - e)}%`;
			} else {
				let e = Oe(t, p, m);
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
				let t = Z(v(e), p, a ? Number(i.value) : m);
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
				let t = Z(v(e), r ? Number(r.value) : p, m);
				String(t) === i.value ? _("max") : (i.value = String(t), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
			};
			u.forEach((t) => {
				t.addEventListener("input", e), t.addEventListener("change", e);
			});
		}
		function y(e) {
			if ((!r || r.disabled) && (!i || i.disabled)) return;
			let n = t.getBoundingClientRect(), o = p + Z((e - n.left) / n.width, 0, 1) * (m - p), s = Math.round((o - p) / (h || 1)) * (h || 1) + p, c = Number(r?.value ?? p), l = a ? Number(i.value) : m, u = Math.abs(s - c), d = a ? Math.abs(s - l) : Infinity, f = "min";
			if (a && !i.disabled && (f = r && !r.disabled ? d === u ? s > (c + l) / 2 ? "max" : "min" : d < u ? "max" : "min" : "max"), f === "min" && r) {
				let e = Z(s, p, a ? Number(i.value) : m);
				String(e) === r.value ? _("min") : (r.value = String(e), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
			} else if (f === "max" && i) {
				let e = Z(s, r ? Number(r.value) : p, m);
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ke()) : ke());
//#endregion
//#region resources/js/tabs/tabs.ts
function Q(e, t) {
	return e.hasAttribute(t);
}
function Ae(e) {
	for (let t = 0; t < e.length; t++) if (!Q(e[t], "data-disabled")) return t;
	return 0;
}
function je(e = document) {
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
				if (Q(t, "data-active") || Q(i, "data-active")) return e;
			}
			return Ae(n);
		}
		function c(e, t) {
			let r = e;
			for (let e = 0; e < o; e++) if (r = (r + t + o) % o, !Q(n[r], "data-disabled")) return r;
			return e;
		}
		let l = Math.max(0, Math.min(s(), o - 1));
		Q(n[l], "data-disabled") && (l = Ae(n));
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
				f(i, "aria-selected", t ? "true" : "false"), i.tabIndex = t && !Q(i, "data-disabled") ? 0 : -1, d(i, "data-active", t), d(a, "data-active", t), d(a, "hidden", !t);
			}
			e && n[l].focus(), u = !1;
		}
		function m(e, t = !1) {
			if (!(e < 0 || e >= o) && !Q(n[e], "data-disabled")) {
				if (e === l) {
					t && n[l].focus();
					return;
				}
				l = e, p(t);
			}
		}
		n.forEach((e, t) => {
			e.addEventListener("click", (n) => {
				if (Q(e, "data-disabled")) {
					n.preventDefault();
					return;
				}
				m(t, !0);
			});
		}), t.addEventListener("keydown", (e) => {
			let t = e.key, r = !1;
			i ? (t === "ArrowUp" && (m(c(l, -1), !0), r = !0), t === "ArrowDown" && (m(c(l, 1), !0), r = !0)) : (t === "ArrowLeft" && (m(c(l, -1), !0), r = !0), t === "ArrowRight" && (m(c(l, 1), !0), r = !0)), t === "Home" && (m(Ae(n), !0), r = !0), t === "End" && (m((() => {
				for (let e = o - 1; e >= 0; e--) if (!Q(n[e], "data-disabled")) return e;
				return l;
			})(), !0), r = !0), (t === "Enter" || t === " ") && (m(l, !0), r = !0), r && (e.preventDefault(), e.stopPropagation());
		});
		try {
			let e = new MutationObserver((e) => {
				if (u) return;
				let t = !1;
				for (let n of e) n.type === "attributes" && (n.attributeName === "data-disabled" || n.attributeName === "data-active") && (t = !0);
				if (t) {
					if (Q(n[l], "data-disabled")) l = Ae(n);
					else for (let e = 0; e < o; e++) if (e !== l && Q(n[e], "data-active")) {
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => je()) : je());
//#endregion
//#region resources/js/toggle/toggle.ts
function Me(e = document) {
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Me()) : Me());
//#endregion
//#region resources/js/tooltip/tooltip.ts
function $(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function Ne(e = document) {
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
			if (x === "top" ? (C = i.top - o - 8, S = i.left + i.width / 2 - a / 2, C = $(C, 8, Math.max(8, r - 8 - o)), S = $(S, 8, Math.max(8, n - 8 - a))) : x === "bottom" ? (C = i.bottom + 8, S = i.left + i.width / 2 - a / 2, C = $(C, 8, Math.max(8, r - 8 - o)), S = $(S, 8, Math.max(8, n - 8 - a))) : x === "left" ? (S = i.left - a - 8, C = i.top + i.height / 2 - o / 2, S = $(S, 8, Math.max(8, n - 8 - a)), C = $(C, 8, Math.max(8, r - 8 - o))) : (S = i.right + 8, C = i.top + i.height / 2 - o / 2, S = $(S, 8, Math.max(8, n - 8 - a)), C = $(C, 8, Math.max(8, r - 8 - o))), t.style.left = `${Math.round(S)}px`, t.style.top = `${Math.round(C)}px`, t.setAttribute("data-placement", x), x === "top" || x === "bottom") {
				let e = $(i.left + i.width / 2 - S, 6, Math.max(6, a - 6));
				t.style.setProperty("--hui-tooltip-arrow-x", `${Math.round(e)}px`), t.style.removeProperty("--hui-tooltip-arrow-y");
			} else {
				let e = $(i.top + i.height / 2 - C, 6, Math.max(6, o - 6));
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Ne()) : Ne());
//#endregion
//#region resources/js/hui.ts
function Pe(...e) {
	return e.filter(Boolean).join(" ");
}
//#endregion
export { b as closeCombobox, Pe as cn, x as getComboboxValue, y as openCombobox, C as registerComboboxes, S as setComboboxValue };
