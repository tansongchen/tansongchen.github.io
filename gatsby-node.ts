import type { GatsbyNode } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { resolve } from "path";
import { pinyin } from "pinyin-pro";

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
  stage
}) => {
  if (stage === `build-javascript`) {
    actions.setWebpackConfig({
      optimization: {
        runtimeChunk: {
          name: `webpack-runtime`,
        },
        splitChunks: {
          name: false,
          cacheGroups: {
            styles: {
              name: `styles`,
              test: /\.(css|scss)$/,
              chunks: `initial`,
              enforce: true,
            },
          },
        }
      }
    });
  }
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type NotionPage implements Node {
      image: File @link(from: "fields.localFile")
    }
  `)
}

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }) => {
  const { data: articlesData } = await graphql(`
    query ArticleIndex {
      allMdx(filter: {slug: {ne: null}}) {
        nodes {
          slug
          id
        }
      }
    }
  `) as { data: { allMdx: { nodes: { slug: string, id: string }[] }}};
  articlesData.allMdx.nodes.forEach(({ slug, id }) => {
    actions.createPage({
      path: slug,
      component: resolve("./src/templates/article.tsx"),
      context: { id: id },
    });
  });
  const { data: recipesData } = await graphql(`
    query RecipeIndex {
      notionDatabase(title: {eq: "菜谱"}) {
        childrenNotionPage {
          id
          title
          coverImage
        }
      }
    }
  `) as { data: { notionDatabase: { childrenNotionPage: { id: string, title: string, coverImage: string | null }[] }}};
  recipesData.notionDatabase.childrenNotionPage.filter(x => x.coverImage).forEach(({ id, title }) => {
    const uri = pinyin(title, {toneType: 'none', type: 'array'}).join('-');
    actions.createPage({
      path: `recipes/${uri}`,
      component: resolve("./src/templates/recipe.tsx"),
      context: { id: id },
    });
  });
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}) => {
  // For all MarkdownRemark nodes that have a featured image url, call createRemoteFileNode
  if (
    node.internal.type === "NotionPage" &&
    node.coverImage
  ) {
    const fileNode = await createRemoteFileNode({
      url: node.coverImage, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    } as any)

    // if the file was created, extend the node with "localFile"
    if (fileNode) {
      createNodeField({ node, name: "localFile", value: fileNode.id })
    }
  }
}
