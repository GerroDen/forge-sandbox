import Resolver from "@forge/resolver"
import { getText } from "react-sandbox-functions/get-text"

const resolver = new Resolver()

resolver.define("getText", (req) => {
    console.log(req)
    return getText()
})

export const handler = resolver.getDefinitions()
