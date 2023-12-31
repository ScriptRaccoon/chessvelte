import { INITIAL_CONFIG, STANDARD_CONFIG } from "./pieces"

describe("pieces.config", () => {
	it("when commited, should export the standard configuration", () => {
		expect(INITIAL_CONFIG).toEqual(STANDARD_CONFIG)
	})
})
