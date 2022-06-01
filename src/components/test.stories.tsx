import { Test } from "./test"

export default {
    component: Test,
}

export function Base() {
    return (<Test foo={"hi"}/>);
}
