import PropTypes, { InferProps } from "prop-types"

export default function Test({ foo, bar = "hiii" }: InferProps<typeof Test.propTypes>) {
    return (
        <div>{foo} {bar}</div>
    )
}

Test.propTypes = {
    foo: PropTypes.string.isRequired,
    bar: PropTypes.string,
}
