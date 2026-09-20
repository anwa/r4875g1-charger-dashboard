function t(r) {
  return r.callWS({
    type: "r4875g1_charger/instances"
  });
}
function c(r, e) {
  return r.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: e
  });
}
function i(r, e, n, o) {
  const a = {
    type: "r4875g1_charger/control",
    config_entry_id: e,
    role: n
  };
  return o !== void 0 && (a.value = o), r.callWS(a);
}
function g(r, e, n) {
  return r.connection.subscribeMessage(
    n,
    {
      type: "r4875g1_charger/subscribe",
      config_entry_id: e
    }
  );
}
function l(r, e) {
  switch (e.event) {
    case "snapshot":
    case "mapping_changed":
      return e.data;
    case "role_state": {
      if (r === null)
        return r;
      const n = r.roles[e.role];
      return {
        ...e.instance ?? r,
        roles: {
          ...r.roles,
          [e.role]: {
            ...n,
            ...e.data
          }
        }
      };
    }
    case "mapping_error":
      return r;
  }
}
const s = "R4875G1 Charger Dashboard";
console.info(`[${s}] frontend bootstrap loaded`);
export {
  s as DASHBOARD_NAME,
  i as controlChargerRole,
  c as getChargerInstance,
  t as listChargerInstances,
  l as reduceChargerSubscriptionEvent,
  g as subscribeChargerInstance
};
//# sourceMappingURL=r4875g1-charger-dashboard.js.map
