import React, { useState, useContext } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import PageLayout from "../components/PageLayout";
import { createDate, Recipe } from "../utils/metadata";
import slugify from "../utils/slugify";
import Meta from "../components/Meta";

import {
  FaCheck,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaUser,
} from "react-icons/fa";
import { mmdd } from "../utils/metadata";
import { put } from "../utils/client";
import Dropdown from "../components/Dropdown";

enum MealType {
  breakfast,
  lunch,
  dinner,
}

enum OrderType {
  select,
  random,
}

interface FormState {
  name: string;
  email: string;
  date: Date;
  mealtype: MealType;
  ordertype: OrderType;
  content: string;
}

interface FormProps {
  submit: (s: FormState) => void;
  submitting: boolean;
}

function Form({ submit, submitting }: FormProps) {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    content: "",
    date: new Date(new Date().getTime() + 86400 * 1000),
    ordertype: OrderType.select,
    mealtype: MealType.dinner,
  });
  const isEmailValid =
    state.email === ""
      ? 0
      : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email)
      ? 1
      : -1;
  const classSuffix =
    isEmailValid === 0 ? "" : isEmailValid === 1 ? " is-success" : " is-danger";
  const buttonSuffix =
    isEmailValid === -1 ? " is-disabled" : submitting ? " is-loading" : "";
  const now = new Date();
  const dateOptions = [1, 2, 3, 4, 5, 6, 7].map(
    (d) => new Date(now.getTime() + d * 86400 * 1000)
  );
  const mealOptions =
    state.date.getDay() === 0 || state.date.getDay() === 6
      ? [MealType.breakfast, MealType.lunch, MealType.dinner]
      : [MealType.dinner];
  const displayMealType = (s: MealType) =>
    s === MealType.breakfast ? "早餐" : s === MealType.lunch ? "午餐" : "晚餐";
  const { menu, shouldSelect, update, setShouldSelect } =
    useContext(MenuContext);
  return (
    <article style={{ margin: "2rem 0" }}>
      <p className="title is-4">您的订单</p>
      <div className="level">
        <div className="level-left">
          <div
            style={{ padding: ".5rem .5rem .5rem 0", display: "inline-flex" }}
          >
            您希望
          </div>
          <Dropdown<OrderType>
            options={[OrderType.select, OrderType.random]}
            callback={(x) => {
              setState({ ...state, ordertype: x });
              setShouldSelect(x === OrderType.select ? true : false);
            }}
            current={state.ordertype}
            display={(o: OrderType) =>
              o === OrderType.select ? "提前选择菜品" : "请我即兴发挥"
            }
          />
        </div>
        <div className="level-right">
          <div
            style={{ padding: ".5rem .5rem .5rem 0", display: "inline-flex" }}
          >
            在
          </div>
          <Dropdown<Date>
            options={dateOptions}
            callback={(d: Date) => setState({ ...state, date: d })}
            current={state.date}
            display={mmdd}
          />
          <div style={{ padding: ".5rem", display: "inline-flex" }}>的</div>
          <Dropdown<MealType>
            options={mealOptions}
            callback={(s: MealType) => setState({ ...state, mealtype: s })}
            current={state.mealtype}
            display={displayMealType}
          />
          <div style={{ padding: ".5rem", display: "inline-flex" }}>品尝</div>
        </div>
      </div>
      {shouldSelect ? (
        <ul className="block">
          {Object.keys(menu).map((x) => (
            <SummaryItem key={x} name={x} />
          ))}
        </ul>
      ) : (
        <div></div>
      )}
      <div className="columns" style={{ marginBottom: 0 }}>
        <div className="column field">
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="text"
              placeholder="您的姓名"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
            <span className="icon is-small is-left">
              <FaUser />
            </span>
          </div>
        </div>

        <div className="column field">
          <div className="control has-icons-left has-icons-right">
            <input
              className={"input" + classSuffix}
              type="email"
              placeholder="您的邮箱"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
            />
            <span className="icon is-small is-left">
              <FaEnvelope />
            </span>
            <span className="icon is-small is-right">
              {isEmailValid === 1 ? (
                <FaCheck />
              ) : isEmailValid === 0 ? (
                <FaClock />
              ) : (
                <FaExclamationTriangle />
              )}
            </span>
          </div>
          <p className={"help" + classSuffix}>
            {isEmailValid >= 0
              ? "邮箱仅用于回复，不会公开展示"
              : "这不是一个正确的邮箱地址"}
          </p>
        </div>
      </div>

      <div className="columns field" style={{ marginTop: 0 }}>
        <div className="column">
          <div className="control">
            <textarea
              className="textarea"
              placeholder="备注"
              value={state.content}
              onChange={(e) => setState({ ...state, content: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>

      <div
        className="column field is-grouped"
        style={{ justifyContent: "center" }}
      >
        <div className="control">
          <button
            className={"button is-link" + buttonSuffix}
            onClick={() => submit(state)}
          >
            提交
          </button>
        </div>
      </div>
    </article>
  );
}

const SummaryItem = ({ name }: { name: string }) => {
  const { update } = useContext(MenuContext);
  return (
    <div className="block" style={{ display: "flex" }}>
      <div className="button" style={{ width: "70%" }}>
        {name}
      </div>
      <button
        className="button is-danger"
        style={{ marginLeft: "auto" }}
        onClick={() => update(name, 0)}
      >
        取消
      </button>
    </div>
  );
};

function Order() {
  const [submitting, setSubmitting] = useState(false);
  const menu = useContext(MenuContext);
  return (
    <section className="section">
      <div className="container is-max-desktop">
        <Form
          submit={async (form: FormState) => {
            setSubmitting(true);
            const summary: string[] = Object.keys(menu);
            const order = {
              ...form,
              id: Date.now().toString(),
              summary: summary,
            };
            await put("/order", order);
            setSubmitting(false);
          }}
          submitting={submitting}
        />
      </div>
    </section>
  );
}

const Introduction = () => (
  <section
    className="section"
    style={{
      backgroundImage:
        "linear-gradient(to bottom, rgba(200,250,250,0.5), rgba(255,255,255,0.5))",
    }}
  >
    <div
      className="container content is-max-desktop"
      style={{ fontSize: "125%" }}
    >
      <p>唯爱与美食不可辜负。</p>
      <p>
        生于山东烟台，齐鲁大地的丰饶物产培育了我对鲁菜简单的热爱；长于北京海淀，来自五湖四海的珍馐美馔又激发着我对它们真实的好奇。然则一身长居远邦，佳肴难得，自己下厨丰衣足食也就成为了必然。所幸身边有不少厨艺高手与饕餮客，探寻美食的同时也可以广结良友。
      </p>
      <p>
        您可以在下方查看我近期做过的菜品，选择几味您感兴趣的并预约时间登门品尝；您也可以只预约时间而不指定菜品，我将会根据当日可得的食材即兴发挥。
      </p>
    </div>
  </section>
);

export const MenuContext = React.createContext({
  menu: {} as Record<string, number>,
  update: (a: string, b: number) => {},
  shouldSelect: true,
  setShouldSelect: (b: boolean) => {},
});

const Dish = ({ name, date, image, category, rating }: Recipe) => {
  const { menu, shouldSelect, update } = useContext(MenuContext);
  const count = menu[name];
  return (
    <div
      className="box"
      style={{
        margin: "1rem",
        display: "flex",
        padding: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
      }}
    >
      <div style={{ width: "180px", height: "180px", padding: 0 }}>
        <Link to={slugify(name)}>
          {image ? <GatsbyImage image={image} alt={name} /> : <div></div>}
        </Link>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "150px",
          height: "180px",
        }}
      >
        <p className="block" style={{ fontSize: "1.2rem" }}>
          {name}
        </p>
        <p className="block content is-small">{rating}</p>
        {!shouldSelect ? (
          <button className="button is-success is-static">添加</button>
        ) : count > 0 ? (
          <button className="button is-danger" onClick={() => update(name, 0)}>
            取消
          </button>
        ) : (
          <button className="button is-success" onClick={() => update(name, 1)}>
            添加
          </button>
        )}
      </div>
    </div>
  );
};

