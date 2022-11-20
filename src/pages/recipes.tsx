import React, { Fragment, Component } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import Order from "../components/Order";
import { createDate, Recipe } from "../utils/metadata";
import slugify from "../utils/slugify";
import Meta from "../components/Meta";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,250,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      唯爱与美食不可辜负。
    </p>
    <p>
      生于山东烟台，齐鲁大地的丰饶物产培育了我对鲁菜简单的热爱；长于北京海淀，来自五湖四海的珍馐美馔又激发着我对它们真实的好奇。然则一身长居远邦，佳肴难得，自己下厨丰衣足食也就成为了必然。所幸身边有不少厨艺高手与饕餮客，探寻美食的同时也可以广结良友。
    </p>
    <p>
      您可以在下方查看我近期做过的菜品，选择几味您感兴趣的并预约时间登门品尝；您也可以只预约时间而不指定菜品，我将会根据当日可得的食材即兴发挥。
    </p>
  </div>
</section>

interface DishProps extends Recipe {
  ordered: number,
  update: (a: string, b: number) => void,
  shouldSelect: boolean
}

const Dish = ({ name, date, image, category, rating, ordered, update, shouldSelect }: DishProps) => <div className="box" style={{margin: "1rem", display: "flex", padding: 0, overflow: "hidden", position: "relative", zIndex: 0}}>
  <div style={{width: "180px", height: "180px", padding: 0}}>
    <Link to={slugify(name)}>
      {image ? <GatsbyImage image={image} alt={name}/> : <div></div>}
    </Link>
  </div>
  <div style={{textAlign: "center", padding: "0 1.5rem", display: "flex", justifyContent: "center", flexDirection: "column", width: "150px", height: "180px"}}>
    <p className="block" style={{fontSize: "1.2rem"}}>{name}</p>
    <p className="block content is-small">{rating}</p>
    { !shouldSelect ?
      <button className="button is-success is-static">添加</button> :
      ordered ?
      <button className="button is-danger" onClick={() => update(name, 0)}>取消</button> :
      <button className="button is-success" onClick={() => update(name, 1)}>添加</button>
    }
  </div>
</div>

interface MenuProps { nodes: Recipe[] }
interface MenuState {
  selected: Map<string, number>,
  shouldSelect: boolean
}

interface SubmenuProps {
  title: string,
  dishes: Recipe[],
  selected: Map<string, number>,
  update: (a: string, b: number) => void,
  shouldSelect: boolean
}

const Submenu = ({ title, dishes, selected, update, shouldSelect }: SubmenuProps) => <article className="columns">
  <div className="column is-one-quarter has-text-centered">
    <div className="content">
      <h3 style={{margin: "1.5rem 0 .5rem 0"}}>{title}</h3>
    </div>
  </div>
  <div className="column" style={{display: "flex", flexWrap: "wrap", justifyContent: "center", padding: 0}}>
    {dishes.map(x => <Dish {...x} key={x.name} update={update} ordered={selected.get(x.name)!} shouldSelect={shouldSelect}/>)}
  </div>
</article>

class Menu extends Component<MenuProps, MenuState> {
  state: MenuState = {
    selected: new Map<string, number>(),
    shouldSelect: true
  }

  componentDidMount() {
    for (let dish of this.props.nodes) {
      this.state.selected.set(dish.name, 0);
    }
  }

  render() {
    let map = new Map<string, Recipe[]>();
    for (let dish of this.props.nodes) {
      map.set(dish.category, (map.get(dish.category) || []).concat([dish]))
    }
    let groups: {title: string, dishes: Recipe[]}[] = [];
    for (let key of ["鲁菜", "川菜", "粤菜", "淮扬菜", "面点"]) {
      let value = map.get(key) || [];
      value.sort((a: Recipe, b: Recipe) => b.rating.length - a.rating.length);
      groups.push({title: key, dishes: value});
    }
    const update = (name: string, count: number) => {
      this.state.selected.set(name, count);
      this.setState({selected: this.state.selected});
    }
    const changeSelect = (b: boolean) => this.setState({shouldSelect: b});
    return <Fragment>
      <section className="section" style={{padding: "3rem 1rem"}}>
        {groups.map(x => <Submenu {...x} key={x.title} update={update} selected={this.state.selected} shouldSelect={this.state.shouldSelect}/>)}
      </section>
      <Order selected={this.state.selected} update={update} changeSelect={changeSelect} shouldSelect={this.state.shouldSelect}/>
    </Fragment>
  }
}

export default function ({ data }: PageProps<Queries.RecipesQuery>) {
  const nodes: Recipe[] = [];
  data.notionDatabase!.childrenNotionPage!.forEach(page => {
    const { title, properties, image } = page!;
    title && nodes.push({
      name: title,
      category: properties!.Category!,
      date: createDate(image!.childImageSharp!.fields!.exif!.exif!.DateTimeOriginal!),
      description: properties!.Description!,
      rating: properties!.Rating!,
      image: image!.childImageSharp!.gatsbyImageData as any as
      IGatsbyImageData
    });
  });
  return (
    <Layout slug="recipes">
      <Introduction />
      <hr />
      <Menu nodes={nodes} />
    </Layout>
  )
}

export const query = graphql`
  query Recipes {
    notionDatabase(title: {eq: "菜谱"}) {
      childrenNotionPage {
        title
        properties {
          Category
          Description
          Rating
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 180, height: 180, placeholder: BLURRED, formats: [AUTO, WEBP])
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
`

// export const Head = () => <Meta title="菜谱"/>
