import React from "react"
import { Link } from "gatsby"
import Layout from "../components/Layout"
import { Helmet } from "react-helmet"

const NotFound = () => {
  return (
    <Layout slug="404">
      <Helmet>
        <title>正在建设中</title>
      </Helmet>
      <main className="section">
        <div className="container is-max-desktop content has-text-centered">
          <h1>未找到页面</h1>
          <p>
            您访问的页面目前还没有被创建。<Link to="/">返回主页</Link>。
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound
