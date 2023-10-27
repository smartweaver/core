export type Context<O extends { [K in keyof O]: O[K] } = any> =
  & { action: string }
  & Record<string, unknown>
  & O;
