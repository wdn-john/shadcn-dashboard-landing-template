import { CheckoutView } from "./components/checkout-view"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CheckoutView requestId={Number(id)} />
}