interface MenuProps {
  nodes: Recipe[];
}

interface SubmenuProps {
  title: string;
  dishes: Recipe[];
}

const Submenu = ({ title, dishes }: SubmenuProps) => (
  <article className="columns">
    <div className="column is-one-quarter has-text-centered">
      <div className="content">
        <h3 style={{ margin: "1.5rem 0 .5rem 0" }}>{title}</h3>
      </div>
    </div>
    <div
      className="column"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {dishes.map((x) => (
        <Dish {...x} key={x.name} />
      ))}
    </div>
  </article>
);

function Menu({ nodes }: MenuProps) {
  const [selected, setSelected] = useState({} as Record<string, number>);
  const [shouldSelect, setShouldSelect] = useState(true);
  const groups = ["鲁菜", "川菜", "粤菜", "淮扬菜", "面点"].map((k) => ({
    title: k,
    dishes: [] as Recipe[],
  }));
  for (const dish of nodes) {
    groups.find((x) => x.title === dish.category)!.dishes.push(dish);
  }
  for (const { dishes } of groups) {
    dishes.sort((a, b) => b.rating.length - a.rating.length);
  }
  const update = (name: string, count: number) => {
    const newSelected = { ...selected, [name]: count };
    if (count === 0) {
      delete newSelected[name];
    }
    setSelected(newSelected);
  };
  return (
    <MenuContext.Provider
      value={{ menu: selected, update, shouldSelect, setShouldSelect }}
    >
      <section className="section" style={{ padding: "3rem 1rem" }}>
        {groups.map((x) => (
          <Submenu {...x} key={x.title} />
        ))}
      </section>
      <Order />
    </MenuContext.Provider>
  );
}

export default function ({ data }: PageProps<Queries.RecipesQuery>) {
  const nodes: Recipe[] = [];
  data.notionDatabase!.childrenNotionPage!.forEach((page) => {
    const { title, properties, image } = page!;
    title &&
      nodes.push({
        name: title,
        category: properties!.Category!,
        date: createDate(
          image!.childImageSharp!.fields!.exif!.exif!.DateTimeOriginal!
        ),
        description: properties!.Description!,
        rating: properties!.Rating!,
        image: image!.childImageSharp!
          .gatsbyImageData as any as IGatsbyImageData,
      });
  });
  return (
    <PageLayout slug="recipes">
      <Introduction />
      <hr />
      <Menu nodes={nodes} />
    </PageLayout>
  );
}

export const query = graphql`
  query Recipes {
    notionDatabase(title: { eq: "菜谱" }) {
      childrenNotionPage {
        title
        properties {
          Category
          Description
          Rating
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 180, height: 180)
            fields {
              exif {
                exif {
                  DateTimeOriginal
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const Head = () => <Meta title="菜谱" />;
