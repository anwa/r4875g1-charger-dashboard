function lt(i) {
  return i.callWS({
    type: "r4875g1_charger/instances"
  });
}
function zt(i, t) {
  return i.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: t
  });
}
function Gt(i, t, e, s) {
  const r = {
    type: "r4875g1_charger/control",
    config_entry_id: t,
    role: e
  };
  return s !== void 0 && (r.value = s), i.callWS(r);
}
function ht(i, t, e) {
  return i.connection.subscribeMessage(
    e,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: t
    }
  );
}
function dt(i, t) {
  switch (t.event) {
    case "snapshot":
    case "mapping_changed":
      return t.data;
    case "role_state": {
      if (i === null)
        return i;
      const e = i.roles[t.role];
      return {
        ...t.instance ?? i,
        roles: {
          ...i.roles,
          [t.role]: {
            ...e,
            ...t.data
          }
        }
      };
    }
    case "mapping_error":
      return i;
  }
}
class ut {
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
    const s = this.generation, r = await ht(
      t,
      e,
      (n) => {
        s === this.generation && this.applyEvent(n);
      }
    );
    if (s !== this.generation) {
      r();
      return;
    }
    this.backendUnsubscribe = r;
  }
  disconnect() {
    this.generation += 1, this.backendUnsubscribe !== null && (this.backendUnsubscribe(), this.backendUnsubscribe = null), this.currentState !== null && (this.currentState = null, this.notify());
  }
  applyEvent(t) {
    const e = dt(
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
const I = globalThis, k = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, D = /* @__PURE__ */ Symbol(), V = /* @__PURE__ */ new WeakMap();
let st = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== D) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (k && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = V.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && V.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (i) => new st(typeof i == "string" ? i : i + "", void 0, D), rt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new st(e, i, D);
}, ft = (i, t) => {
  if (k) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = I.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, j = k ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(i) : i;
const { is: gt, defineProperty: $t, getOwnPropertyDescriptor: _t, getOwnPropertyNames: mt, getOwnPropertySymbols: vt, getPrototypeOf: yt } = Object, H = globalThis, B = H.trustedTypes, bt = B ? B.emptyScript : "", At = H.reactiveElementPolyfillSupport, C = (i, t) => i, T = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? bt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, it = (i, t) => !gt(i, t), W = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), H.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = W) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && $t(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = _t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? W;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...mt(e), ...vt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(j(r));
    } else t !== void 0 && e.push(j(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : T).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : T;
      this._$Em = r;
      const l = o.fromAttribute(e, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? it)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[C("elementProperties")] = /* @__PURE__ */ new Map(), y[C("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: y }), (H.reactiveElementVersions ??= []).push("2.1.2");
const z = globalThis, q = (i) => i, M = z.trustedTypes, F = M ? M.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, nt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + g, St = `<${ot}>`, v = document, w = () => v.createComment(""), R = (i) => i === null || typeof i != "object" && typeof i != "function", G = Array.isArray, Et = (i) => G(i) || typeof i?.[Symbol.iterator] == "function", O = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Z = /-->/g, J = />/g, $ = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), K = /'/g, Q = /"/g, at = /^(?:script|style|textarea|title)$/i, Ct = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), _ = Ct(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), X = /* @__PURE__ */ new WeakMap(), m = v.createTreeWalker(v, 129);
function ct(i, t) {
  if (!G(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return F !== void 0 ? F.createHTML(t) : t;
}
const wt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let h, u, c = -1, p = 0;
    for (; p < a.length && (o.lastIndex = p, u = o.exec(a), u !== null); ) p = o.lastIndex, o === E ? u[1] === "!--" ? o = Z : u[1] !== void 0 ? o = J : u[2] !== void 0 ? (at.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = $) : u[3] !== void 0 && (o = $) : o === $ ? u[0] === ">" ? (o = r ?? E, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? $ : u[3] === '"' ? Q : K) : o === Q || o === K ? o = $ : o === Z || o === J ? o = E : (o = $, r = void 0);
    const f = o === $ && i[l + 1].startsWith("/>") ? " " : "";
    n += o === E ? a + St : c >= 0 ? (s.push(h), a.slice(0, c) + nt + a.slice(c) + g + f) : a + g + (c === -2 ? l : f);
  }
  return [ct(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class x {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, u] = wt(t, e);
    if (this.el = x.createElement(h, s), m.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = m.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(nt)) {
          const p = u[o++], f = r.getAttribute(c).split(g), P = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: n, name: P[2], strings: f, ctor: P[1] === "." ? xt : P[1] === "?" ? Ut : P[1] === "@" ? Pt : N }), r.removeAttribute(c);
        } else c.startsWith(g) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if (at.test(r.tagName)) {
          const c = r.textContent.split(g), p = c.length - 1;
          if (p > 0) {
            r.textContent = M ? M.emptyScript : "";
            for (let f = 0; f < p; f++) r.append(c[f], w()), m.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[p], w());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ot) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(g, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(i, t, e = i, s) {
  if (t === A) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = R(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = S(i, r._$AS(i, t.values), r, s)), t;
}
class Rt {
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
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? v).importNode(e, !0);
    m.currentNode = r;
    let n = m.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new U(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new It(n, this, t)), this._$AV.push(h), a = s[++l];
      }
      o !== a?.index && (n = m.nextNode(), o++);
    }
    return m.currentNode = v, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = S(this, t, e), R(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
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
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = x.createElement(ct(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Rt(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = X.get(t.strings);
    return e === void 0 && X.set(t.strings, e = new x(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new U(this.O(w()), this.O(w()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = q(t).nextSibling;
      q(t).remove(), t = s;
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
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = S(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = S(this, l[s + a], e, a), h === A && (h = this._$AH[a]), o ||= !R(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class xt extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ut extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Pt extends N {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? d) === A) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class It {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const Mt = z.litHtmlPolyfillSupport;
Mt?.(x, U), (z.litHtmlVersions ??= []).push("3.3.3");
const Ht = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new U(t.insertBefore(w(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
const L = globalThis;
class b extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
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
b._$litElement$ = !0, b.finalized = !0, L.litElementHydrateSupport?.({ LitElement: b });
const Nt = L.litElementPolyfillSupport;
Nt?.({ LitElement: b });
(L.litElementVersions ??= []).push("4.2.2");
const Y = "r4875g1-charger-status", tt = 3, Ot = [
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
class Tt extends b {
  static styles = rt`
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
    return this.chargerState === null ? _`
        <div class="status">
          <div class="value">Waiting for Charger Instance data…</div>
        </div>
      ` : _`
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
          ${Ot.map(
      ({ label: t, role: e }) => this.renderMetric(t, e)
    )}
        </div>
      </div>
    `;
  }
  renderRectifierStatus() {
    const t = this.chargerState?.roles["charger.available_units"], e = this.chargerState?.roles["charger.running_units"];
    return _`
      <div class="unit-status">
        <div class="unit-status-row">
          <span class="label">Available rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(t?.state)}
            / ${tt}
          </span>
        </div>
        <div class="unit-status-row">
          <span class="label">Running rectifiers</span>
          <span class="value">
            ${this.formatRectifierCount(e?.state)}
            / ${tt}
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
    const s = this.chargerState?.roles[e], r = s?.available === !0, n = r ? this.formatMetricValue(s.state) : "unavailable", o = r ? s?.unit ?? null : null;
    return _`
      <div class="metric">
        <span class="metric-label">${t}</span>
        <span class="metric-value">
          ${n}${o !== null ? _`<span class="metric-unit">${o}</span>` : ""}
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
customElements.get(Y) || customElements.define(Y, Tt);
const et = "r4875g1-charger-overview-card";
class kt extends b {
  static styles = rt`
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
  chargerStore = new ut();
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
    this.homeAssistant = t, this.connectIfReady();
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
    return this.connectionError !== null ? _`
        <ha-card>
          <div class="heading">R4875G1 Charger</div>
          <div class="error">${this.connectionError}</div>
        </ha-card>
      ` : _`
      <ha-card>
        <div class="heading">R4875G1 Charger</div>
        <r4875g1-charger-status
          .store=${this.chargerStore}
        ></r4875g1-charger-status>
      </ha-card>
    `;
  }
  async connectIfReady() {
    if (!this.isConnected || this.homeAssistant === null || this.config === null)
      return;
    const t = ++this.connectionGeneration, e = this.homeAssistant.connection;
    try {
      const s = await this.resolveConfigEntryId(
        this.homeAssistant
      );
      if (t !== this.connectionGeneration || this.connectedConnection === e && this.connectedConfigEntryId === s)
        return;
      this.connectedConnection = e, this.connectedConfigEntryId = s, this.connectionError = null, this.requestUpdate(), await this.chargerStore.connect(
        this.homeAssistant,
        s
      );
    } catch (s) {
      if (t !== this.connectionGeneration)
        return;
      this.chargerStore.disconnect(), this.connectedConnection = null, this.connectedConfigEntryId = null, this.connectionError = s instanceof Error ? s.message : String(s), this.requestUpdate();
      return;
    }
    t === this.connectionGeneration && this.requestUpdate();
  }
  async resolveConfigEntryId(t) {
    const e = this.config?.config_entry_id;
    if (e !== void 0)
      return e;
    if (this.discoveredConnection === t.connection && this.discoveredConfigEntryId !== null)
      return this.discoveredConfigEntryId;
    const s = await lt(t);
    if (s.instances.length === 0)
      throw new Error("No R4875G1 Charger Instance is available");
    if (s.instances.length > 1)
      throw new Error(
        "Multiple R4875G1 Charger Instances found; configure config_entry_id"
      );
    const r = s.instances[0].config_entry_id;
    return this.discoveredConnection = t.connection, this.discoveredConfigEntryId = r, r;
  }
}
customElements.get(et) || customElements.define(et, kt);
const Dt = "R4875G1 Charger Dashboard";
console.info(`[${Dt}] frontend bootstrap loaded`);
export {
  et as CHARGER_OVERVIEW_CARD_TAG,
  Y as CHARGER_STATUS_TAG,
  kt as ChargerOverviewCard,
  Tt as ChargerStatusPreview,
  ut as ChargerStore,
  Dt as DASHBOARD_NAME,
  Gt as controlChargerRole,
  zt as getChargerInstance,
  lt as listChargerInstances,
  dt as reduceChargerSubscriptionEvent,
  ht as subscribeChargerInstance
};
