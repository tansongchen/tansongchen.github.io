import "../styles/index.scss"
import React, { Fragment } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const Introduction = () => <article>
  Introduction of Songchen Tan
</article>

const Summary = () => <section>

</section>

const Overview = () => <article>

</article>

const Index = () => {
  return (
    <Fragment>
      <h1>Hello world!</h1>
      {/* <Nav current="index"/>
      <main>
        <title>主页</title>
        <Introduction />
        <Overview />
      </main>
      <Footer current="index"/> */}
    </Fragment>
  )
}

export default Index
