import React, { useState } from "react"

export interface Props {
    foo: string,
    bar?: string,
    is?: boolean,
    children?: Array<JSX.Element | string>,
}

export function Test({ foo, bar = "hiii", is = false, children }: Props) {
    const [state, setState] = useState({
        foo,
        bar,
        old: "",
    })

    function onClick() {
        if (state.foo === "reee") {
            setState(oldState => ({ ...oldState, foo: state.old }))
        } else {
            setState(oldState => ({ ...oldState, old: state.foo, foo: "reee" }))
        }
    }

    return (
        <>
            <div>
                {state.foo}
                {(state?.foo === "reee")
                    ? <strong>!!!</strong>
                    : null
                }
                {" "}
                {state.bar}
                {(is) ? "!" : null}
            </div>
            <div>
                {children}
            </div>
            <input type="button" onClick={onClick} />
        </>
    )
}
