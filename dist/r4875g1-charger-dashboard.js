function xe(n) {
  return n.callWS({
    type: "r4875g1_charger/instances"
  });
}
function xt(n, e) {
  return n.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: e
  });
}
function Ae(n, e, t, r) {
  const i = {
    type: "r4875g1_charger/control",
    config_entry_id: e,
    role: t
  };
  return r !== void 0 && (i.value = r), n.callWS(i);
}
function Ee(n, e, t) {
  return n.connection.subscribeMessage(
    t,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: e
    }
  );
}
function we(n, e) {
  switch (e.event) {
    case "snapshot":
    case "mapping_changed":
      return e.data;
    case "role_state": {
      if (n === null)
        return n;
      const t = n.roles[e.role];
      return {
        ...e.instance ?? n,
        roles: {
          ...n.roles,
          [e.role]: {
            ...t,
            ...e.data
          }
        }
      };
    }
    case "mapping_error":
      return n;
  }
}
class Te {
  currentState = null;
  backendUnsubscribe = null;
  generation = 0;
  listeners = /* @__PURE__ */ new Set();
  get state() {
    return this.currentState;
  }
  subscribe(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  async connect(e, t) {
    this.disconnect();
    const r = this.generation, i = await Ee(
      e,
      t,
      (s) => {
        r === this.generation && this.applyEvent(s);
      }
    );
    if (r !== this.generation) {
      i();
      return;
    }
    this.backendUnsubscribe = i;
  }
  disconnect() {
    this.generation += 1, this.backendUnsubscribe !== null && (this.backendUnsubscribe(), this.backendUnsubscribe = null), this.currentState !== null && (this.currentState = null, this.notify());
  }
  applyEvent(e) {
    const t = we(
      this.currentState,
      e
    );
    t !== this.currentState && (this.currentState = t, this.notify());
  }
  notify() {
    for (const e of this.listeners)
      e(this.currentState);
  }
}
const U = globalThis, V = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, H = /* @__PURE__ */ Symbol(), B = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== H) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (V && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = B.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && B.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Re = (n) => new fe(typeof n == "string" ? n : n + "", void 0, H), p = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, i, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[s + 1], n[0]);
  return new fe(t, n, H);
}, ke = (n, e) => {
  if (V) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = U.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
  }
}, j = V ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Re(t);
})(n) : n;
const { is: Pe, defineProperty: Ue, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: Ne, getOwnPropertySymbols: Ie, getPrototypeOf: Me } = Object, N = globalThis, K = N.trustedTypes, Le = K ? K.emptyScript : "", De = N.reactiveElementPolyfillSupport, E = (n, e) => n, D = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Le : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, be = (n, e) => !Pe(n, e), Z = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: be };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), N.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Z) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Ue(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: s } = Oe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const c = i?.call(this);
      s?.call(this, o), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Z;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const e = Me(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const t = this.properties, r = [...Ne(t), ...Ie(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(j(i));
    } else e !== void 0 && t.push(j(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ke(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : D).toAttribute(t, r.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const s = r.getPropertyOptions(i), o = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : D;
      this._$Em = i;
      const c = o.fromAttribute(t, s.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, s) {
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (s = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? be)(s, t) || r.useDefault && r.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: s }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, s] of this._$Ep) this[i] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, s] of r) {
        const { wrapped: o } = s, c = this[i];
        o !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, s, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[E("elementProperties")] = /* @__PURE__ */ new Map(), S[E("finalized")] = /* @__PURE__ */ new Map(), De?.({ ReactiveElement: S }), (N.reactiveElementVersions ??= []).push("2.1.2");
const G = globalThis, J = (n) => n, O = G.trustedTypes, X = O ? O.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ve = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + v, qe = `<${ye}>`, C = document, w = () => C.createComment(""), T = (n) => n === null || typeof n != "object" && typeof n != "function", z = Array.isArray, Ve = (n) => z(n) || typeof n?.[Symbol.iterator] == "function", M = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, Y = />/g, y = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ee = /'/g, te = /"/g, $e = /^(?:script|style|textarea|title)$/i, He = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), a = He(1), _ = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), re = /* @__PURE__ */ new WeakMap(), $ = C.createTreeWalker(C, 129);
function Ce(n, e) {
  if (!z(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(e) : e;
}
const Ge = (n, e) => {
  const t = n.length - 1, r = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = A;
  for (let c = 0; c < t; c++) {
    const l = n[c];
    let u, g, d = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, g = o.exec(l), g !== null); ) f = o.lastIndex, o === A ? g[1] === "!--" ? o = Q : g[1] !== void 0 ? o = Y : g[2] !== void 0 ? ($e.test(g[2]) && (i = RegExp("</" + g[2], "g")), o = y) : g[3] !== void 0 && (o = y) : o === y ? g[0] === ">" ? (o = i ?? A, d = -1) : g[1] === void 0 ? d = -2 : (d = o.lastIndex - g[2].length, u = g[1], o = g[3] === void 0 ? y : g[3] === '"' ? te : ee) : o === te || o === ee ? o = y : o === Q || o === Y ? o = A : (o = y, i = void 0);
    const b = o === y && n[c + 1].startsWith("/>") ? " " : "";
    s += o === A ? l + qe : d >= 0 ? (r.push(u), l.slice(0, d) + ve + l.slice(d) + v + b) : l + v + (d === -2 ? c : b);
  }
  return [Ce(n, s + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class R {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const c = e.length - 1, l = this.parts, [u, g] = Ge(e, t);
    if (this.el = R.createElement(u, r), $.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = $.nextNode()) !== null && l.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(ve)) {
          const f = g[o++], b = i.getAttribute(d).split(v), P = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: s, name: P[2], strings: b, ctor: P[1] === "." ? Fe : P[1] === "?" ? We : P[1] === "@" ? Be : I }), i.removeAttribute(d);
        } else d.startsWith(v) && (l.push({ type: 6, index: s }), i.removeAttribute(d));
        if ($e.test(i.tagName)) {
          const d = i.textContent.split(v), f = d.length - 1;
          if (f > 0) {
            i.textContent = O ? O.emptyScript : "";
            for (let b = 0; b < f; b++) i.append(d[b], w()), $.nextNode(), l.push({ type: 2, index: ++s });
            i.append(d[f], w());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ye) l.push({ type: 2, index: s });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(v, d + 1)) !== -1; ) l.push({ type: 7, index: s }), d += v.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const r = C.createElement("template");
    return r.innerHTML = e, r;
  }
}
function x(n, e, t = n, r) {
  if (e === _) return e;
  let i = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const s = T(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== s && (i?._$AO?.(!1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = i : t._$Cl = i), i !== void 0 && (e = x(n, i._$AS(n, e.values), i, r)), e;
}
class ze {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = (e?.creationScope ?? C).importNode(t, !0);
    $.currentNode = i;
    let s = $.nextNode(), o = 0, c = 0, l = r[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new k(s, s.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (u = new je(s, this, e)), this._$AV.push(u), l = r[++c];
      }
      o !== l?.index && (s = $.nextNode(), o++);
    }
    return $.currentNode = C, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = x(this, e, t), T(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== _ && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ve(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = R.createElement(Ce(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const s = new ze(i, this), o = s.u(this.options);
      s.p(t), this.T(o), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = re.get(e.strings);
    return t === void 0 && re.set(e.strings, t = new R(e)), t;
  }
  k(e) {
    z(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const s of e) i === t.length ? t.push(r = new k(this.O(w()), this.O(w()), this, this.options)) : r = t[i], r._$AI(s), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = J(e).nextSibling;
      J(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, s) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(e, t = this, r, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = x(this, e, t, 0), o = !T(e) || e !== this._$AH && e !== _, o && (this._$AH = e);
    else {
      const c = e;
      let l, u;
      for (e = s[0], l = 0; l < s.length - 1; l++) u = x(this, c[r + l], t, l), u === _ && (u = this._$AH[l]), o ||= !T(u) || u !== this._$AH[l], u === h ? e = h : e !== h && (e += (u ?? "") + s[l + 1]), this._$AH[l] = u;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Fe extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class We extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Be extends I {
  constructor(e, t, r, i, s) {
    super(e, t, r, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = x(this, e, t, 0) ?? h) === _) return;
    const r = this._$AH, i = e === h && r !== h || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== h && (r === h || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    x(this, e);
  }
}
const Ke = G.litHtmlPolyfillSupport;
Ke?.(R, k), (G.litHtmlVersions ??= []).push("3.3.3");
const Ze = (n, e, t) => {
  const r = t?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = t?.renderBefore ?? null;
    r._$litPart$ = i = new k(e.insertBefore(w(), s), s, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
const F = globalThis;
class m extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ze(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return _;
  }
}
m._$litElement$ = !0, m.finalized = !0, F.litElementHydrateSupport?.({ LitElement: m });
const Je = F.litElementPolyfillSupport;
Je?.({ LitElement: m });
(F.litElementVersions ??= []).push("4.2.2");
function W(n) {
  return n?.available !== !0 ? {
    available: !1,
    value: "unavailable",
    unit: null
  } : {
    available: !0,
    value: Xe(n.state),
    unit: n.unit ?? null
  };
}
function Xe(n) {
  if (n === null)
    return "unavailable";
  const e = Number(n);
  return Number.isFinite(e) ? new Intl.NumberFormat(void 0, {
    maximumFractionDigits: 2,
    useGrouping: !1
  }).format(e) : n;
}
const ie = "r4875g1-charger-status", ne = 3, Qe = [
  { label: "AC power", role: "charger.ac.power" },
  { label: "AC voltage", role: "charger.ac.voltage" },
  { label: "AC current", role: "charger.ac.current" },
  { label: "DC power", role: "charger.dc.power" },
  { label: "DC voltage", role: "charger.dc.voltage" },
  { label: "DC current", role: "charger.dc.current" },
  {
    label: "Highest output temperature",
    role: "charger.highest_output_temperature"
  },
  {
    label: "Conversion efficiency",
    role: "charger.conversion_efficiency"
  }
];
class Ye extends m {
  static styles = p`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .status {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .row {
      display: grid;
      grid-template-columns: minmax(8rem, auto) 1fr;
      gap: 1rem;
      align-items: baseline;
    }

    .label,
    .metric-label {
      color: var(--secondary-text-color, #727272);
    }

    .value {
      font-weight: 600;
    }

    .unit-status {
      display: grid;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .unit-status-row {
      display: grid;
      grid-template-columns: minmax(8rem, auto) 1fr;
      gap: 1rem;
      align-items: baseline;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .metric {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      font-size: 0.85rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 400;
    }
  `;
  chargerStore = null;
  chargerState = null;
  unsubscribe = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return this.chargerState === null ? a`
        <div class="status">
          <div class="value">Waiting for Charger Instance data…</div>
        </div>
      ` : a`
      <div class="status">
        <div class="row">
          <span class="label">Name</span>
          <span class="value">${this.chargerState.name}</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="value">${this.chargerState.status}</span>
        </div>
        <div class="row">
          <span class="label">Contract</span>
          <span class="value">
            ${this.chargerState.contract_version ?? "unavailable"}
          </span>
        </div>

        ${this.renderRectifierStatus()}

        <div class="metrics">
          ${Qe.map(
      ({ label: e, role: t }) => this.renderMetric(e, t)
    )}
        </div>
      </div>
    `;
  }
  renderRectifierStatus() {
    const e = this.chargerState?.roles["charger.available_units"], t = this.chargerState?.roles["charger.running_units"];
    return a`
      <div class="unit-status">
        <div class="unit-status-row">
          <span class="label">Available rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(e?.state)}
            / ${ne}
          </span>
        </div>
        <div class="unit-status-row">
          <span class="label">Running rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(t?.state)}
            / ${ne}
          </span>
        </div>
      </div>
    `;
  }
  formatRectifierCount(e) {
    if (e == null)
      return "-";
    const t = Number(e);
    return Number.isFinite(t) ? Math.trunc(t).toString() : "-";
  }
  renderMetric(e, t) {
    const r = W(this.chargerState?.roles[t]);
    return a`
      <div class="metric">
        <span class="metric-label">${e}</span>
        <span class="metric-value">
          ${r.value}${r.unit !== null ? a`<span class="metric-unit">${r.unit}</span>` : ""}
        </span>
      </div>
    `;
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(ie) || customElements.define(ie, Ye);
const se = "r4875g1-charger-number-control", et = 1e4;
class tt extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .control {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--primary-text-color, #212121);
    }

    .control-info {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    .label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
    }

    .value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 400;
    }

    button,
    input {
      min-height: 2.75rem;
      font: inherit;
    }

    button {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled,
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .edit-button {
      min-width: 5rem;
      padding: 0 1rem;
    }

    .message {
      margin-top: 0.75rem;
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
    }

    .dialog-backdrop {
      display: grid;
      place-items: center;
      margin-top: 0.75rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: color-mix(
        in srgb,
        var(--card-background-color, #ffffff) 55%,
        #000000 45%
      );
    }

    .dialog {
      display: grid;
      gap: 1rem;
      width: min(100%, 28rem);
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .dialog-title {
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
    }

    .editor {
      display: grid;
      grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
      gap: 0.5rem;
      align-items: center;
    }

    .editor input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
      font-size: 1rem;
      text-align: center;
    }

    .range {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      text-align: center;
    }

    .dialog-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .save {
      border-color: var(--success-color, #43a047);
    }
  `;
  chargerStore = null;
  chargerState = null;
  executeControl = null;
  unsubscribe = null;
  controlRole = "";
  controlLabel = "";
  dialogOpen = !1;
  editValue = null;
  pendingTarget = null;
  pendingTimeout = null;
  commandError = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    this.executeControl = e, this.requestUpdate();
  }
  get role() {
    return this.controlRole;
  }
  set role(e) {
    e !== this.controlRole && (this.controlRole = e, this.resetInteraction(), this.requestUpdate());
  }
  get label() {
    return this.controlLabel;
  }
  set label(e) {
    e !== this.controlLabel && (this.controlLabel = e, this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), this.clearPendingTimeout(), super.disconnectedCallback();
  }
  render() {
    const e = this.chargerState?.roles[this.controlRole], t = this.numberMetadata(), r = e?.available === !0 ? this.formatDisplayValue(e.state) : "unavailable", i = t?.unit ?? e?.unit ?? null, s = e?.available === !0 && t?.available === !0 && this.executeControl !== null && this.pendingTarget === null;
    return a`
      <div class="control">
        <div class="control-info">
          <span class="label">${this.controlLabel}</span>
          <span class="value">
            ${r}${i !== null ? a`<span class="unit">${i}</span>` : ""}
          </span>
        </div>
        <button
          class="edit-button"
          ?disabled=${!s}
          @click=${this.openDialog}
        >
          ${this.pendingTarget !== null ? "SAVING..." : "EDIT"}
        </button>
      </div>

      ${this.commandError !== null ? a`<div class="message">${this.commandError}</div>` : ""}

      ${this.dialogOpen && t !== null ? this.renderDialog(t) : ""}
    `;
  }
  renderDialog(e) {
    const t = this.validationError(e);
    return a`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-number-dialog-title"
        >
          <div
            id="charger-number-dialog-title"
            class="dialog-title"
          >
            ${this.controlLabel}
          </div>

          <div class="editor">
            <button
              aria-label="Decrease"
              @click=${() => this.adjustValue(-1, e)}
            >
              −
            </button>
            <input
              type="number"
              .value=${this.inputValue()}
              min=${e.min ?? ""}
              max=${e.max ?? ""}
              step=${e.step ?? "any"}
              @input=${this.handleInput}
            />
            <button
              aria-label="Increase"
              @click=${() => this.adjustValue(1, e)}
            >
              +
            </button>
          </div>

          <div class="range">
            ${this.rangeText(e)}
          </div>

          ${t !== null ? a`<div class="message">${t}</div>` : ""}

          <div class="dialog-actions">
            <button @click=${this.cancelDialog}>CANCEL</button>
            <button
              class="save"
              ?disabled=${t !== null}
              @click=${this.saveValue}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    `;
  }
  numberMetadata() {
    const e = this.chargerState?.roles[this.controlRole]?.control;
    return e?.action === "set_value" ? e : null;
  }
  openDialog = () => {
    const e = this.chargerState?.roles[this.controlRole], t = this.numberMetadata();
    if (e?.available !== !0 || t?.available !== !0 || e.state === null || this.pendingTarget !== null)
      return;
    const r = Number(e.state);
    Number.isFinite(r) && (this.editValue = r, this.dialogOpen = !0, this.commandError = null, this.requestUpdate());
  };
  cancelDialog = () => {
    this.dialogOpen = !1, this.editValue = null, this.requestUpdate();
  };
  handleInput = (e) => {
    const r = e.currentTarget.value.trim();
    this.editValue = r === "" ? null : Number(r), this.requestUpdate();
  };
  adjustValue(e, t) {
    if (this.editValue === null)
      return;
    const r = typeof t.step == "number" && t.step > 0 ? t.step : 1, i = typeof t.min == "number" ? t.min : 0;
    let s = this.editValue + e * r;
    typeof t.min == "number" && (s = Math.max(t.min, s)), typeof t.max == "number" && (s = Math.min(t.max, s));
    const o = Math.round((s - i) / r), c = this.stepPrecision(r);
    this.editValue = Number(
      (i + o * r).toFixed(c)
    ), this.requestUpdate();
  }
  validationError(e) {
    const t = this.editValue;
    return t === null || !Number.isFinite(t) ? "Enter a valid numeric value." : typeof e.min == "number" && t < e.min ? `Minimum value is ${e.min}.` : typeof e.max == "number" && t > e.max ? `Maximum value is ${e.max}.` : null;
  }
  saveValue = async () => {
    const e = this.executeControl, t = this.numberMetadata(), r = this.editValue;
    if (!(e === null || t === null || t.available !== !0 || r === null || this.validationError(t) !== null || this.pendingTarget !== null)) {
      this.dialogOpen = !1, this.editValue = null, this.pendingTarget = r, this.commandError = null, this.startPendingTimeout(r), this.requestUpdate();
      try {
        await e(this.controlRole, r);
      } catch (i) {
        if (this.pendingTarget !== r)
          return;
        this.clearPendingTarget(), this.commandError = i instanceof Error ? i.message : String(i), this.requestUpdate();
        return;
      }
      this.checkPendingCompletion(), this.requestUpdate();
    }
  };
  checkPendingCompletion() {
    const e = this.pendingTarget;
    if (e === null)
      return;
    const t = this.chargerState?.roles[this.controlRole];
    if (t?.available !== !0 || t.state === null)
      return;
    const r = Number(t.state);
    if (!Number.isFinite(r))
      return;
    const i = this.numberMetadata()?.step, s = typeof i == "number" && i > 0 ? Math.max(i / 1e3, 1e-6) : 1e-6;
    Math.abs(r - e) <= s && this.clearPendingTarget();
  }
  startPendingTimeout(e) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingTarget === e && (this.clearPendingTarget(), this.commandError = "Controller state did not confirm the value within 10 seconds.", this.requestUpdate());
    }, et);
  }
  clearPendingTarget() {
    this.pendingTarget = null, this.clearPendingTimeout();
  }
  clearPendingTimeout() {
    this.pendingTimeout !== null && (clearTimeout(this.pendingTimeout), this.pendingTimeout = null);
  }
  resetInteraction() {
    this.dialogOpen = !1, this.editValue = null, this.commandError = null, this.clearPendingTarget();
  }
  inputValue() {
    return this.editValue === null ? "" : String(this.editValue);
  }
  rangeText(e) {
    const t = [];
    return typeof e.min == "number" && t.push(`min ${e.min}`), typeof e.max == "number" && t.push(`max ${e.max}`), typeof e.step == "number" && t.push(`step ${e.step}`), e.unit !== null && t.push(e.unit), t.join(" · ");
  }
  formatDisplayValue(e) {
    if (e === null)
      return "unavailable";
    const t = Number(e);
    return Number.isFinite(t) ? new Intl.NumberFormat(void 0, {
      maximumFractionDigits: 2,
      useGrouping: !1
    }).format(t) : e;
  }
  stepPrecision(e) {
    const t = e.toString(), r = t.toLowerCase().indexOf("e-");
    if (r >= 0)
      return Math.min(
        Number(t.slice(r + 2)) || 0,
        6
      );
    const i = t.indexOf(".");
    return i < 0 ? 0 : Math.min(t.length - i - 1, 6);
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.checkPendingCompletion(), this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(se) || customElements.define(
  se,
  tt
);
const oe = "r4875g1-semantic-metric-grid";
class rt extends m {
  static styles = p`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      gap: 0.5rem;
    }

    .metric {
      display: grid;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.65rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 400;
    }
  `;
  semanticRoles = {};
  metricDefinitions = [];
  get roles() {
    return this.semanticRoles;
  }
  set roles(e) {
    e !== this.semanticRoles && (this.semanticRoles = e, this.requestUpdate());
  }
  get metrics() {
    return this.metricDefinitions;
  }
  set metrics(e) {
    e !== this.metricDefinitions && (this.metricDefinitions = e, this.requestUpdate());
  }
  render() {
    return a`
      <div class="metrics">
        ${this.metricDefinitions.map(
      ({ label: e, role: t }) => this.renderMetric(e, t)
    )}
      </div>
    `;
  }
  renderMetric(e, t) {
    const r = W(this.semanticRoles[t]);
    return a`
      <div class="metric">
        <span class="metric-label">${e}</span>
        <span class="metric-value">
          ${r.value}${r.unit !== null ? a`<span class="metric-unit">${r.unit}</span>` : ""}
        </span>
      </div>
    `;
  }
}
customElements.get(oe) || customElements.define(
  oe,
  rt
);
const ae = "r4875g1-advanced-charger-status", le = [
  {
    label: "DC current setpoint",
    role: "charger.dc.current_setpoint"
  },
  {
    label: "Internal fan minimum duty",
    role: "charger.internal_fan.minimum_duty_setpoint"
  }
], ce = [
  {
    label: "Effective DC current limit",
    role: "charger.dc.current_limit_effective"
  },
  {
    label: "Thermal DC current limit",
    role: "charger.dc.current_limit_thermal"
  },
  {
    label: "Applied DC current limit",
    role: "charger.dc.current_limit_applied"
  },
  {
    label: "AC energy today",
    role: "charger.energy.ac_today"
  },
  {
    label: "DC energy today",
    role: "charger.energy.dc_today"
  },
  {
    label: "Rectifier capability mismatch",
    role: "charger.capability_mismatch"
  }
];
class it extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      display: grid;
      gap: 0.75rem;
    }

    .section-heading {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .panel {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    .panel-heading {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: baseline;
      justify-content: space-between;
    }

    .panel-title {
      font-weight: 600;
    }

    .capability-status {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .subheading {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .controls {
      display: grid;
      gap: 0.5rem;
    }

    .controls > r4875g1-charger-number-control {
      margin-top: 0;
    }

    .message {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--secondary-text-color, #727272);
    }
  `;
  chargerStore = null;
  chargerState = null;
  unsubscribe = null;
  executeControl = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    e !== this.executeControl && (this.executeControl = e, this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    if (this.chargerState === null)
      return a`
        <section class="section">
          <h2 class="section-heading">Advanced Charger</h2>
          <div class="message">
            Waiting for advanced Charger data…
          </div>
        </section>
      `;
    const e = this.chargerState.capabilities.advanced_charger;
    return e === void 0 || e.status === "unavailable" || !this.hasRelevantRole() ? "" : a`
      <section class="section">
        <h2 class="section-heading">Advanced Charger</h2>
        <section class="panel">
          <div class="panel-heading">
            <span class="panel-title">Advanced Charger</span>
            <span class="capability-status">${e.status}</span>
          </div>

          <div class="subheading">Controls</div>
          <div class="controls">
            ${le.map(({ label: t, role: r }) => a`
              <r4875g1-charger-number-control
                .store=${this.chargerStore}
                .execute=${this.executeControl}
                .role=${r}
                .label=${t}
              ></r4875g1-charger-number-control>
            `)}
          </div>

          <div class="subheading">Telemetry</div>
          <r4875g1-semantic-metric-grid
            .roles=${this.chargerState.roles}
            .metrics=${ce}
          ></r4875g1-semantic-metric-grid>
        </section>
      </section>
    `;
  }
  hasRelevantRole() {
    return le.some(
      ({ role: e }) => this.chargerState?.roles[e] !== void 0
    ) || ce.some(
      ({ role: e }) => this.chargerState?.roles[e] !== void 0
    );
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(ae) || customElements.define(
  ae,
  it
);
const de = "r4875g1-charger-switch-control", nt = 1e4;
class st extends m {
  static styles = p`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .control {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--primary-text-color, #212121);
    }

    .control-info {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    .label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
    }

    .value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    button {
      min-height: 2.75rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .switch-button {
      min-width: 6.5rem;
      padding: 0 1rem;
    }

    .switch-button[data-target="true"],
    .confirm[data-target="true"] {
      border-color: var(--success-color, #43a047);
    }

    .switch-button[data-target="false"],
    .confirm[data-target="false"] {
      border-color: var(--error-color, #db4437);
    }

    .message {
      margin-top: 0.75rem;
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
    }

    .dialog-backdrop {
      display: grid;
      place-items: center;
      margin-top: 0.75rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: color-mix(
        in srgb,
        var(--card-background-color, #ffffff) 55%,
        #000000 45%
      );
    }

    .dialog {
      display: grid;
      gap: 1rem;
      width: min(100%, 28rem);
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .dialog-title {
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
    }

    .dialog-text {
      margin: 0;
      color: var(--secondary-text-color, #727272);
      line-height: 1.4;
      text-align: center;
    }

    .dialog-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }
  `;
  chargerStore = null;
  chargerState = null;
  executeControl = null;
  unsubscribe = null;
  controlRole = "";
  controlLabel = "";
  confirmationTarget = null;
  pendingTarget = null;
  pendingTimeout = null;
  commandError = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    e !== this.executeControl && (this.executeControl = e, this.requestUpdate());
  }
  get role() {
    return this.controlRole;
  }
  set role(e) {
    e !== this.controlRole && (this.controlRole = e, this.resetInteraction(), this.requestUpdate());
  }
  get label() {
    return this.controlLabel;
  }
  set label(e) {
    e !== this.controlLabel && (this.controlLabel = e, this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), this.confirmationTarget = null, this.clearPendingTarget(), super.disconnectedCallback();
  }
  render() {
    const e = this.chargerState?.roles[this.controlRole], t = this.switchMetadata(), r = this.observedState(), i = r === null ? null : !r, s = e?.available === !0 && t?.available === !0 && i !== null && this.executeControl !== null && this.pendingTarget === null;
    return a`
      <div class="control">
        <div class="control-info">
          <span class="label">${this.controlLabel}</span>
          <span class="value">
            ${r === null ? "unavailable" : r ? "ON" : "OFF"}
          </span>
        </div>
        <button
          class="switch-button"
          data-target=${i === null ? "" : String(i)}
          ?disabled=${!s}
          @click=${() => this.openConfirmation(i)}
        >
          ${this.pendingTarget !== null ? `SETTING ${this.pendingTarget ? "ON" : "OFF"}...` : i === null ? "UNAVAILABLE" : `SET ${i ? "ON" : "OFF"}`}
        </button>
      </div>

      ${this.commandError !== null ? a`<div class="message">${this.commandError}</div>` : ""}

      ${this.confirmationTarget !== null ? this.renderConfirmation(this.confirmationTarget) : ""}
    `;
  }
  renderConfirmation(e) {
    return a`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-switch-dialog-title"
        >
          <div
            id="charger-switch-dialog-title"
            class="dialog-title"
          >
            ${this.controlLabel}: ${e ? "ON" : "OFF"}
          </div>

          <p class="dialog-text">
            Set ${this.controlLabel} to ${e ? "ON" : "OFF"}?
          </p>

          <div class="dialog-actions">
            <button @click=${this.cancelConfirmation}>CANCEL</button>
            <button
              class="confirm"
              data-target=${String(e)}
              @click=${this.confirmSwitchChange}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    `;
  }
  switchMetadata() {
    const e = this.chargerState?.roles[this.controlRole]?.control;
    return e?.action === "set_switch" ? e : null;
  }
  observedState() {
    const e = this.chargerState?.roles[this.controlRole];
    return e?.available !== !0 ? null : e.state === "on" ? !0 : e.state === "off" ? !1 : null;
  }
  openConfirmation(e) {
    const t = this.switchMetadata();
    e === null || t?.available !== !0 || this.executeControl === null || this.pendingTarget !== null || (this.confirmationTarget = e, this.commandError = null, this.requestUpdate());
  }
  cancelConfirmation = () => {
    this.confirmationTarget = null, this.requestUpdate();
  };
  confirmSwitchChange = async () => {
    const e = this.confirmationTarget, t = this.switchMetadata(), r = this.executeControl;
    if (!(e === null || t?.available !== !0 || r === null || this.pendingTarget !== null)) {
      this.confirmationTarget = null, this.pendingTarget = e, this.commandError = null, this.startPendingTimeout(e), this.requestUpdate();
      try {
        await r(this.controlRole, e);
      } catch (i) {
        if (this.pendingTarget !== e)
          return;
        this.clearPendingTarget(), this.commandError = i instanceof Error ? i.message : String(i), this.requestUpdate();
        return;
      }
      this.checkPendingCompletion(), this.requestUpdate();
    }
  };
  checkPendingCompletion() {
    const e = this.pendingTarget;
    e !== null && this.observedState() === e && this.clearPendingTarget();
  }
  startPendingTimeout(e) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingTarget === e && (this.clearPendingTarget(), this.commandError = `Controller state did not confirm ${e ? "ON" : "OFF"} within 10 seconds.`, this.requestUpdate());
    }, nt);
  }
  clearPendingTarget() {
    this.pendingTarget = null, this.clearPendingTimeout();
  }
  clearPendingTimeout() {
    this.pendingTimeout !== null && (clearTimeout(this.pendingTimeout), this.pendingTimeout = null);
  }
  resetInteraction() {
    this.confirmationTarget = null, this.commandError = null, this.clearPendingTarget();
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.checkPendingCompletion(), this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(de) || customElements.define(
  de,
  st
);
const ue = "r4875g1-cooling-status", ot = [
  {
    label: "Compartment temperature",
    role: "cooling.compartment.temperature"
  },
  {
    label: "Compartment humidity",
    role: "cooling.compartment.humidity"
  },
  {
    label: "Sea-level pressure",
    role: "cooling.compartment.sea_level_pressure"
  }
], at = [
  { label: "Automatic mode", role: "cooling.external.automatic" },
  { label: "Fan power", role: "cooling.external.power" }
], lt = [
  { label: "Actual PWM", role: "cooling.external.actual_pwm" },
  {
    label: "Controller temperature",
    role: "cooling.external.controller_temperature"
  },
  { label: "Fan 1 speed", role: "cooling.external.fan.1.rpm" },
  { label: "Fan 2 speed", role: "cooling.external.fan.2.rpm" },
  { label: "Fan 3 speed", role: "cooling.external.fan.3.rpm" }
];
class ct extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      display: grid;
      gap: 0.75rem;
    }

    .section-heading {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .panel {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    .panel-heading {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: baseline;
      justify-content: space-between;
    }

    .panel-title {
      font-weight: 600;
    }

    .capability-status {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .subheading {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .controls {
      display: grid;
      gap: 0.5rem;
    }

    .controls > r4875g1-charger-number-control,
    .controls > r4875g1-charger-switch-control {
      margin-top: 0;
    }

    .message {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--secondary-text-color, #727272);
    }
  `;
  chargerStore = null;
  chargerState = null;
  unsubscribe = null;
  executeControl = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    e !== this.executeControl && (this.executeControl = e, this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    if (this.chargerState === null)
      return a`
        <section class="section">
          <h2 class="section-heading">Cooling</h2>
          <div class="message">Waiting for cooling data…</div>
        </section>
      `;
    const e = this.chargerState.capabilities.cooling_environment, t = this.chargerState.capabilities.external_cooling;
    return a`
      <section class="section">
        <h2 class="section-heading">Cooling</h2>

        ${e?.available === !0 ? this.renderPanel(
      "Compartment environment",
      ot
    ) : a`
              <div class="message">
                Cooling environment capability is unavailable.
              </div>
            `}

        ${t !== void 0 && t.status !== "unavailable" ? this.renderExternalCoolingPanel(t.status) : ""}
      </section>
    `;
  }
  renderExternalCoolingPanel(e) {
    return a`
      <section class="panel">
        <div class="panel-heading">
          <span class="panel-title">External cooling</span>
          <span class="capability-status">${e}</span>
        </div>

        <div class="subheading">Controls</div>
        <div class="controls">
          ${at.map(({ label: t, role: r }) => a`
            <r4875g1-charger-switch-control
              .store=${this.chargerStore}
              .execute=${this.executeControl}
              .role=${r}
              .label=${t}
            ></r4875g1-charger-switch-control>
          `)}
          <r4875g1-charger-number-control
            .store=${this.chargerStore}
            .execute=${this.executeControl}
            .role=${"cooling.external.manual_pwm"}
            .label=${"Manual PWM"}
          ></r4875g1-charger-number-control>
        </div>

        <div class="subheading">Telemetry</div>
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${lt}
        ></r4875g1-semantic-metric-grid>
      </section>
    `;
  }
  renderPanel(e, t, r) {
    return a`
      <section class="panel">
        <div class="panel-heading">
          <span class="panel-title">${e}</span>
          ${r !== void 0 ? a`
                <span class="capability-status">${r}</span>
              ` : ""}
        </div>
        <r4875g1-semantic-metric-grid
          .roles=${this.chargerState?.roles ?? {}}
          .metrics=${t}
        ></r4875g1-semantic-metric-grid>
      </section>
    `;
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(ue) || customElements.define(ue, ct);
const he = "r4875g1-power-command-control", dt = 1e4;
class ut extends m {
  static styles = p`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .power-button,
    .dialog-button {
      min-height: 2.75rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .power-button {
      width: 100%;
    }

    .power-button[data-action="start"] {
      border-color: var(--success-color, #43a047);
    }

    .power-button[data-action="stop"] {
      border-color: var(--error-color, #db4437);
    }

    .power-button:disabled,
    .dialog-button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .message {
      margin-top: 0.75rem;
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
    }

    .dialog-backdrop {
      display: grid;
      place-items: center;
      margin-top: 0.75rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: color-mix(
        in srgb,
        var(--card-background-color, #ffffff) 55%,
        #000000 45%
      );
    }

    .dialog {
      display: grid;
      gap: 1rem;
      width: min(100%, 28rem);
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #212121);
    }

    .dialog-title {
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
    }

    .dialog-text {
      margin: 0;
      color: var(--secondary-text-color, #727272);
      line-height: 1.4;
      text-align: center;
    }

    .dialog-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .dialog-button.confirm[data-action="start"] {
      border-color: var(--success-color, #43a047);
    }

    .dialog-button.confirm[data-action="stop"] {
      border-color: var(--error-color, #db4437);
    }
  `;
  controlConfig = null;
  controlState = null;
  executeControl = null;
  confirmationAction = null;
  pendingAction = null;
  pendingTimeout = null;
  commandError = null;
  get config() {
    return this.controlConfig;
  }
  set config(e) {
    e !== this.controlConfig && (this.controlConfig = e, this.requestUpdate());
  }
  get state() {
    return this.controlState;
  }
  set state(e) {
    this.controlState = e, this.checkPendingCompletion(), this.requestUpdate();
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    this.executeControl = e, this.requestUpdate();
  }
  disconnectedCallback() {
    this.confirmationAction = null, this.clearPendingAction(), super.disconnectedCallback();
  }
  render() {
    const e = this.powerPresentation();
    return a`
      <button
        class="power-button"
        data-action=${e.action ?? ""}
        ?disabled=${!e.enabled}
        @click=${() => this.openConfirmation(e.action)}
      >
        ${e.label}
      </button>

      ${this.commandError !== null ? a`<div class="message">${this.commandError}</div>` : ""}

      ${this.confirmationAction !== null ? this.renderConfirmation(this.confirmationAction) : ""}
    `;
  }
  powerPresentation() {
    const e = this.controlConfig, t = this.controlState;
    if (this.pendingAction !== null)
      return {
        action: this.pendingAction,
        enabled: !1,
        label: this.pendingAction === "start" ? "STARTING..." : "STOPPING..."
      };
    if (e === null || t === null || t.action === null)
      return {
        action: null,
        enabled: !1,
        label: t?.unavailableLabel ?? "CONTROL UNAVAILABLE"
      };
    const r = t.action === "start" ? t.startAvailable : t.stopAvailable;
    return {
      action: t.action,
      enabled: r && this.executeControl !== null,
      label: `${t.action === "start" ? "START" : "STOP"} ${e.targetLabel}`
    };
  }
  renderConfirmation(e) {
    const t = this.controlConfig;
    if (t === null)
      return "";
    const r = e === "start";
    return a`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="power-command-dialog-title"
        >
          <div
            id="power-command-dialog-title"
            class="dialog-title"
          >
            ${r ? "START" : "STOP"} ${t.targetLabel}
          </div>

          <p class="dialog-text">
            ${r ? t.startConfirmationText : t.stopConfirmationText}
          </p>

          <div class="dialog-actions">
            <button
              class="dialog-button"
              @click=${this.cancelConfirmation}
            >
              CANCEL
            </button>
            <button
              class="dialog-button confirm"
              data-action=${e}
              @click=${this.confirmPowerCommand}
            >
              ${r ? "START" : "STOP"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  openConfirmation(e) {
    const t = this.controlState;
    e === null || t === null || this.pendingAction !== null || !(e === "start" ? t.startAvailable : t.stopAvailable) || this.executeControl === null || (this.confirmationAction = e, this.commandError = null, this.requestUpdate());
  }
  cancelConfirmation = () => {
    this.confirmationAction = null, this.requestUpdate();
  };
  confirmPowerCommand = async () => {
    const e = this.confirmationAction, t = this.controlConfig, r = this.executeControl;
    if (e === null || t === null || r === null || this.pendingAction !== null)
      return;
    const i = e === "start" ? t.startRole : t.stopRole;
    this.confirmationAction = null, this.pendingAction = e, this.commandError = null, this.startPendingTimeout(e), this.requestUpdate();
    try {
      await r(i);
    } catch (s) {
      if (this.pendingAction !== e)
        return;
      this.clearPendingAction(), this.commandError = s instanceof Error ? s.message : String(s), this.requestUpdate();
      return;
    }
    this.checkPendingCompletion(), this.requestUpdate();
  };
  checkPendingCompletion() {
    const e = this.pendingAction, t = this.controlState;
    if (e === null || t === null)
      return;
    (e === "start" ? t.startComplete : t.stopComplete) && this.clearPendingAction();
  }
  startPendingTimeout(e) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingAction === e && (this.clearPendingAction(), this.commandError = `Controller state did not confirm the ${e.toUpperCase()} command within 10 seconds.`, this.requestUpdate());
    }, dt);
  }
  clearPendingAction() {
    this.pendingAction = null, this.clearPendingTimeout();
  }
  clearPendingTimeout() {
    this.pendingTimeout !== null && (clearTimeout(this.pendingTimeout), this.pendingTimeout = null);
  }
}
customElements.get(he) || customElements.define(
  he,
  ut
);
const ge = "r4875g1-rectifier-details", ht = [1, 2, 3], gt = {
  1: L(1),
  2: L(2),
  3: L(3)
}, mt = [
  {
    title: "Status",
    metrics: [
      { label: "CAN communication", suffix: "connected" },
      { label: "Lifecycle", suffix: "lifecycle" },
      { label: "Power state", suffix: "power_state" },
      { label: "Thermal state", suffix: "thermal_state" }
    ]
  },
  {
    title: "AC input",
    metrics: [
      { label: "Voltage", suffix: "ac.voltage" },
      { label: "Current", suffix: "ac.current" },
      { label: "Power", suffix: "ac.power" },
      { label: "Frequency", suffix: "ac.frequency" }
    ]
  },
  {
    title: "DC output",
    metrics: [
      { label: "Voltage", suffix: "dc.voltage" },
      { label: "Current", suffix: "dc.current" },
      { label: "Power", suffix: "dc.power" },
      {
        label: "Reported current setpoint",
        suffix: "dc.current_setpoint_reported"
      },
      { label: "Maximum capability", suffix: "max_current_capability" }
    ]
  },
  {
    title: "Thermal and fan",
    metrics: [
      { label: "Input temperature", suffix: "temperature.input" },
      { label: "Output temperature", suffix: "temperature.output" },
      { label: "Fan speed", suffix: "fan.rpm" },
      { label: "Minimum fan duty", suffix: "fan.minimum_duty" },
      { label: "Target fan duty", suffix: "fan.target_duty" }
    ]
  },
  {
    title: "Lifetime",
    metrics: [
      { label: "Operating hours", suffix: "operating_hours" }
    ]
  }
];
class pt extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      display: grid;
      gap: 0.75rem;
    }

    .section-heading {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .units {
      display: grid;
      gap: 0.75rem;
    }

    details {
      overflow: hidden;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      background: var(--card-background-color, #ffffff);
    }

    summary {
      display: grid;
      grid-template-columns: minmax(5rem, auto) 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 0.85rem 1rem;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::after {
      content: "›";
      grid-column: 3;
      color: var(--secondary-text-color, #727272);
      font-size: 1.3rem;
      line-height: 1;
      transform: rotate(90deg);
      transition: transform 120ms ease;
    }

    details[open] summary::after {
      transform: rotate(-90deg);
    }

    .unit-name {
      font-weight: 600;
    }

    .summary-values {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      min-width: 0;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
    }

    .summary-value {
      white-space: nowrap;
    }

    .groups {
      display: grid;
      gap: 1rem;
      padding: 0 1rem 1rem;
      border-top: 1px solid var(--divider-color, #d0d0d0);
    }

    .unit-control {
      padding-top: 1rem;
    }

    .group {
      display: grid;
      gap: 0.5rem;
      padding-top: 1rem;
    }

    .group-title {
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      gap: 0.5rem;
    }

    .metric {
      display: grid;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.65rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
    }

    .metric-label {
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
    }

    .metric-value {
      overflow-wrap: anywhere;
      font-weight: 600;
    }

    .metric-unit {
      margin-left: 0.25rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.8rem;
      font-weight: 400;
    }

    .message {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--secondary-text-color, #727272);
    }

    @media (max-width: 600px) {
      summary {
        grid-template-columns: 1fr auto;
      }

      summary::after {
        grid-column: 2;
        grid-row: 1;
      }

      .summary-values {
        grid-column: 1 / -1;
      }
    }
  `;
  chargerStore = null;
  chargerState = null;
  executeControl = null;
  unsubscribe = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    this.executeControl = e, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return this.chargerState === null ? a`
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">Waiting for rectifier data…</div>
        </section>
      ` : this.chargerState.capabilities.rectifier_detail?.available !== !0 ? a`
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">
            Rectifier detail capability is unavailable.
          </div>
        </section>
      ` : a`
      <section class="section">
        <h2 class="section-heading">Rectifiers</h2>
        <div class="units">
          ${ht.map((t) => this.renderUnit(t))}
        </div>
      </section>
    `;
  }
  renderUnit(e) {
    return a`
      <details>
        <summary>
          <span class="unit-name">Unit ${e}</span>
          <span class="summary-values">
            ${this.renderSummaryValue(e, "connected", "CAN")}
            ${this.renderSummaryValue(e, "power_state", "Power")}
            ${this.renderSummaryValue(e, "dc.power", "DC")}
            ${this.renderSummaryValue(e, "temperature.output", "Output")}
          </span>
        </summary>
        <div class="groups">
          <div class="unit-control">
            <r4875g1-power-command-control
              .config=${gt[e]}
              .state=${this.powerCommandState(e)}
              .execute=${this.executeControl}
            ></r4875g1-power-command-control>
          </div>
          ${mt.map(({ title: t, metrics: r }) => a`
            <section class="group">
              <div class="group-title">${t}</div>
              <div class="metrics">
                ${r.map(
      ({ label: i, suffix: s }) => this.renderMetric(e, i, s)
    )}
              </div>
            </section>
          `)}
        </div>
      </details>
    `;
  }
  powerCommandState(e) {
    const t = `rectifier.${e}`, r = this.chargerState?.roles[`${t}.power_state`], i = r?.available === !0 ? r.state : null, s = `${t}.command.start`, o = `${t}.command.stop`;
    let c = null, l = `RECTIFIER ${e} STATE UNAVAILABLE`;
    return i === "OFF" ? c = "start" : i === "ON" ? c = "stop" : i !== null && i.trim() !== "" && (l = `RECTIFIER ${e} ${i}`), {
      action: c,
      startAvailable: this.chargerState?.roles[s]?.control?.available === !0,
      stopAvailable: this.chargerState?.roles[o]?.control?.available === !0,
      startComplete: i === "ON",
      stopComplete: i === "OFF",
      unavailableLabel: l
    };
  }
  renderSummaryValue(e, t, r) {
    const i = this.getDisplayValue(e, t);
    return a`
      <span class="summary-value">
        ${r}: ${i.value}${i.unit !== null ? a` ${i.unit}` : ""}
      </span>
    `;
  }
  renderMetric(e, t, r) {
    const i = this.getDisplayValue(e, r);
    return a`
      <div class="metric">
        <span class="metric-label">${t}</span>
        <span class="metric-value">
          ${i.value}${i.unit !== null ? a`<span class="metric-unit">${i.unit}</span>` : ""}
        </span>
      </div>
    `;
  }
  getDisplayValue(e, t) {
    return W(
      this.chargerState?.roles[`rectifier.${e}.${t}`]
    );
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(ge) || customElements.define(ge, pt);
function L(n) {
  return {
    targetLabel: `RECTIFIER ${n}`,
    startRole: `rectifier.${n}.command.start`,
    stopRole: `rectifier.${n}.command.stop`,
    startConfirmationText: `Start Rectifier ${n}? All individual safety checks will be applied by the Charger Controller.`,
    stopConfirmationText: `Stop Rectifier ${n}?`
  };
}
const me = "r4875g1-charger-setpoint-controls", ft = [
  {
    role: "charger.ac.current_limit",
    label: "AC current limit"
  },
  {
    role: "charger.dc.voltage_setpoint",
    label: "DC voltage limit"
  },
  {
    role: "charger.dc.sum_power_setpoint",
    label: "DC sum power"
  }
], bt = [
  {
    role: "charger.fallback.voltage_setpoint",
    label: "Fallback DC voltage"
  },
  {
    role: "charger.fallback.current_setpoint",
    label: "Fallback DC current"
  }
];
class vt extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .section {
      padding: 1rem;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 0.75rem;
      color: var(--primary-text-color, #212121);
    }

    .section + .section {
      margin-top: 1rem;
    }

    .section-title {
      margin-bottom: 0.25rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .section-description {
      margin-bottom: 0.75rem;
      color: var(--secondary-text-color, #727272);
      font-size: 0.85rem;
      line-height: 1.4;
    }

    details.section {
      padding: 0;
    }

    summary {
      min-height: 2.75rem;
      padding: 0.75rem 1rem;
      box-sizing: border-box;
      cursor: pointer;
      font-weight: 600;
    }

    .fallback-content {
      padding: 0 1rem 1rem;
    }
  `;
  chargerStore = null;
  executeControl = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.chargerStore = e, this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    e !== this.executeControl && (this.executeControl = e, this.requestUpdate());
  }
  render() {
    return a`
      <section class="section">
        <div class="section-title">Operational setpoints</div>
        <div class="section-description">
          Normal Charger operating limits and targets.
        </div>
        ${ft.map(
      ({ role: e, label: t }) => this.renderNumberControl(e, t)
    )}
      </section>

      <details class="section">
        <summary>Fallback settings</summary>
        <div class="fallback-content">
          <div class="section-description">
            Rectifier fallback voltage and current settings.
          </div>
          ${bt.map(
      ({ role: e, label: t }) => this.renderNumberControl(e, t)
    )}
        </div>
      </details>
    `;
  }
  renderNumberControl(e, t) {
    return a`
      <r4875g1-charger-number-control
        .store=${this.chargerStore}
        .execute=${this.executeControl}
        .role=${e}
        .label=${t}
      ></r4875g1-charger-number-control>
    `;
  }
}
customElements.get(me) || customElements.define(
  me,
  vt
);
const pe = "r4875g1-charger-power-control", Se = "charger.command.start", _e = "charger.command.stop", yt = {
  targetLabel: "CHARGER",
  startRole: Se,
  stopRole: _e,
  startConfirmationText: "Start all available and ready rectifier units? Safety checks are applied individually by the Charger Controller before startup.",
  stopConfirmationText: "Stop all rectifier units?"
};
class $t extends m {
  static styles = p`
    :host {
      display: block;
      margin-top: 1rem;
    }
  `;
  chargerStore = null;
  chargerState = null;
  executeControl = null;
  unsubscribe = null;
  get store() {
    return this.chargerStore;
  }
  set store(e) {
    e !== this.chargerStore && (this.detachStore(), this.chargerStore = e, this.chargerState = e?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(e) {
    this.executeControl = e, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return a`
      <r4875g1-power-command-control
        .config=${yt}
        .state=${this.powerCommandState()}
        .execute=${this.executeControl}
      ></r4875g1-power-command-control>
    `;
  }
  powerCommandState() {
    const e = this.rectifierCount("charger.available_units"), t = this.rectifierCount("charger.running_units");
    return e === null || t === null ? {
      action: null,
      startAvailable: !1,
      stopAvailable: !1,
      startComplete: !1,
      stopComplete: !1,
      unavailableLabel: "CHARGER STATE UNAVAILABLE"
    } : e < 1 ? {
      action: null,
      startAvailable: !1,
      stopAvailable: !1,
      startComplete: !1,
      stopComplete: t <= 0,
      unavailableLabel: "NO RECTIFIERS"
    } : {
      action: t > 0 ? "stop" : "start",
      startAvailable: this.chargerState?.roles[Se]?.control?.available === !0,
      stopAvailable: this.chargerState?.roles[_e]?.control?.available === !0,
      startComplete: t >= e,
      stopComplete: t <= 0,
      unavailableLabel: "CHARGER STATE UNAVAILABLE"
    };
  }
  rectifierCount(e) {
    const t = this.chargerState?.roles[e];
    if (t?.available !== !0 || t.state === null)
      return null;
    const r = Number(t.state);
    return Number.isFinite(r) ? r : null;
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((e) => {
      this.chargerState = e, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(pe) || customElements.define(
  pe,
  $t
);
function Ct(n) {
  const e = window.customCards ??= [];
  e.some(({ type: t }) => t === n.type) || e.push(n);
}
const q = "r4875g1-charger-overview-card";
class St extends m {
  static getStubConfig() {
    return {};
  }
  static styles = p`
    :host {
      display: block;
    }

    ha-card {
      padding: 1rem;
    }

    .heading {
      margin: 0 0 1rem;
      color: var(--primary-text-color, #212121);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .error {
      padding: 1rem;
      border-radius: 0.75rem;
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #ffffff);
    }
  `;
  chargerStore = new Te();
  homeAssistant = null;
  config = null;
  connectedConnection = null;
  connectedConfigEntryId = null;
  discoveredConnection = null;
  discoveredConfigEntryId = null;
  connectionGeneration = 0;
  connectionError = null;
  get hass() {
    return this.homeAssistant;
  }
  set hass(e) {
    this.homeAssistant = e, this.connectIfReady(), this.requestUpdate();
  }
  setConfig(e) {
    if (e.config_entry_id !== void 0 && (typeof e.config_entry_id != "string" || e.config_entry_id.trim() === ""))
      throw new Error("config_entry_id must be a non-empty string");
    this.config = {
      ...e,
      config_entry_id: e.config_entry_id?.trim()
    }, this.discoveredConnection = null, this.discoveredConfigEntryId = null, this.connectIfReady(), this.requestUpdate();
  }
  getCardSize() {
    return 15;
  }
  connectedCallback() {
    super.connectedCallback(), this.connectIfReady();
  }
  disconnectedCallback() {
    this.connectionGeneration += 1, this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.discoveredConnection = null, this.discoveredConfigEntryId = null, super.disconnectedCallback();
  }
  render() {
    return this.connectionError !== null ? a`
        <ha-card>
          <div class="heading">R4875G1 Charger</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      ` : a`
      <ha-card>
        <div class="heading">R4875G1 Charger</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
        <r4875g1-advanced-charger-status
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-advanced-charger-status>
        <r4875g1-rectifier-details
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-rectifier-details>
        <r4875g1-cooling-status
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-cooling-status>
        <r4875g1-charger-setpoint-controls
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-charger-setpoint-controls>
        <r4875g1-charger-power-control
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-charger-power-control>
      </ha-card>
    `;
  }
  async connectIfReady() {
    if (!this.isConnected || this.homeAssistant === null || this.config === null)
      return;
    const e = ++this.connectionGeneration, t = this.homeAssistant.connection;
    try {
      const r = await this.resolveConfigEntryId(
        this.homeAssistant
      );
      if (e !== this.connectionGeneration || this.connectedConnection === t && this.connectedConfigEntryId === r)
        return;
      this.connectedConnection = t, this.connectedConfigEntryId = r, this.connectionError = null, this.requestUpdate(), await this.chargerStore.connect(
        this.homeAssistant,
        r
      );
    } catch (r) {
      if (e !== this.connectionGeneration)
        return;
      this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.connectionError = r instanceof Error ? r.message : String(r), this.requestUpdate();
      return;
    }
    e === this.connectionGeneration && this.requestUpdate();
  }
  executeControl = (e, t) => this.homeAssistant === null || this.connectedConfigEntryId === null ? Promise.reject(
    new Error("Charger Instance is not connected")
  ) : Ae(
    this.homeAssistant,
    this.connectedConfigEntryId,
    e,
    t
  );
  async resolveConfigEntryId(e) {
    const t = this.config?.config_entry_id;
    if (t !== void 0)
      return t;
    if (this.discoveredConnection === e.connection && this.discoveredConfigEntryId !== null)
      return this.discoveredConfigEntryId;
    const r = await xe(e);
    if (r.instances.length === 0)
      throw new Error("No R4875G1 Charger Instance is available");
    if (r.instances.length > 1)
      throw new Error(
        "Multiple R4875G1 Charger Instances found; configure config_entry_id"
      );
    const i = r.instances[0].config_entry_id;
    return this.discoveredConnection = e.connection, this.discoveredConfigEntryId = i, i;
  }
}
customElements.get(q) || customElements.define(q, St);
Ct({
  type: q,
  name: "R4875G1 Charger",
  description: "Control and monitor an R4875G1 Charger",
  preview: !0
});
const _t = "R4875G1 Charger Dashboard";
console.info(`[${_t}] frontend bootstrap loaded`);
export {
  ae as ADVANCED_CHARGER_STATUS_TAG,
  it as AdvancedChargerStatus,
  se as CHARGER_NUMBER_CONTROL_TAG,
  q as CHARGER_OVERVIEW_CARD_TAG,
  pe as CHARGER_POWER_CONTROL_TAG,
  me as CHARGER_SETPOINT_CONTROLS_TAG,
  ie as CHARGER_STATUS_TAG,
  de as CHARGER_SWITCH_CONTROL_TAG,
  ue as COOLING_STATUS_TAG,
  tt as ChargerNumberControl,
  St as ChargerOverviewCard,
  $t as ChargerPowerControl,
  vt as ChargerSetpointControls,
  Ye as ChargerStatusPreview,
  Te as ChargerStore,
  st as ChargerSwitchControl,
  ct as CoolingStatus,
  _t as DASHBOARD_NAME,
  ge as RECTIFIER_DETAILS_TAG,
  pt as RectifierDetails,
  Ae as controlChargerRole,
  xt as getChargerInstance,
  xe as listChargerInstances,
  we as reduceChargerSubscriptionEvent,
  Ee as subscribeChargerInstance
};
