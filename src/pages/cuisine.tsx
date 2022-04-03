import "../styles/bulma.scss"
import "../styles/index.scss"
import React, { Fragment, Component } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Order from '../components/Order'
import { imageDomain } from '../utils/metadata'

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,250,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      唯爱与美食不可辜负。
    </p>
  </div>
</section>

interface DishData {
  caption: string,
  url: string,
  category: string,
  rating: number
}

interface DishProps {
  caption: string,
  url: string,
  category: string,
  rating: number,
  ordered: number,
  update: (a: string, b: number) => void
}

const format = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`

const Dish = ({ caption, url, category, rating, ordered, update }: DishProps) => <div className="card" style={{width: "200px", margin: "1rem 1rem 1rem 1rem"}}>
  <div className="card-image">
    <figure className="image" style={{width: "200px", height: "200px"}}>
      <img src={url} alt="Placeholder image" style={{objectFit: "cover", objectPosition: "center", height: "100%"}} />
    </figure>
  </div>
  <div className="card-content">
    <div className="media">
      <div className="media-content" style={{textAlign: "center"}}>
        <p className="block">{caption}</p>
        <p className="block">{'⭐️️'.repeat(rating)}</p>
        { ordered ?
          <button className="button is-danger" onClick={() => update(caption, 0)}>取消</button> :
          <button className="button is-success" onClick={() => update(caption, 1)}>添加</button>
        }
      </div>
    </div>
  </div>
</div>

interface MenuProps { nodes: DishData[] }
interface MenuState { selected: Map<string, number> }

interface SubmenuProps {
  title: string,
  dishes: DishData[],
  selected: Map<string, number>,
  update: (a: string, b: number) => void
}

const Submenu = ({ title, dishes, selected, update }: SubmenuProps) => <article className="columns">
  <div className="column is-one-quarter has-text-centered">
    <div className="content">
      <h3 style={{margin: "1.5rem 0 .5rem 0"}}>{title}</h3>
    </div>
  </div>
  <div className="column" style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
    {dishes.map(x => <Dish {...x} key={x.caption} update={update} ordered={selected.get(x.caption)}/>)}
  </div>
</article>

class Menu extends Component<MenuProps, MenuState> {
  state: MenuState = {
    selected: new Map<string, number>()
  }

  componentDidMount(): void {
    for (let dish of this.props.nodes) {
      this.state.selected.set(dish.caption, 0);
    }
  }

  render() {
    let map = new Map<string, DishData[]>();
    for (let dish of this.props.nodes) {
      map.set(dish.category, (map.get(dish.category) || []).concat([dish]))
    }
    let groups = [];
    for (let [key, value] of map.entries()) {
      groups.push({title: key, dishes: value});
    }
    const update = (name, number) => {
      this.state.selected.set(name, number);
      this.setState({selected: this.state.selected});
    }
    return <Fragment>
      <section className="section">
        <div className="container">
          {groups.map(x => <Submenu {...x} key={x.title} update={update} selected={this.state.selected}/>)}
        </div>
      </section>
      <Order selected={this.state.selected} update={update}/>
    </Fragment>
  }
}

const Cuisine = ({ data }) => {
  const preprocess = ({ caption, category, rating, url }) => ({caption: caption, category: category, rating: rating, url: imageDomain + url});
  const nodes: DishData[] = data.allCuisineYaml.nodes.map(preprocess);
  return (
    <Layout slug="cuisine">
      <Introduction />
      <hr />
      <Menu nodes={nodes} />
    </Layout>
  )
}

export const query = graphql`
  query {
    allCuisineYaml {
      nodes {
        caption
        rating
        url
        category
      }
    }
  }
`

export default Cuisine
