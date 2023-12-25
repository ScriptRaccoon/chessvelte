import { INITIAL_CONFIG, STANDARD_CONFIG } from "./pieces.config"

describe("pieces.config", () => {
	it("when commited, should have export the standard configuration", () => {
		expect(INITIAL_CONFIG).toEqual(STANDARD_CONFIG)
	})
})
