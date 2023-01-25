interface Env {
  ORDERS: KVNamespace;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { key, value } = await context.request.json() as Record<string, any>;
  await context.env.ORDERS.put(key, JSON.stringify(value));
  return new Response(JSON.stringify({ success: true }));
}
