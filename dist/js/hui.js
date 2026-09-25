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
var t = 8, n = "[data-hui-combobox-option]", r = `${n}, [data-hui-combobox-custom-option]`, i = 0;
function a(e) {
	return `hui-combobox-${e}-${++i}`;
}
function o(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function s(e) {
	return e.toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function c(e) {
	let [t, n] = (e || "bottom start").trim().toLowerCase().split(/\s+/);
	return {
		side: t === "top" ? "top" : "bottom",
		align: n === "start" || n === "end" ? n : "center"
	};
}
function l() {
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
function u(e) {
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
function d(e, n) {
	let { side: r, align: i } = c(n.getAttribute("data-hui-combobox-anchor")), a = parseFloat(n.getAttribute("data-hui-combobox-gap") || "4") || 0, s = l(), d = e.getBoundingClientRect();
	n.style.setProperty("--hui-combobox-anchor-width", `${d.width}px`), n.style.maxWidth = `${Math.max(0, s.right - s.left - 16)}px`, n.style.maxHeight = "";
	let { width: f, height: p } = n.getBoundingClientRect(), m = s.bottom - d.bottom - a - t, h = d.top - s.top - a - t, g = r === "bottom" ? m : h, _ = g < p && (r === "bottom" ? h : m) > g ? r === "bottom" ? "top" : "bottom" : r, v = Math.max(0, _ === "bottom" ? m : h);
	p > v && (n.style.maxHeight = `${Math.floor(v)}px`);
	let y = Math.min(p, v), b = getComputedStyle(e).direction === "rtl", x;
	x = i === "center" ? d.left + d.width / 2 - f / 2 : i === "start" === b ? d.right - f : d.left, x = o(x, s.left + t, Math.max(s.left + t, s.right - t - f));
	let S = _ === "bottom" ? d.bottom + a : d.top - a - y, C = u(n);
	n.style.left = `${Math.round(x - C.x)}px`, n.style.top = `${Math.round(S - C.y)}px`, n.setAttribute("data-placement", _), n.setAttribute("data-align", i);
}
function f(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function p(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function m() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function h(e) {
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
function g(e, t) {
	if (!p(e, t)) return Promise.resolve();
	let { base: n, from: r, to: i } = f(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), m().then(() => (e.classList.remove(...r), e.classList.add(...i), h(e))).then(() => {
		e.classList.remove(...n, ...i);
	}));
}
function _(e) {
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return (Array.isArray(t) ? t : [t]).filter((e) => e != null && e !== "").map(String);
	} catch {
		return [e];
	}
}
function v(e) {
	if (e.hasAttribute("data-hui-combobox-initialized")) return;
	let t = e.querySelector("[data-hui-combobox-input]"), i = e.querySelector("[data-hui-combobox-options]");
	if (!t || !i) return;
	e.setAttribute("data-hui-combobox-initialized", "");
	let o = e.querySelector("[data-hui-combobox-button]"), c = e.querySelector("[data-hui-combobox-clear]"), l = e.querySelector("[data-hui-combobox-no-results]"), u = e.querySelector("[data-hui-combobox-chips]"), f = u?.querySelector("template[data-hui-combobox-chip-template]") ?? null, m = e.querySelector("[data-hui-combobox-reference]") ?? t, h = e.hasAttribute("data-hui-combobox-multiple"), v = e.hasAttribute("data-hui-combobox-searchable"), y = e.hasAttribute("data-hui-combobox-nullable"), b = e.hasAttribute("data-hui-combobox-immediate"), x = e.hasAttribute("data-hui-combobox-filter"), S = e.getAttribute("data-hui-combobox-name"), C = h && parseInt(e.getAttribute("data-hui-combobox-max") || "", 10) || null, ee = v && e.hasAttribute("data-hui-combobox-allow-custom-options"), w = null, T = /* @__PURE__ */ new Map(), te = _(e.getAttribute("data-hui-combobox-value")), E = [], D = !1, O = !1, k = null, A = "", ne = "", re = null, j = null;
	function M() {
		return e.hasAttribute("data-hui-combobox-disabled");
	}
	function N() {
		return C !== null && E.length >= C;
	}
	function P() {
		return Array.from(i.querySelectorAll(n));
	}
	function F() {
		let e = P().filter((e) => !e.hasAttribute("data-disabled") && !e.hasAttribute("data-hui-combobox-filtered"));
		return ae() && !N() && e.push(w), e;
	}
	function ie() {
		if (!ee) return null;
		if (w && i.contains(w)) return w;
		let e = i.querySelector("template[data-hui-combobox-custom-option-template]")?.content.firstElementChild, t;
		if (e) t = e.cloneNode(!0);
		else {
			t = document.createElement("div");
			let e = document.createElement("span");
			e.setAttribute("data-hui-combobox-custom-query", ""), t.append("Create \"", e, "\"");
		}
		return t.setAttribute("data-hui-combobox-custom-option", ""), t.setAttribute("role", "option"), t.setAttribute("aria-selected", "false"), t.id = t.id || a("custom-option"), t.hidden = !0, i.appendChild(t), w = t, t;
	}
	function ae() {
		return w !== null && !w.hidden && i.contains(w);
	}
	function oe() {
		return A.trim();
	}
	function se() {
		let e = ie();
		if (!e) return;
		let t = oe(), n = s(t), r = P().some((e) => s(I(e)) === n || L(e) === t) || E.some((e) => e === t || s(R(e)) === n);
		e.hidden = t === "" || r, !e.hidden && (e.setAttribute("data-value", t), e.querySelectorAll("[data-hui-combobox-custom-query]").forEach((e) => {
			e.textContent !== t && (e.textContent = t);
		}), N() ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled"));
	}
	function ce() {
		let n = oe();
		n === "" || M() || N() || (T.set(n, n), e.dispatchEvent(new CustomEvent("hui:combobox:create", {
			bubbles: !0,
			detail: { value: n }
		})), A = "", h ? (G([...E, n]), t.value = "", B(), V(null), K()) : (G([n]), U(), X()));
	}
	function I(e) {
		return e.getAttribute("data-label") ?? (e.textContent || "").trim();
	}
	function L(e) {
		return e.getAttribute("data-value") ?? I(e);
	}
	function R(e) {
		return T.get(e) ?? e;
	}
	function z() {
		P().forEach((e) => {
			e.id ||= a("option"), e.setAttribute("role", "option"), T.set(L(e), I(e));
			let t = E.includes(L(e));
			e.setAttribute("aria-selected", t ? "true" : "false"), e.toggleAttribute("data-selected", t), e.hasAttribute("data-disabled") || !t && N() ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
		}), le().forEach((e) => {
			let t = e.querySelector(":scope > [data-hui-combobox-group-label]");
			t && (t.id ||= a("group-label"), e.setAttribute("aria-labelledby", t.id));
		});
	}
	function le() {
		return Array.from(i.querySelectorAll("[data-hui-combobox-group]"));
	}
	function B() {
		let e = v && x ? s(A.trim()) : "";
		P().forEach((t) => {
			let n = e === "" || s(I(t)).includes(e);
			t.toggleAttribute("data-hui-combobox-filtered", !n), t.hidden = !n;
		}), le().forEach((e) => {
			let t = Array.from(e.querySelectorAll(n));
			e.hidden = t.length > 0 && t.every((e) => e.hasAttribute("data-hui-combobox-filtered"));
		}), se();
		let t = P().some((e) => !e.hasAttribute("data-hui-combobox-filtered")) || ae();
		i.toggleAttribute("data-empty", !t), l && (l.hidden = t), k && !F().includes(k) && V(null);
	}
	function V(e, n = !0) {
		P().forEach((t) => t.toggleAttribute("data-active", t === e)), w?.toggleAttribute("data-active", w === e), k = e, e ? (t.setAttribute("aria-activedescendant", e.id), n && typeof e.scrollIntoView == "function" && e.scrollIntoView({ block: "nearest" })) : t.removeAttribute("aria-activedescendant");
	}
	function ue(e) {
		let t = F();
		if (t.length === 0) return;
		let n = k ? t.indexOf(k) : -1;
		V(t[n === -1 ? e > 0 ? 0 : t.length - 1 : (n + e + t.length) % t.length]);
	}
	function H(e) {
		let t = F();
		V(t.length ? t[e === "first" ? 0 : t.length - 1] : null);
	}
	function de(e) {
		let t = F().find((e) => E.includes(L(e)));
		t ? V(t) : e && H(e);
	}
	function fe() {
		e.querySelectorAll("input[data-hui-combobox-hidden-input]").forEach((e) => e.remove()), S && (h ? E : [E[0] ?? ""]).forEach((t) => {
			let n = document.createElement("input");
			n.type = "hidden", n.name = S, n.value = t, n.disabled = M(), n.setAttribute("data-hui-combobox-hidden-input", ""), e.appendChild(n);
		});
	}
	function pe(e) {
		let t = R(e), n, r = f?.content.firstElementChild;
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
		return a && (a instanceof HTMLButtonElement && (a.type = "button", a.disabled = M()), a.hasAttribute("aria-label") || a.setAttribute("aria-label", `Remove ${t}`)), n;
	}
	function me() {
		u && (u.querySelectorAll("[data-hui-combobox-chip]").forEach((e) => e.remove()), E.forEach((e) => u.appendChild(pe(e))));
	}
	function U() {
		h ? t.value = A : t.value = E.length ? R(E[0]) : "", W();
	}
	function W() {
		c && (c.hidden = E.length === 0 && t.value === "");
	}
	function he() {
		M() || (A = "", t.value = "", E.length && G([]), B(), W(), K(), t.focus({ preventScroll: !0 }));
	}
	function G(t, n = !0) {
		let r = Array.from(new Set(t.map(String)));
		E = r.slice(0, h ? C ?? r.length : 1), z(), fe(), me(), e.toggleAttribute("data-has-value", E.length > 0), e.toggleAttribute("data-max-reached", N()), W(), n && e.dispatchEvent(new CustomEvent("hui:combobox:change", {
			bubbles: !0,
			detail: {
				value: h ? [...E] : E[0] ?? null,
				label: h ? E.map(R) : E.length ? R(E[0]) : null
			}
		}));
	}
	function ge(e) {
		if (e === w) {
			ce();
			return;
		}
		if (e.hasAttribute("data-disabled") || M()) return;
		let n = L(e);
		if (T.set(n, I(e)), !h) {
			E[0] !== n && G([n]), A = "", U(), X();
			return;
		}
		if (E.includes(n)) G(E.filter((e) => e !== n));
		else if (!N()) G([...E, n]);
		else return;
		A !== "" && (A = "", t.value = "", B(), K()), F().includes(e) && V(e, !1);
	}
	function _e(e) {
		!M() && E.includes(e) && G(E.filter((t) => t !== e));
	}
	function ve() {
		D && d(m, i);
	}
	function K() {
		D && j === null && (j = requestAnimationFrame(() => {
			j = null, ve();
		}));
	}
	let q = null;
	function J() {
		document.addEventListener("pointerdown", xe, !0), window.addEventListener("scroll", K, !0), window.addEventListener("resize", K), window.visualViewport?.addEventListener("resize", K), window.visualViewport?.addEventListener("scroll", K), typeof ResizeObserver < "u" && (q = new ResizeObserver(K), q.observe(m), q.observe(i));
	}
	function ye() {
		document.removeEventListener("pointerdown", xe, !0), window.removeEventListener("scroll", K, !0), window.removeEventListener("resize", K), window.visualViewport?.removeEventListener("resize", K), window.visualViewport?.removeEventListener("scroll", K), q?.disconnect(), q = null, j !== null && (cancelAnimationFrame(j), j = null);
	}
	function Y() {
		D || O || M() || (D = !0, B(), i.hidden = !1, i.style.removeProperty("display"), ve(), t.setAttribute("aria-expanded", "true"), o?.setAttribute("aria-expanded", "true"), e.setAttribute("data-open", ""), de(null), J(), g(i, "data-hui-combobox-enter"), e.dispatchEvent(new CustomEvent("hui:combobox:open", { bubbles: !0 })));
	}
	function X() {
		if (!D || O) return;
		let n = () => {
			D = !1, O = !1, i.hidden = !0, i.style.display = "none", t.setAttribute("aria-expanded", "false"), o?.setAttribute("aria-expanded", "false"), e.removeAttribute("data-open"), ye(), V(null), !h && y && v && t.value.trim() === "" && E.length && G([]), A = "", U(), B(), e.dispatchEvent(new CustomEvent("hui:combobox:close", { bubbles: !0 }));
		};
		p(i, "data-hui-combobox-leave") ? (O = !0, g(i, "data-hui-combobox-leave").then(n)) : n();
	}
	function be() {
		D ? X() : Y();
	}
	function xe(t) {
		e.contains(t.target) || X();
	}
	function Se(e) {
		ne += s(e), re && clearTimeout(re), re = setTimeout(() => {
			ne = "";
		}, 350);
		let t = F().find((e) => s(I(e)).startsWith(ne));
		t && V(t);
	}
	function Ce(e) {
		if (!(e.isComposing || M())) switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), D ? ue(1) : (Y(), !e.altKey && !k && H("first"));
				break;
			case "ArrowUp":
				e.preventDefault(), e.altKey ? X() : D ? ue(-1) : (Y(), k || H("last"));
				break;
			case "Home":
			case "End":
				D && !v && (e.preventDefault(), H(e.key === "Home" ? "first" : "last"));
				break;
			case "PageUp":
			case "PageDown":
				D && (e.preventDefault(), H(e.key === "PageUp" ? "first" : "last"));
				break;
			case "Enter":
				D ? (e.preventDefault(), k ? ge(k) : X()) : v || (e.preventDefault(), Y());
				break;
			case " ":
				v || (e.preventDefault(), D && k ? ge(k) : D || Y());
				break;
			case "Escape":
				D ? (e.preventDefault(), e.stopPropagation(), X()) : v && h && t.value !== "" && (e.preventDefault(), A = "", t.value = "", B());
				break;
			case "Tab":
				D && X();
				break;
			case "Backspace":
				h && t.value === "" && E.length > 0 && _e(E[E.length - 1]);
				break;
			default: !v && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), D || Y(), Se(e.key));
		}
	}
	function we() {
		if (!v || M()) return;
		A = t.value, W(), D || Y(), B();
		let n = F();
		V(A.trim() !== "" && n.length ? n[0] : null), K(), e.dispatchEvent(new CustomEvent("hui:combobox:search", {
			bubbles: !0,
			detail: { query: A }
		}));
	}
	function Te() {
		let n = M();
		e.toggleAttribute("data-disabled", n), t.disabled = n, o && (o.disabled = n), c && (c.disabled = n), e.querySelectorAll("input[data-hui-combobox-hidden-input]").forEach((e) => {
			e.disabled = n;
		}), u?.querySelectorAll("button[data-hui-combobox-chip-remove]").forEach((e) => {
			e.disabled = n;
		}), n && X();
	}
	t.id ||= a("input"), i.id ||= a("options"), t.setAttribute("role", "combobox"), t.setAttribute("aria-haspopup", "listbox"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", i.id), t.setAttribute("aria-autocomplete", v ? "list" : "none"), t.setAttribute("autocomplete", "off"), t.readOnly = !v, i.setAttribute("role", "listbox"), i.hidden = !0, i.style.display = "none", h && i.setAttribute("aria-multiselectable", "true"), o && (o.type = "button", o.tabIndex = -1, o.setAttribute("aria-haspopup", "listbox"), o.setAttribute("aria-expanded", "false"), o.setAttribute("aria-controls", i.id)), c && (c.type = "button", c.tabIndex = -1, c.hasAttribute("aria-label") || c.setAttribute("aria-label", "Clear selection")), z(), G(te, !1), U(), B(), Te(), t.addEventListener("keydown", Ce), t.addEventListener("input", we), t.addEventListener("click", () => {
		v ? Y() : be();
	}), t.addEventListener("focus", () => {
		b && Y();
	}), c?.addEventListener("pointerdown", (e) => e.preventDefault()), c?.addEventListener("click", (e) => {
		e.preventDefault(), he();
	}), o?.addEventListener("pointerdown", (e) => e.preventDefault()), o?.addEventListener("click", (e) => {
		e.preventDefault(), !M() && (be(), t.focus({ preventScroll: !0 }));
	}), e.addEventListener("focusout", () => {
		setTimeout(() => {
			let t = document.activeElement;
			t && e.contains(t) || X();
		}, 0);
	}), i.addEventListener("pointerdown", (e) => e.preventDefault()), i.addEventListener("click", (e) => {
		let t = e.target.closest(r);
		t && i.contains(t) && ge(t);
	}), i.addEventListener("pointermove", (e) => {
		let t = e.target.closest(r);
		t && t !== k && !t.hasAttribute("data-disabled") && V(t, !1);
	}), i.addEventListener("pointerleave", () => V(null)), u?.addEventListener("click", (e) => {
		let n = e.target.closest("[data-hui-combobox-chip-remove]")?.closest("[data-hui-combobox-chip]");
		n && (e.preventDefault(), _e(n.getAttribute("data-value") || ""), t.focus({ preventScroll: !0 }));
	}), e.closest("form")?.addEventListener("reset", () => {
		setTimeout(() => {
			A = "", G(te), U(), B();
		}, 0);
	});
	try {
		new MutationObserver(() => {
			z(), B(), D && (!k && A.trim() !== "" && H("first"), K());
		}).observe(i, {
			childList: !0,
			subtree: !0
		}), new MutationObserver(Te).observe(e, {
			attributes: !0,
			attributeFilter: ["data-hui-combobox-disabled"]
		});
	} catch {}
	e.hasAttribute("data-hui-combobox-open") && Y(), e._hui = {
		open: Y,
		close: X,
		toggle: be,
		getValue: () => h ? [...E] : E[0] ?? null,
		setValue: (e) => {
			G(e === null ? [] : Array.isArray(e) ? e : [e]), U();
		}
	};
}
function y(e) {
	return document.getElementById(e)?._hui ?? null;
}
function b(e) {
	y(e)?.open();
}
function x(e) {
	y(e)?.close();
}
function S(e) {
	return y(e)?.getValue() ?? null;
}
function C(e, t) {
	y(e)?.setValue(t);
}
function ee(e = document) {
	Array.from(e.querySelectorAll("[data-hui-combobox]")).forEach(v);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ee()) : ee());
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
function te(e, t) {
	if (t.key !== "Tab") return;
	let n = T(e);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = n[0], i = n[n.length - 1];
	t.shiftKey ? document.activeElement === r && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus());
}
function E(e, t) {
	return {
		base: (e.getAttribute(`${t}`) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function D(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function O() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function k(e) {
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
function A(e, t) {
	let { base: n, from: r } = E(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function ne(e, t) {
	let { base: n, from: r, to: i } = E(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : O().then(() => (e.classList.remove(...r), e.classList.add(...i), k(e))).then(() => {
		e.classList.remove(...n, ...i);
	});
}
function re(e, t) {
	let { base: n, from: r, to: i } = E(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), O().then(() => (e.classList.remove(...r), e.classList.add(...i), k(e))));
}
function j(e, t) {
	let { base: n, to: r } = E(e, t);
	e.classList.remove(...n, ...r);
}
function M(e) {
	let t = [];
	return (D(e, "data-hui-dialog-enter") || D(e, "data-hui-dialog-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-dialog-enter], [data-hui-dialog-leave]"))), t;
}
function N(e) {
	if (e.hasAttribute("data-hui-dialog-initialized")) return;
	e.setAttribute("data-hui-dialog-initialized", "");
	let t = null, n = !1, r = e.hasAttribute("data-hui-dialog-no-escape"), i = e.hasAttribute("data-hui-dialog-no-backdrop-close"), a = e.hasAttribute("data-hui-dialog-scroll-lock");
	function o() {
		if (e.open || n) return;
		t = document.activeElement;
		let r = M(e).filter((e) => D(e, "data-hui-dialog-enter"));
		r.forEach((e) => A(e, "data-hui-dialog-enter")), e.showModal(), e.setAttribute("data-hui-dialog-open", ""), a && (document.body.style.overflow = "hidden");
		let i = T(e);
		i.length > 0 && i[0].focus(), r.length > 0 && Promise.all(r.map((e) => ne(e, "data-hui-dialog-enter"))), e.dispatchEvent(new CustomEvent("hui:dialog:open", { bubbles: !0 }));
	}
	function s() {
		if (!e.open || n) return;
		let r = M(e).filter((e) => D(e, "data-hui-dialog-leave"));
		function i() {
			e.close(), e.removeAttribute("data-hui-dialog-open"), a && (document.querySelector("dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, n = !1, e.dispatchEvent(new CustomEvent("hui:dialog:close", { bubbles: !0 }));
		}
		if (r.length > 0) {
			n = !0;
			let e = r.map((e) => re(e, "data-hui-dialog-leave"));
			Promise.all(e).then(() => {
				i(), r.forEach((e) => j(e, "data-hui-dialog-leave"));
			});
		} else i();
	}
	e.addEventListener("keydown", (t) => {
		te(e, t);
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
	c && (c.id ||= `hui-dialog-title-${F()}`, e.setAttribute("aria-labelledby", c.id)), l && (l.id ||= `hui-dialog-desc-${F()}`, e.setAttribute("aria-describedby", l.id)), e._hui = {
		open: o,
		close: s
	}, e.hasAttribute("data-hui-dialog-open") && (e.removeAttribute("data-hui-dialog-open"), o());
}
var P = 0;
function F() {
	return `hui-${++P}-${Date.now()}`;
}
function ie(e) {
	Array.from(e.querySelectorAll("[data-hui-dialog-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-dialog-trigger-bound") || (e.setAttribute("data-hui-dialog-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-dialog-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			n && n._hui && n._hui.open();
		}));
	});
}
function ae(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dialog]")).forEach(N), ie(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ae()) : ae());
//#endregion
//#region resources/js/disclosure/disclosure.ts
function oe(e = document) {
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => oe()) : oe());
//#endregion
//#region resources/js/dropdown/dropdown.ts
var se = "[data-hui-dropdown-item]:not([data-disabled])";
function ce(e, t) {
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
function I(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function L(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function R() {
	return new Promise((e) => {
		requestAnimationFrame(() => requestAnimationFrame(() => e()));
	});
}
function z(e) {
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
function le(e) {
	if (!L(e, "data-hui-dropdown-enter")) return Promise.resolve();
	let { base: t, from: n, to: r } = I(e, "data-hui-dropdown-enter");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), R().then(() => (e.classList.remove(...n), e.classList.add(...r), z(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function B(e) {
	if (!L(e, "data-hui-dropdown-leave")) return Promise.resolve();
	let { base: t, from: n, to: r } = I(e, "data-hui-dropdown-leave");
	return t.length === 0 && n.length === 0 && r.length === 0 ? Promise.resolve() : (e.classList.add(...t, ...n), R().then(() => (e.classList.remove(...n), e.classList.add(...r), z(e))).then(() => {
		e.classList.remove(...t, ...r);
	}));
}
function V(e) {
	if (e.hasAttribute("data-hui-dropdown-initialized")) return;
	e.setAttribute("data-hui-dropdown-initialized", "");
	let t = e.querySelector("[data-hui-dropdown-trigger]"), n = e.querySelector("[data-hui-dropdown-items]");
	if (!t || !n) return;
	let r = !1, i = !1, a = -1, o = "", s = null;
	function c() {
		return Array.from(n.querySelectorAll(se));
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
		r || i || (r = !0, ce(t, n), n.style.display = "block", n.removeAttribute("hidden"), t.setAttribute("aria-expanded", "true"), e.setAttribute("data-open", ""), a && c().length > 0 && l(0), le(n), requestAnimationFrame(() => {
			document.addEventListener("pointerdown", m, !0);
		}), e.dispatchEvent(new CustomEvent("hui:dropdown:open", { bubbles: !0 })));
	}
	function f(a = !0) {
		if (!r || i) return;
		function o() {
			r = !1, i = !1, n.style.display = "none", n.setAttribute("hidden", ""), t.setAttribute("aria-expanded", "false"), e.removeAttribute("data-open"), u(), document.removeEventListener("pointerdown", m, !0), a && t.focus(), e.dispatchEvent(new CustomEvent("hui:dropdown:close", { bubbles: !0 }));
		}
		L(n, "data-hui-dropdown-leave") ? (i = !0, B(n).then(o)) : o();
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
			default: r && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), h(e.key));
		}
	}
	let _ = n.id;
	_ || (_ = `hui-dropdown-items-${++ue}-${Date.now()}`, n.id = _), t.setAttribute("aria-haspopup", "true"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", _), n.setAttribute("role", "menu"), n.style.display = "none", n.setAttribute("hidden", ""), c().forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.setAttribute("tabindex", "-1");
	}), Array.from(n.querySelectorAll("[data-hui-dropdown-item]")).forEach((e) => {
		e.getAttribute("role") || e.setAttribute("role", "menuitem"), e.hasAttribute("data-disabled") && e.setAttribute("aria-disabled", "true");
	}), t.addEventListener("click", (e) => {
		e.preventDefault(), p();
	}), t.addEventListener("keydown", g), n.addEventListener("keydown", g), n.addEventListener("click", (e) => {
		let t = e.target.closest(se);
		t && (t.dispatchEvent(new CustomEvent("hui:dropdown:select", {
			bubbles: !0,
			detail: { value: t.getAttribute("data-value") || t.textContent?.trim() }
		})), f());
	}), n.addEventListener("pointerenter", (e) => {
		let t = e.target.closest(se);
		if (t) {
			let e = c().indexOf(t);
			e !== -1 && l(e);
		}
	}, !0), n.addEventListener("pointerleave", (e) => {
		e.target.closest(se) && u();
	}, !0), e._hui = {
		open: d,
		close: f,
		toggle: p
	};
}
var ue = 0;
function H(e = document) {
	Array.from(e.querySelectorAll("[data-hui-dropdown]")).forEach(V);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => H()) : H());
//#endregion
//#region resources/js/flyout/flyout.ts
var de = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function fe(e) {
	return Array.from(e.querySelectorAll(de));
}
function pe(e, t) {
	if (t.key !== "Tab") return;
	let n = fe(e);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = n[0], i = n[n.length - 1];
	t.shiftKey ? document.activeElement === r && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus());
}
function me(e, t) {
	return {
		base: (e.getAttribute(t) || "").split(/\s+/).filter(Boolean),
		from: (e.getAttribute(`${t}-from`) || "").split(/\s+/).filter(Boolean),
		to: (e.getAttribute(`${t}-to`) || "").split(/\s+/).filter(Boolean)
	};
}
function U(e, t) {
	return e.hasAttribute(t) || e.hasAttribute(`${t}-from`) || e.hasAttribute(`${t}-to`);
}
function W() {
	return new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(() => e())));
}
function he(e) {
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
function G(e, t) {
	let { base: n, from: r } = me(e, t);
	(n.length > 0 || r.length > 0) && e.classList.add(...n, ...r);
}
function ge(e, t) {
	let { base: n, from: r, to: i } = me(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : W().then(() => (e.classList.remove(...r), e.classList.add(...i), he(e))).then(() => {
		e.classList.remove(...n, ...i);
	});
}
function _e(e, t) {
	let { base: n, from: r, to: i } = me(e, t);
	return n.length === 0 && r.length === 0 && i.length === 0 ? Promise.resolve() : (e.classList.add(...n, ...r), W().then(() => (e.classList.remove(...r), e.classList.add(...i), he(e))));
}
function ve(e, t) {
	let { base: n, to: r } = me(e, t);
	e.classList.remove(...n, ...r);
}
function K(e) {
	let t = [];
	return (U(e, "data-hui-flyout-enter") || U(e, "data-hui-flyout-leave")) && t.push(e), t.push(...Array.from(e.querySelectorAll("[data-hui-flyout-enter], [data-hui-flyout-leave]"))), t;
}
function q(e) {
	let t = e.getAttribute("data-hui-flyout-inline");
	if (!t) return null;
	let n = parseInt(t, 10);
	return Number.isFinite(n) && n > 0 ? n : null;
}
function J(e) {
	let t = q(e);
	return t !== null && window.innerWidth >= t;
}
var ye = {
	left: "x",
	right: "x",
	top: "y",
	bottom: "y"
}, Y = {
	left: -1,
	right: 1,
	top: -1,
	bottom: 1
};
function X(e) {
	let t = e.getAttribute("data-hui-flyout-position");
	return t === "left" || t === "top" || t === "bottom" ? t : "right";
}
function be(e) {
	let t = e.getAttribute("data-hui-flyout-swipe");
	return t === "open" || t === "close" || t === "both" ? t : null;
}
function xe(e, t) {
	return t === "left" || t === "right" ? !0 : t === "bottom" ? e.scrollTop <= 0 : e.scrollTop + e.clientHeight >= e.scrollHeight - 1;
}
function Se(e, t, n) {
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
function Ce(e, t, n, r) {
	switch (n) {
		case "left": return e <= r;
		case "right": return e >= window.innerWidth - r;
		case "top": return t <= r;
		case "bottom": return t >= window.innerHeight - r;
	}
}
function we(e) {
	if (e.hasAttribute("data-hui-flyout-initialized")) return;
	e.setAttribute("data-hui-flyout-initialized", "");
	let t = null, n = !1, r = e.hasAttribute("data-hui-flyout-no-escape"), i = e.hasAttribute("data-hui-flyout-no-backdrop-close"), a = e.hasAttribute("data-hui-flyout-scroll-lock");
	function o() {
		J(e) && (e.open && e.close(), e.removeAttribute("data-hui-flyout-open"));
	}
	function s() {
		if (J(e) || e.open || n) return;
		t = document.activeElement;
		let r = K(e).filter((e) => U(e, "data-hui-flyout-enter"));
		r.forEach((e) => G(e, "data-hui-flyout-enter")), e.showModal(), e.setAttribute("data-hui-flyout-open", ""), a && (document.body.style.overflow = "hidden");
		let i = fe(e);
		i.length > 0 && i[0].focus(), r.length > 0 && Promise.all(r.map((e) => ge(e, "data-hui-flyout-enter"))), e.dispatchEvent(new CustomEvent("hui:flyout:open", { bubbles: !0 }));
	}
	function c(r = {}) {
		if (J(e) || !e.open || n) return;
		let i = K(e), o = r.immediate ? [] : i.filter((e) => U(e, "data-hui-flyout-leave"));
		function s() {
			e.close(), e.removeAttribute("data-hui-flyout-open"), a && (document.querySelector("dialog[data-hui-flyout][data-hui-flyout-scroll-lock][open]") || (document.body.style.overflow = "")), t && t.focus && t.focus(), t = null, n = !1, e.dispatchEvent(new CustomEvent("hui:flyout:close", { bubbles: !0 }));
		}
		if (o.length > 0) {
			n = !0;
			let e = o.map((e) => _e(e, "data-hui-flyout-leave"));
			Promise.all(e).then(() => {
				s(), o.forEach((e) => ve(e, "data-hui-flyout-leave"));
			});
		} else s();
	}
	e.addEventListener("keydown", (t) => {
		pe(e, t);
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
	l && (l.id ||= `hui-flyout-title-${Ee()}`, e.setAttribute("aria-labelledby", l.id)), u && (u.id ||= `hui-flyout-desc-${Ee()}`, e.setAttribute("aria-describedby", u.id));
	let d = q(e);
	d !== null && (window.matchMedia(`(min-width: ${d}px)`).addEventListener("change", o), o());
	function f(t) {
		let r = ye[t], i = Y[t];
		Array.from(e.querySelectorAll("[data-hui-flyout-panel]")).forEach((a) => {
			let o = 0, s = 0, l = 0, u = 0, d = 0, f = 0, p = !1, m = !1;
			function h() {
				p = !1, m = !1, u = 0, d = 0;
			}
			function g(e, t) {
				a.style.transition = "transform 0.2s cubic-bezier(0.3, 0, 0.2, 1)", a.style.transform = e, he(a).then(() => {
					t && t(), a.style.transition = "", a.style.transform = "";
				});
			}
			a.addEventListener("touchstart", (t) => {
				if (t.touches.length !== 1 || !e.open || J(e) || n) return;
				let i = t.touches[0];
				o = i.clientX, s = i.clientY, l = t.timeStamp, f = r === "x" ? a.getBoundingClientRect().width : a.getBoundingClientRect().height, h();
			}, { passive: !0 }), a.addEventListener("touchmove", (n) => {
				if (n.touches.length !== 1 || !e.open || J(e)) return;
				let c = n.touches[0], f = r === "x" ? c.clientX - o : c.clientY - s, h = r === "x" ? c.clientY - s : c.clientX - o, g = f * i;
				if (!p) {
					if (Math.abs(f) < 8 && Math.abs(h) < 8) return;
					p = !0, m = Math.abs(f) > Math.abs(h) && g > 0 && xe(a, t), m && (a.style.transition = "none");
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
			if (!e.isConnected || o.touches.length !== 1 || e.open || J(e) || n) return;
			let s = o.touches[0];
			Ce(s.clientX, s.clientY, t, 24) && (r = !0, i = s.clientX, a = s.clientY);
		}, { passive: !0 }), document.addEventListener("touchmove", (e) => {
			if (!r || e.touches.length !== 1) return;
			let n = e.touches[0], { inward: o, cross: c } = Se(t, n.clientX - i, n.clientY - a);
			o > 48 && o > Math.abs(c) && (r = !1, s());
		}, { passive: !0 });
		let o = () => {
			r = !1;
		};
		document.addEventListener("touchend", o, { passive: !0 }), document.addEventListener("touchcancel", o, { passive: !0 });
	}
	let m = be(e);
	if (m) {
		let t = X(e);
		(m === "close" || m === "both") && f(t), (m === "open" || m === "both") && p(t);
	}
	e._hui = {
		open: s,
		close: c
	}, e.hasAttribute("data-hui-flyout-open") && (e.removeAttribute("data-hui-flyout-open"), s());
}
var Te = 0;
function Ee() {
	return `hui-${++Te}-${Date.now()}`;
}
function De(e) {
	Array.from(e.querySelectorAll("[data-hui-flyout-trigger]")).forEach((e) => {
		e.hasAttribute("data-hui-flyout-trigger-bound") || (e.setAttribute("data-hui-flyout-trigger-bound", ""), e.addEventListener("click", () => {
			let t = e.getAttribute("data-hui-flyout-trigger");
			if (!t) return;
			let n = document.getElementById(t);
			n && n._hui && n._hui.open();
		}));
	});
}
function Oe(e = document) {
	Array.from(e.querySelectorAll("[data-hui-flyout]")).forEach(we), De(e);
}
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Oe()) : Oe());
//#endregion
//#region resources/js/range-slider/range-slider.ts
function Z(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function ke(e, t, n) {
	return n === t ? 0 : (e - t) / (n - t) * 100;
}
function Ae(e = document) {
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
			}), n) {
				if (a) {
					let e = ke(t, p, m), r = ke(o, p, m);
					n.style.left = `${e}%`, n.style.width = `${Math.max(0, r - e)}%`;
				} else {
					let e = ke(t, p, m);
					n.style.left = `${e}%`, n.style.width = `${Math.max(0, 100 - e)}%`;
				}
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
				let t = v(e), n = a ? Number(i.value) : m, o = Z(t, p, n);
				String(o) === r.value ? _("min") : (r.value = String(o), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
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
			let n = t.getBoundingClientRect(), o = Z((e - n.left) / n.width, 0, 1), s = p + o * (m - p), c = Math.round((s - p) / (h || 1)) * (h || 1) + p, l = Number(r?.value ?? p), u = a ? Number(i.value) : m, d = Math.abs(c - l), f = a ? Math.abs(c - u) : Infinity, g = "min";
			if (a && !i.disabled && (g = r && !r.disabled ? f === d ? c > (l + u) / 2 ? "max" : "min" : f < d ? "max" : "min" : "max"), g === "min" && r) {
				let e = Z(c, p, a ? Number(i.value) : m);
				String(e) === r.value ? _("min") : (r.value = String(e), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
			} else if (g === "max" && i) {
				let e = Z(c, r ? Number(r.value) : p, m);
				String(e) === i.value ? _("max") : (i.value = String(e), i.dispatchEvent(new Event("input", { bubbles: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
		}
		function b(e) {
			let t = 0, n = !1, r = null, i = (e) => {
				(r === null || e.pointerId === r) && Math.abs(e.clientX - t) > 4 && (n = !0);
			}, a = (e) => {
				(r === null || e.pointerId === r) && (window.removeEventListener("pointermove", i, !0), window.removeEventListener("pointerup", a, !0), window.removeEventListener("pointercancel", a, !0), n || (y(e.clientX), e.preventDefault(), e.stopPropagation()), n = !1, r = null);
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Ae()) : Ae());
//#endregion
//#region resources/js/tabs/tabs.ts
function Q(e, t) {
	return e.hasAttribute(t);
}
function je(e) {
	for (let t = 0; t < e.length; t++) if (!Q(e[t], "data-disabled")) return t;
	return 0;
}
function Me(e = document) {
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
			return je(n);
		}
		function c(e, t) {
			let r = e;
			for (let e = 0; e < o; e++) if (r = (r + t + o) % o, !Q(n[r], "data-disabled")) return r;
			return e;
		}
		let l = Math.max(0, Math.min(s(), o - 1));
		Q(n[l], "data-disabled") && (l = je(n));
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
			i ? (t === "ArrowUp" && (m(c(l, -1), !0), r = !0), t === "ArrowDown" && (m(c(l, 1), !0), r = !0)) : (t === "ArrowLeft" && (m(c(l, -1), !0), r = !0), t === "ArrowRight" && (m(c(l, 1), !0), r = !0)), t === "Home" && (m(je(n), !0), r = !0), t === "End" && (m((() => {
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
					if (Q(n[l], "data-disabled")) l = je(n);
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Me()) : Me());
//#endregion
//#region resources/js/toggle/toggle.ts
function Ne(e = document) {
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Ne()) : Ne());
//#endregion
//#region resources/js/tooltip/tooltip.ts
function $(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function Pe(e = document) {
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
				e && e !== "transparent" && !/rgba\([^\)]*,\s*0\s*\)/.test(e) ? t.style.setProperty("--hui-tooltip-bg", e) : t.style.removeProperty("--hui-tooltip-bg");
			} catch {}
		}
		function d() {
			t !== null && (!o() || s()) && (n || (n = !0, t.style.display = "block", t.setAttribute("aria-hidden", "false"), t.setAttribute("data-open", "true"), u(), window.addEventListener("scroll", m, !0), window.addEventListener("resize", h, !0), document.addEventListener("pointerdown", p, !0), document.addEventListener("keydown", c, !0)));
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
typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Pe()) : Pe());
//#endregion
//#region resources/js/hui.ts
function Fe(...e) {
	return e.filter(Boolean).join(" ");
}
//#endregion
export { x as closeCombobox, Fe as cn, S as getComboboxValue, b as openCombobox, ee as registerComboboxes, C as setComboboxValue };
