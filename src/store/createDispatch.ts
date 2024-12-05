/* eslint-disable @typescript-eslint/no-explicit-any */
const createDispatch = (
  data: Record<string, any>,
  tools: any,
  actions: Record<string, any>
) => {
  const { type, payload } = data;
  const { update /*, addState , reset, dirty */ } = tools;

  const setAge = () => {
    const age = payload.value;
    update({ age }, "info");
  };

  const lang = () => {
    const { lang } = payload;
    update({ lang }, "info2");
  };
  switch (!!type) {
    /*
    actions => return all actions that you logged
    when you call dispatch("setAge", { value: 28 })
    (setAge) is the action
  */
    case !!actions.setAge:
      return setAge();
    case !!actions.lang:
      return lang();
    default:
      console.log("no111");
      break;
  }
};

export default createDispatch;
