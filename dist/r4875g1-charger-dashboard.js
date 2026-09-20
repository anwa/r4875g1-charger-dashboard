function u(e) {
  return e.callWS({
    type: "r4875g1_charger/instances"
  });
}
function l(e, t) {
  return e.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: t
  });
}
function h(e, t, n, r) {
  const s = {
    type: "r4875g1_charger/control",
    config_entry_id: t,
    role: n
  };
  return r !== void 0 && (s.value = r), e.callWS(s);
}
function a(e, t, n) {
  return e.connection.subscribeMessage(
    n,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: t
    }
  );
}
function c(e, t) {
  switch (t.event) {
    case "snapshot":
    case "mapping_changed":
      return t.data;
    case "role_state": {
      if (e === null)
        return e;
      const n = e.roles[t.role];
      return {
        ...t.instance ?? e,
        roles: {
          ...e.roles,
          [t.role]: {
            ...n,
            ...t.data
          }
        }
      };
    }
    case "mapping_error":
      return e;
  }
}
class g {
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
  async connect(t, n) {
    this.disconnect();
    const r = this.generation, s = await a(
      t,
      n,
      (i) => {
        r === this.generation && this.applyEvent(i);
      }
    );
    if (r !== this.generation) {
      s();
      return;
    }
    this.backendUnsubscribe = s;
  }
  disconnect() {
    this.generation += 1, this.backendUnsubscribe !== null && (this.backendUnsubscribe(), this.backendUnsubscribe = null), this.currentState !== null && (this.currentState = null, this.notify());
  }
  applyEvent(t) {
    const n = c(
      this.currentState,
      t
    );
    n !== this.currentState && (this.currentState = n, this.notify());
  }
  notify() {
    for (const t of this.listeners)
      t(this.currentState);
  }
}
const o = "R4875G1 Charger Dashboard";
console.info(`[${o}] frontend bootstrap loaded`);
export {
  g as ChargerStore,
  o as DASHBOARD_NAME,
  h as controlChargerRole,
  l as getChargerInstance,
  u as listChargerInstances,
  c as reduceChargerSubscriptionEvent,
  a as subscribeChargerInstance
};
//# sourceMappingURL=r4875g1-charger-dashboard.js.map
