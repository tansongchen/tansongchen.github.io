import { useAtom } from "jotai";
import { summaryAtom } from "./OrderForm";

export default function Dish({ title }: { title: string }) {
  const [order, setOrder] = useAtom(summaryAtom);
  return order.has(title) ? (
    <button
      className="button is-danger"
      onClick={() => {
        const next = new Set(order);
        next.delete(title);
        setOrder(next);
      }}
    >
      取消
    </button>
  ) : (
    <button
      className="button is-success"
      onClick={() => {
        const next = new Set(order);
        next.add(title);
        setOrder(next);
      }}
    >
      添加
    </button>
  );
}
