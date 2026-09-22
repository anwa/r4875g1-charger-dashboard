function vt(n) {
  return n.callWS({
    type: "r4875g1_charger/instances"
  });
}
function ue(n, t) {
  return n.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: t
  });
}
function $t(n, t, e, r) {
  const i = {
    type: "r4875g1_charger/control",
    config_entry_id: t,
    role: e
  };
  return r !== void 0 && (i.value = r), n.callWS(i);
}
function yt(n, t, e) {
  return n.connection.subscribeMessage(
    e,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: t
    }
  );
}
function Ct(n, t) {
  switch (t.event) {
    case "snapshot":
    case "mapping_changed":
      return t.data;
    case "role_state": {
      if (n === null)
        return n;
      const e = n.roles[t.role];
      return {
        ...t.instance ?? n,
        roles: {
          ...n.roles,
          [t.role]: {
            ...e,
            ...t.data
          }
        }
      };
    }
    case "mapping_error":
      return n;
  }
}
class _t {
  currentState = null;
  backendUnsubscribe = null;
  generation = 0;
  listeners = /* @__PURE__ */ new Set();
  get state() {
    return this.currentState;
  }
  subscribe(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  async connect(t, e) {
    this.disconnect();
    const r = this.generation, i = await yt(
      t,
      e,
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
  applyEvent(t) {
    const e = Ct(
      this.currentState,
      t
    );
    e !== this.currentState && (this.currentState = e, this.notify());
  }
  notify() {
    for (const t of this.listeners)
      t(this.currentState);
  }
}
const U = globalThis, H = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = /* @__PURE__ */ Symbol(), B = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (H && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = B.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && B.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const St = (n) => new ct(typeof n == "string" ? n : n + "", void 0, q), C = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((r, i, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[s + 1], n[0]);
  return new ct(e, n, q);
}, At = (n, t) => {
  if (H) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = U.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, n.appendChild(r);
  }
}, j = H ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return St(e);
})(n) : n;
const { is: Et, defineProperty: xt, getOwnPropertyDescriptor: wt, getOwnPropertyNames: Rt, getOwnPropertySymbols: Tt, getPrototypeOf: Pt } = Object, I = globalThis, W = I.trustedTypes, kt = W ? W.emptyScript : "", Ut = I.reactiveElementPolyfillSupport, x = (n, t) => n, V = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? kt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, ut = (n, t) => !Et(n, t), K = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: ut };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let _ = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = K) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && xt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: s } = wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const c = i?.call(this);
      s?.call(this, o), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? K;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const t = Pt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const e = this.properties, r = [...Rt(e), ...Tt(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(j(i));
    } else t !== void 0 && e.push(j(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : V).toAttribute(e, r.type);
      this._$Em = t, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const s = r.getPropertyOptions(i), o = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : V;
      this._$Em = i;
      const c = o.fromAttribute(e, s.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, s) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (s = this[t]), r ??= o.getPropertyOptions(t), !((r.hasChanged ?? ut)(s, e) || r.useDefault && r.reflect && s === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: s }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), s !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[x("elementProperties")] = /* @__PURE__ */ new Map(), _[x("finalized")] = /* @__PURE__ */ new Map(), Ut?.({ ReactiveElement: _ }), (I.reactiveElementVersions ??= []).push("2.1.2");
const G = globalThis, Z = (n) => n, O = G.trustedTypes, J = O ? O.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, dt = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + b, Ot = `<${ht}>`, y = document, w = () => y.createComment(""), R = (n) => n === null || typeof n != "object" && typeof n != "function", z = Array.isArray, It = (n) => z(n) || typeof n?.[Symbol.iterator] == "function", M = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, X = />/g, v = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Y = /'/g, tt = /"/g, pt = /^(?:script|style|textarea|title)$/i, Nt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), l = Nt(1), S = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), et = /* @__PURE__ */ new WeakMap(), $ = y.createTreeWalker(y, 129);
function mt(n, t) {
  if (!z(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return J !== void 0 ? J.createHTML(t) : t;
}
const Mt = (n, t) => {
  const e = n.length - 1, r = [];
  let i, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let c = 0; c < e; c++) {
    const a = n[c];
    let d, p, u = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, p = o.exec(a), p !== null); ) g = o.lastIndex, o === E ? p[1] === "!--" ? o = Q : p[1] !== void 0 ? o = X : p[2] !== void 0 ? (pt.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = v) : p[3] !== void 0 && (o = v) : o === v ? p[0] === ">" ? (o = i ?? E, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? v : p[3] === '"' ? tt : Y) : o === tt || o === Y ? o = v : o === Q || o === X ? o = E : (o = v, i = void 0);
    const f = o === v && n[c + 1].startsWith("/>") ? " " : "";
    s += o === E ? a + Ot : u >= 0 ? (r.push(d), a.slice(0, u) + dt + a.slice(u) + b + f) : a + b + (u === -2 ? c : f);
  }
  return [mt(n, s + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class T {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Mt(t, e);
    if (this.el = T.createElement(d, r), $.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = $.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(dt)) {
          const g = p[o++], f = i.getAttribute(u).split(b), k = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: s, name: k[2], strings: f, ctor: k[1] === "." ? Vt : k[1] === "?" ? Dt : k[1] === "@" ? Ht : N }), i.removeAttribute(u);
        } else u.startsWith(b) && (a.push({ type: 6, index: s }), i.removeAttribute(u));
        if (pt.test(i.tagName)) {
          const u = i.textContent.split(b), g = u.length - 1;
          if (g > 0) {
            i.textContent = O ? O.emptyScript : "";
            for (let f = 0; f < g; f++) i.append(u[f], w()), $.nextNode(), a.push({ type: 2, index: ++s });
            i.append(u[g], w());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ht) a.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(b, u + 1)) !== -1; ) a.push({ type: 7, index: s }), u += b.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const r = y.createElement("template");
    return r.innerHTML = t, r;
  }
}
function A(n, t, e = n, r) {
  if (t === S) return t;
  let i = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const s = R(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== s && (i?._$AO?.(!1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, e, r)), r !== void 0 ? (e._$Co ??= [])[r] = i : e._$Cl = i), i !== void 0 && (t = A(n, i._$AS(n, t.values), i, r)), t;
}
class Lt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: r } = this._$AD, i = (t?.creationScope ?? y).importNode(e, !0);
    $.currentNode = i;
    let s = $.nextNode(), o = 0, c = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new P(s, s.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(s, a.name, a.strings, this, t) : a.type === 6 && (d = new qt(s, this, t)), this._$AV.push(d), a = r[++c];
      }
      o !== a?.index && (s = $.nextNode(), o++);
    }
    return $.currentNode = y, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class P {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = A(this, t, e), R(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = T.createElement(mt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const s = new Lt(i, this), o = s.u(this.options);
      s.p(e), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = et.get(t.strings);
    return e === void 0 && et.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const s of t) i === e.length ? e.push(r = new P(this.O(w()), this.O(w()), this, this.options)) : r = e[i], r._$AI(s), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = Z(t).nextSibling;
      Z(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class N {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, s) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(t, e = this, r, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = A(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = s[0], a = 0; a < s.length - 1; a++) d = A(this, c[r + a], e, a), d === S && (d = this._$AH[a]), o ||= !R(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + s[a + 1]), this._$AH[a] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Vt extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Dt extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Ht extends N {
  constructor(t, e, r, i, s) {
    super(t, e, r, i, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? h) === S) return;
    const r = this._$AH, i = t === h && r !== h || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== h && (r === h || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Gt = G.litHtmlPolyfillSupport;
Gt?.(T, P), (G.litHtmlVersions ??= []).push("3.3.3");
const zt = (n, t, e) => {
  const r = e?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = e?.renderBefore ?? null;
    r._$litPart$ = i = new P(t.insertBefore(w(), s), s, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
const F = globalThis;
class m extends _ {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
m._$litElement$ = !0, m.finalized = !0, F.litElementHydrateSupport?.({ LitElement: m });
const Ft = F.litElementPolyfillSupport;
Ft?.({ LitElement: m });
(F.litElementVersions ??= []).push("4.2.2");
function gt(n) {
  return n?.available !== !0 ? {
    available: !1,
    value: "unavailable",
    unit: null
  } : {
    available: !0,
    value: Bt(n.state),
    unit: n.unit ?? null
  };
}
function Bt(n) {
  if (n === null)
    return "unavailable";
  const t = Number(n);
  return Number.isFinite(t) ? new Intl.NumberFormat(void 0, {
    maximumFractionDigits: 2,
    useGrouping: !1
  }).format(t) : n;
}
const rt = "r4875g1-charger-status", it = 3, jt = [
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
class Wt extends m {
  static styles = C`
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
  set store(t) {
    t !== this.chargerStore && (this.detachStore(), this.chargerStore = t, this.chargerState = t?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return this.chargerState === null ? l`
        <div class="status">
          <div class="value">Waiting for Charger Instance data…</div>
        </div>
      ` : l`
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
          ${jt.map(
      ({ label: t, role: e }) => this.renderMetric(t, e)
    )}
        </div>
      </div>
    `;
  }
  renderRectifierStatus() {
    const t = this.chargerState?.roles["charger.available_units"], e = this.chargerState?.roles["charger.running_units"];
    return l`
      <div class="unit-status">
        <div class="unit-status-row">
          <span class="label">Available rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(t?.state)}
            / ${it}
          </span>
        </div>
        <div class="unit-status-row">
          <span class="label">Running rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(e?.state)}
            / ${it}
          </span>
        </div>
      </div>
    `;
  }
  formatRectifierCount(t) {
    if (t == null)
      return "-";
    const e = Number(t);
    return Number.isFinite(e) ? Math.trunc(e).toString() : "-";
  }
  renderMetric(t, e) {
    const r = gt(this.chargerState?.roles[e]);
    return l`
      <div class="metric">
        <span class="metric-label">${t}</span>
        <span class="metric-value">
          ${r.value}${r.unit !== null ? l`<span class="metric-unit">${r.unit}</span>` : ""}
        </span>
      </div>
    `;
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((t) => {
      this.chargerState = t, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(rt) || customElements.define(rt, Wt);
const nt = "r4875g1-charger-number-control", Kt = 1e4;
class Zt extends m {
  static styles = C`
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
  set store(t) {
    t !== this.chargerStore && (this.detachStore(), this.chargerStore = t, this.chargerState = t?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(t) {
    this.executeControl = t, this.requestUpdate();
  }
  get role() {
    return this.controlRole;
  }
  set role(t) {
    t !== this.controlRole && (this.controlRole = t, this.resetInteraction(), this.requestUpdate());
  }
  get label() {
    return this.controlLabel;
  }
  set label(t) {
    t !== this.controlLabel && (this.controlLabel = t, this.requestUpdate());
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), this.clearPendingTimeout(), super.disconnectedCallback();
  }
  render() {
    const t = this.chargerState?.roles[this.controlRole], e = this.numberMetadata(), r = t?.available === !0 ? this.formatDisplayValue(t.state) : "unavailable", i = e?.unit ?? t?.unit ?? null, s = t?.available === !0 && e?.available === !0 && this.executeControl !== null && this.pendingTarget === null;
    return l`
      <div class="control">
        <div class="control-info">
          <span class="label">${this.controlLabel}</span>
          <span class="value">
            ${r}${i !== null ? l`<span class="unit">${i}</span>` : ""}
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

      ${this.commandError !== null ? l`<div class="message">${this.commandError}</div>` : ""}

      ${this.dialogOpen && e !== null ? this.renderDialog(e) : ""}
    `;
  }
  renderDialog(t) {
    const e = this.validationError(t);
    return l`
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
              @click=${() => this.adjustValue(-1, t)}
            >
              −
            </button>
            <input
              type="number"
              .value=${this.inputValue()}
              min=${t.min ?? ""}
              max=${t.max ?? ""}
              step=${t.step ?? "any"}
              @input=${this.handleInput}
            />
            <button
              aria-label="Increase"
              @click=${() => this.adjustValue(1, t)}
            >
              +
            </button>
          </div>

          <div class="range">
            ${this.rangeText(t)}
          </div>

          ${e !== null ? l`<div class="message">${e}</div>` : ""}

          <div class="dialog-actions">
            <button @click=${this.cancelDialog}>CANCEL</button>
            <button
              class="save"
              ?disabled=${e !== null}
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
    const t = this.chargerState?.roles[this.controlRole]?.control;
    return t?.action === "set_value" ? t : null;
  }
  openDialog = () => {
    const t = this.chargerState?.roles[this.controlRole], e = this.numberMetadata();
    if (t?.available !== !0 || e?.available !== !0 || t.state === null || this.pendingTarget !== null)
      return;
    const r = Number(t.state);
    Number.isFinite(r) && (this.editValue = r, this.dialogOpen = !0, this.commandError = null, this.requestUpdate());
  };
  cancelDialog = () => {
    this.dialogOpen = !1, this.editValue = null, this.requestUpdate();
  };
  handleInput = (t) => {
    const r = t.currentTarget.value.trim();
    this.editValue = r === "" ? null : Number(r), this.requestUpdate();
  };
  adjustValue(t, e) {
    if (this.editValue === null)
      return;
    const r = typeof e.step == "number" && e.step > 0 ? e.step : 1, i = typeof e.min == "number" ? e.min : 0;
    let s = this.editValue + t * r;
    typeof e.min == "number" && (s = Math.max(e.min, s)), typeof e.max == "number" && (s = Math.min(e.max, s));
    const o = Math.round((s - i) / r), c = this.stepPrecision(r);
    this.editValue = Number(
      (i + o * r).toFixed(c)
    ), this.requestUpdate();
  }
  validationError(t) {
    const e = this.editValue;
    return e === null || !Number.isFinite(e) ? "Enter a valid numeric value." : typeof t.min == "number" && e < t.min ? `Minimum value is ${t.min}.` : typeof t.max == "number" && e > t.max ? `Maximum value is ${t.max}.` : null;
  }
  saveValue = async () => {
    const t = this.executeControl, e = this.numberMetadata(), r = this.editValue;
    if (!(t === null || e === null || e.available !== !0 || r === null || this.validationError(e) !== null || this.pendingTarget !== null)) {
      this.dialogOpen = !1, this.editValue = null, this.pendingTarget = r, this.commandError = null, this.startPendingTimeout(r), this.requestUpdate();
      try {
        await t(this.controlRole, r);
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
    const t = this.pendingTarget;
    if (t === null)
      return;
    const e = this.chargerState?.roles[this.controlRole];
    if (e?.available !== !0 || e.state === null)
      return;
    const r = Number(e.state);
    if (!Number.isFinite(r))
      return;
    const i = this.numberMetadata()?.step, s = typeof i == "number" && i > 0 ? Math.max(i / 1e3, 1e-6) : 1e-6;
    Math.abs(r - t) <= s && this.clearPendingTarget();
  }
  startPendingTimeout(t) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingTarget === t && (this.clearPendingTarget(), this.commandError = "Controller state did not confirm the value within 10 seconds.", this.requestUpdate());
    }, Kt);
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
  rangeText(t) {
    const e = [];
    return typeof t.min == "number" && e.push(`min ${t.min}`), typeof t.max == "number" && e.push(`max ${t.max}`), typeof t.step == "number" && e.push(`step ${t.step}`), t.unit !== null && e.push(t.unit), e.join(" · ");
  }
  formatDisplayValue(t) {
    if (t === null)
      return "unavailable";
    const e = Number(t);
    return Number.isFinite(e) ? new Intl.NumberFormat(void 0, {
      maximumFractionDigits: 2,
      useGrouping: !1
    }).format(e) : t;
  }
  stepPrecision(t) {
    const e = t.toString(), r = e.toLowerCase().indexOf("e-");
    if (r >= 0)
      return Math.min(
        Number(e.slice(r + 2)) || 0,
        6
      );
    const i = e.indexOf(".");
    return i < 0 ? 0 : Math.min(e.length - i - 1, 6);
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((t) => {
      this.chargerState = t, this.checkPendingCompletion(), this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(nt) || customElements.define(
  nt,
  Zt
);
const st = "r4875g1-power-command-control", Jt = 1e4;
class Qt extends m {
  static styles = C`
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
  set config(t) {
    t !== this.controlConfig && (this.controlConfig = t, this.requestUpdate());
  }
  get state() {
    return this.controlState;
  }
  set state(t) {
    this.controlState = t, this.checkPendingCompletion(), this.requestUpdate();
  }
  get execute() {
    return this.executeControl;
  }
  set execute(t) {
    this.executeControl = t, this.requestUpdate();
  }
  disconnectedCallback() {
    this.confirmationAction = null, this.clearPendingAction(), super.disconnectedCallback();
  }
  render() {
    const t = this.powerPresentation();
    return l`
      <button
        class="power-button"
        data-action=${t.action ?? ""}
        ?disabled=${!t.enabled}
        @click=${() => this.openConfirmation(t.action)}
      >
        ${t.label}
      </button>

      ${this.commandError !== null ? l`<div class="message">${this.commandError}</div>` : ""}

      ${this.confirmationAction !== null ? this.renderConfirmation(this.confirmationAction) : ""}
    `;
  }
  powerPresentation() {
    const t = this.controlConfig, e = this.controlState;
    if (this.pendingAction !== null)
      return {
        action: this.pendingAction,
        enabled: !1,
        label: this.pendingAction === "start" ? "STARTING..." : "STOPPING..."
      };
    if (t === null || e === null || e.action === null)
      return {
        action: null,
        enabled: !1,
        label: e?.unavailableLabel ?? "CONTROL UNAVAILABLE"
      };
    const r = e.action === "start" ? e.startAvailable : e.stopAvailable;
    return {
      action: e.action,
      enabled: r && this.executeControl !== null,
      label: `${e.action === "start" ? "START" : "STOP"} ${t.targetLabel}`
    };
  }
  renderConfirmation(t) {
    const e = this.controlConfig;
    if (e === null)
      return "";
    const r = t === "start";
    return l`
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
            ${r ? "START" : "STOP"} ${e.targetLabel}
          </div>

          <p class="dialog-text">
            ${r ? e.startConfirmationText : e.stopConfirmationText}
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
              data-action=${t}
              @click=${this.confirmPowerCommand}
            >
              ${r ? "START" : "STOP"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  openConfirmation(t) {
    const e = this.controlState;
    t === null || e === null || this.pendingAction !== null || !(t === "start" ? e.startAvailable : e.stopAvailable) || this.executeControl === null || (this.confirmationAction = t, this.commandError = null, this.requestUpdate());
  }
  cancelConfirmation = () => {
    this.confirmationAction = null, this.requestUpdate();
  };
  confirmPowerCommand = async () => {
    const t = this.confirmationAction, e = this.controlConfig, r = this.executeControl;
    if (t === null || e === null || r === null || this.pendingAction !== null)
      return;
    const i = t === "start" ? e.startRole : e.stopRole;
    this.confirmationAction = null, this.pendingAction = t, this.commandError = null, this.startPendingTimeout(t), this.requestUpdate();
    try {
      await r(i);
    } catch (s) {
      if (this.pendingAction !== t)
        return;
      this.clearPendingAction(), this.commandError = s instanceof Error ? s.message : String(s), this.requestUpdate();
      return;
    }
    this.checkPendingCompletion(), this.requestUpdate();
  };
  checkPendingCompletion() {
    const t = this.pendingAction, e = this.controlState;
    if (t === null || e === null)
      return;
    (t === "start" ? e.startComplete : e.stopComplete) && this.clearPendingAction();
  }
  startPendingTimeout(t) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingAction === t && (this.clearPendingAction(), this.commandError = `Controller state did not confirm the ${t.toUpperCase()} command within 10 seconds.`, this.requestUpdate());
    }, Jt);
  }
  clearPendingAction() {
    this.pendingAction = null, this.clearPendingTimeout();
  }
  clearPendingTimeout() {
    this.pendingTimeout !== null && (clearTimeout(this.pendingTimeout), this.pendingTimeout = null);
  }
}
customElements.get(st) || customElements.define(
  st,
  Qt
);
const ot = "r4875g1-rectifier-details", Xt = [1, 2, 3], Yt = {
  1: L(1),
  2: L(2),
  3: L(3)
}, te = [
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
class ee extends m {
  static styles = C`
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
  set store(t) {
    t !== this.chargerStore && (this.detachStore(), this.chargerStore = t, this.chargerState = t?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(t) {
    this.executeControl = t, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return this.chargerState === null ? l`
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">Waiting for rectifier data…</div>
        </section>
      ` : this.chargerState.capabilities.rectifier_detail?.available !== !0 ? l`
        <section class="section">
          <h2 class="section-heading">Rectifiers</h2>
          <div class="message">
            Rectifier detail capability is unavailable.
          </div>
        </section>
      ` : l`
      <section class="section">
        <h2 class="section-heading">Rectifiers</h2>
        <div class="units">
          ${Xt.map((e) => this.renderUnit(e))}
        </div>
      </section>
    `;
  }
  renderUnit(t) {
    return l`
      <details>
        <summary>
          <span class="unit-name">Unit ${t}</span>
          <span class="summary-values">
            ${this.renderSummaryValue(t, "connected", "CAN")}
            ${this.renderSummaryValue(t, "power_state", "Power")}
            ${this.renderSummaryValue(t, "dc.power", "DC")}
            ${this.renderSummaryValue(t, "temperature.output", "Output")}
          </span>
        </summary>
        <div class="groups">
          <div class="unit-control">
            <r4875g1-power-command-control
              .config=${Yt[t]}
              .state=${this.powerCommandState(t)}
              .execute=${this.executeControl}
            ></r4875g1-power-command-control>
          </div>
          ${te.map(({ title: e, metrics: r }) => l`
            <section class="group">
              <div class="group-title">${e}</div>
              <div class="metrics">
                ${r.map(
      ({ label: i, suffix: s }) => this.renderMetric(t, i, s)
    )}
              </div>
            </section>
          `)}
        </div>
      </details>
    `;
  }
  powerCommandState(t) {
    const e = `rectifier.${t}`, r = this.chargerState?.roles[`${e}.power_state`], i = r?.available === !0 ? r.state : null, s = `${e}.command.start`, o = `${e}.command.stop`;
    let c = null, a = `RECTIFIER ${t} STATE UNAVAILABLE`;
    return i === "OFF" ? c = "start" : i === "ON" ? c = "stop" : i !== null && i.trim() !== "" && (a = `RECTIFIER ${t} ${i}`), {
      action: c,
      startAvailable: this.chargerState?.roles[s]?.control?.available === !0,
      stopAvailable: this.chargerState?.roles[o]?.control?.available === !0,
      startComplete: i === "ON",
      stopComplete: i === "OFF",
      unavailableLabel: a
    };
  }
  renderSummaryValue(t, e, r) {
    const i = this.getDisplayValue(t, e);
    return l`
      <span class="summary-value">
        ${r}: ${i.value}${i.unit !== null ? l` ${i.unit}` : ""}
      </span>
    `;
  }
  renderMetric(t, e, r) {
    const i = this.getDisplayValue(t, r);
    return l`
      <div class="metric">
        <span class="metric-label">${e}</span>
        <span class="metric-value">
          ${i.value}${i.unit !== null ? l`<span class="metric-unit">${i.unit}</span>` : ""}
        </span>
      </div>
    `;
  }
  getDisplayValue(t, e) {
    return gt(
      this.chargerState?.roles[`rectifier.${t}.${e}`]
    );
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((t) => {
      this.chargerState = t, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(ot) || customElements.define(ot, ee);
function L(n) {
  return {
    targetLabel: `RECTIFIER ${n}`,
    startRole: `rectifier.${n}.command.start`,
    stopRole: `rectifier.${n}.command.stop`,
    startConfirmationText: `Start Rectifier ${n}? All individual safety checks will be applied by the Charger Controller.`,
    stopConfirmationText: `Stop Rectifier ${n}?`
  };
}
const at = "r4875g1-charger-setpoint-controls", re = [
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
], ie = [
  {
    role: "charger.fallback.voltage_setpoint",
    label: "Fallback DC voltage"
  },
  {
    role: "charger.fallback.current_setpoint",
    label: "Fallback DC current"
  }
];
class ne extends m {
  static styles = C`
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
  set store(t) {
    t !== this.chargerStore && (this.chargerStore = t, this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(t) {
    t !== this.executeControl && (this.executeControl = t, this.requestUpdate());
  }
  render() {
    return l`
      <section class="section">
        <div class="section-title">Operational setpoints</div>
        <div class="section-description">
          Normal Charger operating limits and targets.
        </div>
        ${re.map(
      ({ role: t, label: e }) => this.renderNumberControl(t, e)
    )}
      </section>

      <details class="section">
        <summary>Fallback settings</summary>
        <div class="fallback-content">
          <div class="section-description">
            Rectifier fallback voltage and current settings.
          </div>
          ${ie.map(
      ({ role: t, label: e }) => this.renderNumberControl(t, e)
    )}
        </div>
      </details>
    `;
  }
  renderNumberControl(t, e) {
    return l`
      <r4875g1-charger-number-control
        .store=${this.chargerStore}
        .execute=${this.executeControl}
        .role=${t}
        .label=${e}
      ></r4875g1-charger-number-control>
    `;
  }
}
customElements.get(at) || customElements.define(
  at,
  ne
);
const lt = "r4875g1-charger-power-control", ft = "charger.command.start", bt = "charger.command.stop", se = {
  targetLabel: "CHARGER",
  startRole: ft,
  stopRole: bt,
  startConfirmationText: "Start all available and ready rectifier units? Safety checks are applied individually by the Charger Controller before startup.",
  stopConfirmationText: "Stop all rectifier units?"
};
class oe extends m {
  static styles = C`
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
  set store(t) {
    t !== this.chargerStore && (this.detachStore(), this.chargerStore = t, this.chargerState = t?.state ?? null, this.isConnected && this.attachStore(), this.requestUpdate());
  }
  get execute() {
    return this.executeControl;
  }
  set execute(t) {
    this.executeControl = t, this.requestUpdate();
  }
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), super.disconnectedCallback();
  }
  render() {
    return l`
      <r4875g1-power-command-control
        .config=${se}
        .state=${this.powerCommandState()}
        .execute=${this.executeControl}
      ></r4875g1-power-command-control>
    `;
  }
  powerCommandState() {
    const t = this.rectifierCount("charger.available_units"), e = this.rectifierCount("charger.running_units");
    return t === null || e === null ? {
      action: null,
      startAvailable: !1,
      stopAvailable: !1,
      startComplete: !1,
      stopComplete: !1,
      unavailableLabel: "CHARGER STATE UNAVAILABLE"
    } : t < 1 ? {
      action: null,
      startAvailable: !1,
      stopAvailable: !1,
      startComplete: !1,
      stopComplete: e <= 0,
      unavailableLabel: "NO RECTIFIERS"
    } : {
      action: e > 0 ? "stop" : "start",
      startAvailable: this.chargerState?.roles[ft]?.control?.available === !0,
      stopAvailable: this.chargerState?.roles[bt]?.control?.available === !0,
      startComplete: e >= t,
      stopComplete: e <= 0,
      unavailableLabel: "CHARGER STATE UNAVAILABLE"
    };
  }
  rectifierCount(t) {
    const e = this.chargerState?.roles[t];
    if (e?.available !== !0 || e.state === null)
      return null;
    const r = Number(e.state);
    return Number.isFinite(r) ? r : null;
  }
  attachStore() {
    this.chargerStore === null || this.unsubscribe !== null || (this.chargerState = this.chargerStore.state, this.unsubscribe = this.chargerStore.subscribe((t) => {
      this.chargerState = t, this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(lt) || customElements.define(
  lt,
  oe
);
function ae(n) {
  const t = window.customCards ??= [];
  t.some(({ type: e }) => e === n.type) || t.push(n);
}
const D = "r4875g1-charger-overview-card";
class le extends m {
  static getStubConfig() {
    return {};
  }
  static styles = C`
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
  chargerStore = new _t();
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
  set hass(t) {
    this.homeAssistant = t, this.connectIfReady(), this.requestUpdate();
  }
  setConfig(t) {
    if (t.config_entry_id !== void 0 && (typeof t.config_entry_id != "string" || t.config_entry_id.trim() === ""))
      throw new Error("config_entry_id must be a non-empty string");
    this.config = {
      ...t,
      config_entry_id: t.config_entry_id?.trim()
    }, this.discoveredConnection = null, this.discoveredConfigEntryId = null, this.connectIfReady(), this.requestUpdate();
  }
  getCardSize() {
    return 7;
  }
  connectedCallback() {
    super.connectedCallback(), this.connectIfReady();
  }
  disconnectedCallback() {
    this.connectionGeneration += 1, this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.discoveredConnection = null, this.discoveredConfigEntryId = null, super.disconnectedCallback();
  }
  render() {
    return this.connectionError !== null ? l`
        <ha-card>
          <div class="heading">R4875G1 Charger</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      ` : l`
      <ha-card>
        <div class="heading">R4875G1 Charger</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
        <r4875g1-rectifier-details
          .store=${this.chargerStore}
          .execute=${this.executeControl}
        ></r4875g1-rectifier-details>
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
    const t = ++this.connectionGeneration, e = this.homeAssistant.connection;
    try {
      const r = await this.resolveConfigEntryId(
        this.homeAssistant
      );
      if (t !== this.connectionGeneration || this.connectedConnection === e && this.connectedConfigEntryId === r)
        return;
      this.connectedConnection = e, this.connectedConfigEntryId = r, this.connectionError = null, this.requestUpdate(), await this.chargerStore.connect(
        this.homeAssistant,
        r
      );
    } catch (r) {
      if (t !== this.connectionGeneration)
        return;
      this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.connectionError = r instanceof Error ? r.message : String(r), this.requestUpdate();
      return;
    }
    t === this.connectionGeneration && this.requestUpdate();
  }
  executeControl = (t, e) => this.homeAssistant === null || this.connectedConfigEntryId === null ? Promise.reject(
    new Error("Charger Instance is not connected")
  ) : $t(
    this.homeAssistant,
    this.connectedConfigEntryId,
    t,
    e
  );
  async resolveConfigEntryId(t) {
    const e = this.config?.config_entry_id;
    if (e !== void 0)
      return e;
    if (this.discoveredConnection === t.connection && this.discoveredConfigEntryId !== null)
      return this.discoveredConfigEntryId;
    const r = await vt(t);
    if (r.instances.length === 0)
      throw new Error("No R4875G1 Charger Instance is available");
    if (r.instances.length > 1)
      throw new Error(
        "Multiple R4875G1 Charger Instances found; configure config_entry_id"
      );
    const i = r.instances[0].config_entry_id;
    return this.discoveredConnection = t.connection, this.discoveredConfigEntryId = i, i;
  }
}
customElements.get(D) || customElements.define(D, le);
ae({
  type: D,
  name: "R4875G1 Charger",
  description: "Control and monitor an R4875G1 Charger",
  preview: !0
});
const ce = "R4875G1 Charger Dashboard";
console.info(`[${ce}] frontend bootstrap loaded`);
export {
  nt as CHARGER_NUMBER_CONTROL_TAG,
  D as CHARGER_OVERVIEW_CARD_TAG,
  lt as CHARGER_POWER_CONTROL_TAG,
  at as CHARGER_SETPOINT_CONTROLS_TAG,
  rt as CHARGER_STATUS_TAG,
  Zt as ChargerNumberControl,
  le as ChargerOverviewCard,
  oe as ChargerPowerControl,
  ne as ChargerSetpointControls,
  Wt as ChargerStatusPreview,
  _t as ChargerStore,
  ce as DASHBOARD_NAME,
  ot as RECTIFIER_DETAILS_TAG,
  ee as RectifierDetails,
  $t as controlChargerRole,
  ue as getChargerInstance,
  vt as listChargerInstances,
  Ct as reduceChargerSubscriptionEvent,
  yt as subscribeChargerInstance
};
