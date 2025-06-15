import { useState } from "react";
import { slugify, yymmdd } from "..";
import { type Article as ArticleProps } from "..";
import clsx from "clsx";

type SortMethod = "从新到旧" | "从旧到新";

interface SelectorProps {
  sortMethod: SortMethod;
  changeSortMethod: (sortMethod: SortMethod) => void;
  intervalStart: number;
  changeIntervalStart: (intervalStart: number) => void;
  intervalEnd: number;
  changeIntervalEnd: (intervalEnd: number) => void;
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
  return (
    <section className="section">
      <div className="level container is-max-widescreen is-vcentered">
        <div className="level-left">
          <div className="tags">
            {allTags.map((tag) => (
              <div
                key={tag}
                className={clsx(
                  "tag",
                  "is-medium",
                  "is-link",
                  tag !== activeTag && "is-light"
                )}
                onClick={() => changeTag(activeTag, tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="level-right is-vcentered">
          <div className="select">
            <select
              title="Sort by"
              value={intervalStart}
              onChange={(e) => changeIntervalStart(parseInt(e.target.value))}
            >
              {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>至</div>
          <div className="select">
            <select
              title="Sort by"
              value={intervalEnd}
              onChange={(e) => changeIntervalEnd(parseInt(e.target.value))}
            >
              {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              title="Sort by"
              value={sortMethod}
              onChange={(e) => changeSortMethod(e.target.value as SortMethod)}
            >
              <option>从新到旧</option>
              <option>从旧到新</option>
            </select>
          </div>
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
      <div className="box columns">
        <div className="column">
          <img className="card-left" src={cover} alt={cover} />
        </div>
        <div className="column content">
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
  intervalStart: number;
  intervalEnd: number;
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
  let filteredArticles = activeTag
    ? nodes.filter(
        ({ date, categories }: ArticleProps) =>
          intervalStart <= date.getFullYear() &&
          date.getFullYear() <= intervalEnd &&
          categories.includes(activeTag)
      )
    : nodes.filter(
        ({ date, categories }: ArticleProps) =>
          intervalStart <= date.getFullYear() &&
          date.getFullYear() <= intervalEnd
      );
  if (sort == "从新到旧") {
    filteredArticles.sort((a, b) => b.date.getTime() - a.date.getTime());
  } else {
    filteredArticles.sort((a, b) => a.date.getTime() - b.date.getTime());
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
  const [sortMethod, changeSortMethod] = useState("从新到旧" as SortMethod);
  const [intervalStart, changeIntervalStart] = useState(2019);
  const [intervalEnd, changeIntervalEnd] = useState(new Date().getFullYear());
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
