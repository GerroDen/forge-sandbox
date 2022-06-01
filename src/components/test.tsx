import PropTypes, { InferProps } from "prop-types"
import React, { useState } from "react"

type RequiredNonNullableObject<T extends object> = { [P in keyof Required<T>]: NonNullable<T[P]> }

export function Test({ foo, bar = "hiii" }: RequiredNonNullableObject<InferProps<typeof Test.propTypes>>) {
    const [state, setState] = useState({
        foo,
        bar,
        old: "",
    })

    function onClick() {
        if (state.foo == "reee") {
            setState(oldState => ({ ...oldState, foo: state.old }))
        } else {
            setState(oldState => ({ ...oldState, old: state.foo, foo: "reee" }))
        }
    }

    return (
        <>
            <div>{state.foo} {state.bar}</div>
            <input type="button" onClick={onClick} />
        </>
    )
}

Test.propTypes = {
    foo: PropTypes.string.isRequired,
    bar: PropTypes.string,
}
