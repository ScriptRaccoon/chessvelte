/**
 * This class is a simple database in memory that stores items by their id.
 */

export class SimpleDB<T> {
	private db: Record<string, T> = {}

	public add(id: string, item: T): void {
		this.db[id] = item
	}

	public get(id: string): T | undefined {
		return this.db[id]
	}

	public remove(id: string): void {
		delete this.db[id]
	}

	public has(id: string): boolean {
		return this.db[id] !== undefined
	}

	public clear(): void {
		this.db = {}
	}

	public get keys(): string[] {
		return Object.keys(this.db)
	}

	public get items(): T[] {
		return Object.values(this.db)
	}

	public get size(): number {
		return this.keys.length
	}
}
