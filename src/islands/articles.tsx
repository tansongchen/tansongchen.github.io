import { useState } from "react";
import Dropdown from "../islands/Dropdown";
import { slugify, yymmdd } from "..";
import { type Article as ArticleProps } from "..";

enum SortMethod {
  FromNewestToOldest,
  FromOldestToNewest,
}

interface TagProps {
  tag: string;
  activeTag?: string;
  changeTag: (activeTag?: string, tag?: string) => void;
}

const Tag = ({ tag, activeTag, changeTag }: TagProps) => {
  const className =
    "tag is-medium is-info" + (tag === activeTag ? "" : " is-light");
  return (
    <div
      key={tag}
      className={className}
      onClick={() => changeTag(activeTag, tag)}
    >
      {tag}
    </div>
  );
};

interface SelectorProps {
  sortMethod: SortMethod;
  changeSortMethod: (sortMethod: SortMethod) => void;
  intervalStart: Date;
  changeIntervalStart: (intervalStart: Date) => void;
  intervalEnd: Date;
  changeIntervalEnd: (intervalEnd: Date) => void;
  activeTag?: string;
  changeTag: (activeTag?: string, tag?: string) => void;
  allTags: string[];
}

const Selector = ({
  sortMethod,
  changeSortMethod,
  intervalStart,
  changeIntervalStart,
  intervalEnd,
  changeIntervalEnd,
  activeTag,
  changeTag,
  allTags,
}: SelectorProps) => {
  const getYear = (d: Date) => d.getFullYear().toString();
  const getSortMethod = (s: SortMethod) =>
    s === SortMethod.FromNewestToOldest
      ? "从新到旧"
      : s === SortMethod.FromOldestToNewest
      ? "从旧到新"
      : "";
  return (
    <section className="section">
      <div className="level container is-max-widescreen is-vcentered">
        <div className="level-left">
          <div className="tags">
            {allTags.map((tag) => (
              <Tag
                tag={tag}
                activeTag={activeTag}
                changeTag={changeTag}
                key={tag}
              />
            ))}
          </div>
        </div>
        <div className="level-right is-vcentered">
          <Dropdown<Date>
            options={[
              new Date("2019-01-01T00:00:00"),
              new Date("2020-01-01T00:00:00"),
              new Date("2021-01-01T00:00:00"),
            ]}
            callback={changeIntervalStart}
            current={intervalStart}
            display={getYear}
          />
          <div>至</div>
          <Dropdown<Date>
            options={[
              new Date("2019-12-31T23:59:59"),
              new Date("2020-12-31T23:59:59"),
              new Date("2021-12-31T23:59:59"),
            ]}
            callback={changeIntervalEnd}
            current={intervalEnd}
            display={getYear}
          />
          <Dropdown<SortMethod>
            options={[
              SortMethod.FromNewestToOldest,
              SortMethod.FromOldestToNewest,
            ]}
            callback={changeSortMethod}
            current={sortMethod}
            display={getSortMethod}
          />
        </div>
      </div>
    </section>
  );
};

const Article = ({
  title,
  date,
  cover,
  categories,
  description,
}: ArticleProps) => (
  <article key={title} className="container section">
    <a href={`/articles/${slugify(title)}/`}>
      <div className="box columns" style={{ padding: 0, overflow: "auto" }}>
        <div className="column" style={{ padding: 0 }}>
          <figure className="image is-2by1">
            <img src={cover} alt={cover} />
          </figure>
        </div>
        <div className="column content" style={{ padding: "1.5rem" }}>
          <h3>{title}</h3>
          <p>{yymmdd(date)}</p>
          <p className="level-left">
            {categories.map((tag) => (
              <span
                key={tag}
                className="tag is-info is-light is-medium level-item"
              >
                {tag}
              </span>
            ))}
          </p>
          <p>{description}</p>
        </div>
      </div>
    </a>
  </article>
);

interface MainProps {
  nodes: ArticleProps[];
}

interface ArticleListProps {
  sortMethod: SortMethod;
  intervalStart: Date;
  intervalEnd: Date;
  activeTag?: string;
  nodes: ArticleProps[];
}

const ArticleList = ({
  sortMethod: sort,
  intervalStart,
  intervalEnd,
  activeTag,
  nodes,
}: ArticleListProps) => {
  let dt = (blog: ArticleProps) => new Date(blog.date);
  let filteredArticles = activeTag
    ? nodes.filter(
        (blog: ArticleProps) =>
          intervalStart <= new Date(blog.date) &&
          new Date(blog.date) <= intervalEnd &&
          blog.categories.includes(activeTag)
      )
    : nodes.filter(
        (blog: ArticleProps) =>
          intervalStart <= new Date(blog.date) &&
          new Date(blog.date) <= intervalEnd
      );
  if (sort == SortMethod.FromNewestToOldest) {
    filteredArticles.sort((a, b) => dt(b).getTime() - dt(a).getTime());
  } else {
    filteredArticles.sort((a, b) => dt(a).getTime() - dt(b).getTime());
  }
  return (
    <section className="section">
      <div className="container is-max-widescreen">
        {filteredArticles.map(Article)}
      </div>
    </section>
  );
};

export default function Main({ nodes }: MainProps) {
  const [sortMethod, changeSortMethod] = useState(
    SortMethod.FromNewestToOldest
  );
  const [intervalStart, changeIntervalStart] = useState(
    new Date("2019-01-01T00:00:00")
  );
  const [intervalEnd, changeIntervalEnd] = useState(
    new Date("2021-12-31T23:59:59")
  );
  const [activeTag, changeActiveTag] = useState(
    undefined as string | undefined
  );
  const tagArrays = nodes.map((node) => node.categories);
  const tagArray = ([] as string[]).concat(...tagArrays);
  const allTags = Array.from(new Set(tagArray));
  const changeTag = (activeTag?: string, tag?: string) => {
    activeTag === tag ? changeActiveTag(undefined) : changeActiveTag(tag);
  };
  return (
    <>
      <Selector
        sortMethod={sortMethod}
        changeSortMethod={changeSortMethod}
        intervalStart={intervalStart}
        changeIntervalStart={changeIntervalStart}
        intervalEnd={intervalEnd}
        changeIntervalEnd={changeIntervalEnd}
        changeTag={changeTag}
        activeTag={activeTag}
        allTags={allTags}
      />
      <ArticleList
        sortMethod={sortMethod}
        intervalStart={intervalStart}
        intervalEnd={intervalEnd}
        activeTag={activeTag}
        nodes={nodes}
      />
    </>
  );
}
