function a(r) {
  return r.callWS({
    type: "r4875g1_charger/instances"
  });
}
function s(r, e) {
  return r.callWS({
    type: "r4875g1_charger/instance",
    config_entry_id: e
  });
}
function i(r, e, n, t) {
  const c = {
    type: "r4875g1_charger/control",
    config_entry_id: e,
    role: n
  };
  return t !== void 0 && (c.value = t), r.callWS(c);
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
const o = "R4875G1 Charger Dashboard";
console.info(`[${o}] frontend bootstrap loaded`);
export {
  o as DASHBOARD_NAME,
  i as controlChargerRole,
  s as getChargerInstance,
  a as listChargerInstances,
  g as subscribeChargerInstance
};
//# sourceMappingURL=r4875g1-charger-dashboard.js.map
