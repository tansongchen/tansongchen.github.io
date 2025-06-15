import { mmdd, put, type Order } from "..";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { BaseForm } from "./Commenter";

const SummaryItem = ({ name }: { name: string }) => {
  const setOrder = useSetAtom(summaryAtom);
  return (
    <div className="block level is-mobile">
      <div className="button level-left">{name}</div>
      <button
        className="button is-danger level-right"
        onClick={() =>
          setOrder((previous) => {
            const next = new Set(...previous);
            next.delete(name);
            return next;
          })
        }
      >
        取消
      </button>
    </div>
  );
};

export const summaryAtom = atom(new Set<string>());

type OrderFormInput = Omit<Order, "id" | "summary">;

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormInput>();
  const [submitting, setSubmitting] = useState(false);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dateOptions = [1, 2, 3, 4, 5, 6, 7].map(
    (d) => new Date(now.getTime() + d * 86400 * 1000)
  );
  const date = new Date(watch("datetime"));
  const mealOptions =
    date.getDay() === 0 || date.getDay() === 6
      ? ["早餐", "午餐", "晚餐"]
      : ["晚餐"];
  const summary = useAtomValue(summaryAtom);

  return (
    <form
      onSubmit={handleSubmit(async (form) => {
        setSubmitting(true);
        const order = {
          ...form,
          id: Date.now(),
          summary: JSON.stringify([...summary]),
        };
        console.log(order);
        await put("/order", order);
        setSubmitting(false);
      })}
    >
      <h1>您的订单</h1>
      <div className="level">
        <div className="level-left is-mobile select">
          <div className="level-item">您希望</div>
          <select title="ordertype" {...register("ordertype")}>
            <option>提前选择菜品</option>
            <option>请我即兴发挥</option>
          </select>
        </div>
        <div className="level-right is-mobile">
          <div className="level-item">在</div>
          <div className="select">
            <select title="datetime" {...register("datetime")}>
              {dateOptions.map((d) => (
                <option key={d.toISOString()} value={d.toISOString()}>
                  {mmdd(d)}
                </option>
              ))}
            </select>
          </div>
          <div className="level-item">的</div>
          <div className="select">
            <select title="mealtype" {...register("mealtype")}>
              {mealOptions.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>品尝</div>
        </div>
      </div>
      {watch("ordertype") === "提前选择菜品" && (
        <ul className="block">
          {[...summary].map((x) => (
            <SummaryItem key={x} name={x} />
          ))}
        </ul>
      )}
      {BaseForm(register as any, errors, submitting)}
    </form>
  );
}
