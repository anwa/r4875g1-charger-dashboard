function ut(s) {
  return s.callWS({
    type: "r4875g1_charger/instances"
  });
}
function Bt(s, t) {
  return s.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: t
  });
}
function pt(s, t, e, r) {
  const i = {
    type: "r4875g1_charger/control",
    config_entry_id: t,
    role: e
  };
  return r !== void 0 && (i.value = r), s.callWS(i);
}
function gt(s, t, e) {
  return s.connection.subscribeMessage(
    e,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: t
    }
  );
}
function ft(s, t) {
  switch (t.event) {
    case "snapshot":
    case "mapping_changed":
      return t.data;
    case "role_state": {
      if (s === null)
        return s;
      const e = s.roles[t.role];
      return {
        ...t.instance ?? s,
        roles: {
          ...s.roles,
          [t.role]: {
            ...e,
            ...t.data
          }
        }
      };
    }
    case "mapping_error":
      return s;
  }
}
class mt {
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
    const r = this.generation, i = await gt(
      t,
      e,
      (n) => {
        r === this.generation && this.applyEvent(n);
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
    const e = ft(
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
const U = globalThis, M = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = /* @__PURE__ */ Symbol(), V = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (M && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = V.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && V.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (s) => new ot(typeof s == "string" ? s : s + "", void 0, G), D = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new ot(e, s, G);
}, $t = (s, t) => {
  if (M) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = U.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, j = M ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return bt(e);
})(s) : s;
const { is: _t, defineProperty: vt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: At, getOwnPropertySymbols: Ct, getPrototypeOf: St } = Object, O = globalThis, B = O.trustedTypes, Et = B ? B.emptyScript : "", wt = O.reactiveElementPolyfillSupport, E = (s, t) => s, H = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Et : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, at = (s, t) => !_t(s, t), W = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), O.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = W) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && vt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: n } = yt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? W;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, r = [...At(e), ...Ct(e)];
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
    return $t(t, this.constructor.elementStyles), t;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : H).toAttribute(e, r.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = r.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : H;
      this._$Em = i;
      const l = o.fromAttribute(e, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), r ??= o.getPropertyOptions(t), !((r.hasChanged ?? at)(n, e) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: n }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, n] of r) {
        const { wrapped: o } = n, l = this[i];
        o !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[E("elementProperties")] = /* @__PURE__ */ new Map(), y[E("finalized")] = /* @__PURE__ */ new Map(), wt?.({ ReactiveElement: y }), (O.reactiveElementVersions ??= []).push("2.1.2");
const q = globalThis, F = (s) => s, k = q.trustedTypes, Z = k ? k.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ct = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, lt = "?" + m, Rt = `<${lt}>`, v = document, w = () => v.createComment(""), R = (s) => s === null || typeof s != "object" && typeof s != "function", z = Array.isArray, xt = (s) => z(s) || typeof s?.[Symbol.iterator] == "function", N = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, J = /-->/g, K = />/g, b = RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Q = /'/g, X = /"/g, ht = /^(?:script|style|textarea|title)$/i, Pt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), p = Pt(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Y = /* @__PURE__ */ new WeakMap(), $ = v.createTreeWalker(v, 129);
function dt(s, t) {
  if (!z(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Z !== void 0 ? Z.createHTML(t) : t;
}
const Tt = (s, t) => {
  const e = s.length - 1, r = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let h, u, c = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, u = o.exec(a), u !== null); ) g = o.lastIndex, o === S ? u[1] === "!--" ? o = J : u[1] !== void 0 ? o = K : u[2] !== void 0 ? (ht.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = b) : u[3] !== void 0 && (o = b) : o === b ? u[0] === ">" ? (o = i ?? S, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? b : u[3] === '"' ? X : Q) : o === X || o === Q ? o = b : o === J || o === K ? o = S : (o = b, i = void 0);
    const f = o === b && s[l + 1].startsWith("/>") ? " " : "";
    n += o === S ? a + Rt : c >= 0 ? (r.push(h), a.slice(0, c) + ct + a.slice(c) + m + f) : a + m + (c === -2 ? l : f);
  }
  return [dt(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class x {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, u] = Tt(t, e);
    if (this.el = x.createElement(h, r), $.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = $.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ct)) {
          const g = u[o++], f = i.getAttribute(c).split(m), T = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: n, name: T[2], strings: f, ctor: T[1] === "." ? kt : T[1] === "?" ? Ot : T[1] === "@" ? It : I }), i.removeAttribute(c);
        } else c.startsWith(m) && (a.push({ type: 6, index: n }), i.removeAttribute(c));
        if (ht.test(i.tagName)) {
          const c = i.textContent.split(m), g = c.length - 1;
          if (g > 0) {
            i.textContent = k ? k.emptyScript : "";
            for (let f = 0; f < g; f++) i.append(c[f], w()), $.nextNode(), a.push({ type: 2, index: ++n });
            i.append(c[g], w());
          }
        }
      } else if (i.nodeType === 8) if (i.data === lt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(m, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += m.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const r = v.createElement("template");
    return r.innerHTML = t, r;
  }
}
function C(s, t, e = s, r) {
  if (t === A) return t;
  let i = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const n = R(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, e, r)), r !== void 0 ? (e._$Co ??= [])[r] = i : e._$Cl = i), i !== void 0 && (t = C(s, i._$AS(s, t.values), i, r)), t;
}
class Ut {
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
    const { el: { content: e }, parts: r } = this._$AD, i = (t?.creationScope ?? v).importNode(e, !0);
    $.currentNode = i;
    let n = $.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new P(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new Nt(n, this, t)), this._$AV.push(h), a = r[++l];
      }
      o !== a?.index && (n = $.nextNode(), o++);
    }
    return $.currentNode = v, i;
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
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = C(this, t, e), R(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = x.createElement(dt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new Ut(i, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = Y.get(t.strings);
    return e === void 0 && Y.set(t.strings, e = new x(t)), e;
  }
  k(t) {
    z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const n of t) i === e.length ? e.push(r = new P(this.O(w()), this.O(w()), this, this.options)) : r = e[i], r._$AI(n), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = F(t).nextSibling;
      F(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, e = this, r, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = C(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = C(this, l[r + a], e, a), h === A && (h = this._$AH[a]), o ||= !R(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class kt extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ot extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class It extends I {
  constructor(t, e, r, i, n) {
    super(t, e, r, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? d) === A) return;
    const r = this._$AH, i = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== d && (r === d || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const Ht = q.litHtmlPolyfillSupport;
Ht?.(x, P), (q.litHtmlVersions ??= []).push("3.3.3");
const Mt = (s, t, e) => {
  const r = e?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    r._$litPart$ = i = new P(t.insertBefore(w(), n), n, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
const L = globalThis;
class _ extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Mt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
_._$litElement$ = !0, _.finalized = !0, L.litElementHydrateSupport?.({ LitElement: _ });
const Gt = L.litElementPolyfillSupport;
Gt?.({ LitElement: _ });
(L.litElementVersions ??= []).push("4.2.2");
const tt = "r4875g1-charger-status", et = 3, Dt = [
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
class qt extends _ {
  static styles = D`
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
    return this.chargerState === null ? p`
        <div class="status">
          <div class="value">Waiting for Charger Instance data…</div>
        </div>
      ` : p`
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
          ${Dt.map(
      ({ label: t, role: e }) => this.renderMetric(t, e)
    )}
        </div>
      </div>
    `;
  }
  renderRectifierStatus() {
    const t = this.chargerState?.roles["charger.available_units"], e = this.chargerState?.roles["charger.running_units"];
    return p`
      <div class="unit-status">
        <div class="unit-status-row">
          <span class="label">Available rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(t?.state)}
            / ${et}
          </span>
        </div>
        <div class="unit-status-row">
          <span class="label">Running rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(e?.state)}
            / ${et}
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
    const r = this.chargerState?.roles[e], i = r?.available === !0, n = i ? this.formatMetricValue(r.state) : "unavailable", o = i ? r?.unit ?? null : null;
    return p`
      <div class="metric">
        <span class="metric-label">${t}</span>
        <span class="metric-value">
          ${n}${o !== null ? p`<span class="metric-unit">${o}</span>` : ""}
        </span>
      </div>
    `;
  }
  formatMetricValue(t) {
    if (t === null)
      return "unavailable";
    const e = Number(t);
    return Number.isFinite(e) ? new Intl.NumberFormat(void 0, {
      maximumFractionDigits: 2,
      useGrouping: !1
    }).format(e) : t;
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
customElements.get(tt) || customElements.define(tt, qt);
const rt = "r4875g1-charger-power-control", it = "charger.command.start", st = "charger.command.stop", zt = 1e4;
class Lt extends _ {
  static styles = D`
    :host {
      display: block;
      margin-top: 1rem;
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
  chargerStore = null;
  chargerState = null;
  executeControl = null;
  unsubscribe = null;
  confirmationAction = null;
  pendingAction = null;
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
  connectedCallback() {
    super.connectedCallback(), this.attachStore();
  }
  disconnectedCallback() {
    this.detachStore(), this.clearPendingTimeout(), super.disconnectedCallback();
  }
  render() {
    const t = this.powerPresentation();
    return p`
      <button
        class="power-button"
        data-action=${t.action ?? ""}
        ?disabled=${!t.enabled}
        @click=${() => this.openConfirmation(t.action)}
      >
        ${t.label}
      </button>

      ${this.commandError !== null ? p`<div class="message">${this.commandError}</div>` : ""}

      ${this.confirmationAction !== null ? this.renderConfirmation(this.confirmationAction) : ""}
    `;
  }
  powerPresentation() {
    if (this.pendingAction !== null)
      return {
        action: this.pendingAction,
        enabled: !1,
        label: this.pendingAction === "start" ? "STARTING..." : "STOPPING..."
      };
    const t = this.rectifierCount("charger.available_units"), e = this.rectifierCount("charger.running_units");
    if (t === null || e === null)
      return {
        action: null,
        enabled: !1,
        label: "CHARGER STATE UNAVAILABLE"
      };
    if (t < 1)
      return {
        action: null,
        enabled: !1,
        label: "NO RECTIFIERS"
      };
    const r = e > 0 ? "stop" : "start", i = r === "start" ? it : st, n = this.chargerState?.roles[i]?.control?.available === !0;
    return {
      action: r,
      enabled: n && this.executeControl !== null,
      label: r === "start" ? "START CHARGER" : "STOP CHARGER"
    };
  }
  renderConfirmation(t) {
    const e = t === "start";
    return p`
      <div class="dialog-backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="charger-power-dialog-title"
        >
          <div
            id="charger-power-dialog-title"
            class="dialog-title"
          >
            ${e ? "START CHARGER" : "STOP CHARGER"}
          </div>

          <p class="dialog-text">
            ${e ? "Start all available and ready rectifier units? Safety checks are applied individually by the Charger Controller before startup." : "Stop all rectifier units?"}
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
              ${e ? "START" : "STOP"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  openConfirmation(t) {
    t === null || this.pendingAction !== null || (this.confirmationAction = t, this.commandError = null, this.requestUpdate());
  }
  cancelConfirmation = () => {
    this.confirmationAction = null, this.requestUpdate();
  };
  confirmPowerCommand = async () => {
    const t = this.confirmationAction, e = this.executeControl;
    if (t === null || e === null || this.pendingAction !== null)
      return;
    const r = t === "start" ? it : st;
    this.confirmationAction = null, this.pendingAction = t, this.commandError = null, this.startPendingTimeout(t), this.requestUpdate();
    try {
      await e(r);
    } catch (i) {
      if (this.pendingAction !== t)
        return;
      this.clearPendingAction(), this.commandError = i instanceof Error ? i.message : String(i), this.requestUpdate();
      return;
    }
    this.checkPendingCompletion(), this.requestUpdate();
  };
  checkPendingCompletion() {
    if (this.pendingAction === null)
      return;
    const t = this.rectifierCount("charger.available_units"), e = this.rectifierCount("charger.running_units");
    if (t === null || e === null)
      return;
    (this.pendingAction === "start" ? t > 0 && e >= t : e <= 0) && this.clearPendingAction();
  }
  startPendingTimeout(t) {
    this.clearPendingTimeout(), this.pendingTimeout = setTimeout(() => {
      this.pendingAction === t && (this.clearPendingAction(), this.commandError = "Controller state did not confirm the command within 10 seconds.", this.requestUpdate());
    }, zt);
  }
  clearPendingAction() {
    this.pendingAction = null, this.clearPendingTimeout();
  }
  clearPendingTimeout() {
    this.pendingTimeout !== null && (clearTimeout(this.pendingTimeout), this.pendingTimeout = null);
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
      this.chargerState = t, this.checkPendingCompletion(), this.requestUpdate();
    }));
  }
  detachStore() {
    this.unsubscribe !== null && (this.unsubscribe(), this.unsubscribe = null);
  }
}
customElements.get(rt) || customElements.define(
  rt,
  Lt
);
const nt = "r4875g1-charger-overview-card";
class Vt extends _ {
  static styles = D`
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
  chargerStore = new mt();
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
    return 3;
  }
  connectedCallback() {
    super.connectedCallback(), this.connectIfReady();
  }
  disconnectedCallback() {
    this.connectionGeneration += 1, this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.discoveredConnection = null, this.discoveredConfigEntryId = null, super.disconnectedCallback();
  }
  render() {
    return this.connectionError !== null ? p`
        <ha-card>
          <div class="heading">R4875G1 Charger</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      ` : p`
      <ha-card>
        <div class="heading">R4875G1 Charger</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
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
  ) : pt(
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
    const r = await ut(t);
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
customElements.get(nt) || customElements.define(nt, Vt);
const jt = "R4875G1 Charger Dashboard";
console.info(`[${jt}] frontend bootstrap loaded`);
export {
  nt as CHARGER_OVERVIEW_CARD_TAG,
  rt as CHARGER_POWER_CONTROL_TAG,
  tt as CHARGER_STATUS_TAG,
  Vt as ChargerOverviewCard,
  Lt as ChargerPowerControl,
  qt as ChargerStatusPreview,
  mt as ChargerStore,
  jt as DASHBOARD_NAME,
  pt as controlChargerRole,
  Bt as getChargerInstance,
  ut as listChargerInstances,
  ft as reduceChargerSubscriptionEvent,
  gt as subscribeChargerInstance
};
