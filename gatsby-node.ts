import type { GatsbyNode } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { resolve } from "path";
import { ExifData, read } from "fast-exif";
import slugify from "./src/utils/slugify";
import { arts, basename } from "./src/utils/metadata";

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
  const { createTypes } = actions;

  createTypes(`
    type NotionPage implements Node {
      image: File @link(from: "fields.localFile")
      lilypond: File @link(from: "fields.lilypond")
      score: File @link(from: "fields.score")
    }
  `);
}

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }) => {
  const { data: articlesData } = await graphql<Queries.ArticleIndexQuery>(`
    query ArticleIndex {
      allMarkdownRemark(filter: {fileAbsolutePath: {ne: null}}) {
        nodes {
          id
          fileAbsolutePath
        }
      }
    }
  `);
  articlesData!.allMarkdownRemark.nodes.forEach(({ id, fileAbsolutePath }) => {
    actions.createPage({
      path: 'articles/' + basename(fileAbsolutePath!),
      component: resolve(`./src/templates/article.tsx`),
      context: { id: id },
    });
  });
  const { data } = await graphql<Queries.IndexQuery>(`
    query Index {
      allNotionDatabase {
        nodes {
          childrenNotionPage {
            id
            title
          }
          title
        }
      }
    }
  `);
  data!.allNotionDatabase!.nodes!.forEach(database => {
    const { title, childrenNotionPage } = database;
    const art = arts.find(x => x.name === title);
    art && childrenNotionPage!.forEach(page => {
      page && page.title &&
      actions.createPage({
        path: `${art.slug}/${slugify(page.title)}`,
        component: resolve(`./src/templates/${art.single}.tsx`),
        context: { id: page.id },
      });
    });
  });
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  getNode,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}) => {
  // For all Notion cover image, call createRemoteFileNode
  if (
    node.internal.type === "NotionPage" &&
    node.coverImage
  ) {
    createRemoteFileNode({
      url: node.coverImage as string, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    } as any).then((fileNode) => {
      createNodeField({ node, name: "localFile", value: fileNode.id })
    })
  }

  // For all Notion files, call createRemoteFileNode
  if (
    node.internal.type === "NotionPage" &&
    (node.properties as Record<string, any>).Lilypond
  ) {
    let properties = node.properties as Record<string, any>;
    createRemoteFileNode({
      url: properties.Lilypond[0].url as string, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    } as any).then((fileNode) => {
      createNodeField({ node, name: "lilypond", value: fileNode.id });
    });
    createRemoteFileNode({
      url: properties.Score[0].url as string, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    } as any).then((fileNode) => {
      createNodeField({ node, name: "score", value: fileNode.id });
    });
  }

  // For all NotionPage images, create exif
  if (
    node.internal.type === 'ImageSharp' &&
    node.parent &&
    getNode(node.parent)?.internal.type === 'File'
  ) {
    const exif: ExifData = {
      exif: {
        DateTimeOriginal: '1970-01-01',
        LensModel: '',
        LensMake: '',
        FocalLength: 0.1,
        ISO: 0.1,
        FNumber: 0.1,
        ExposureTime: 0.1,
        ExposureBiasValue: 0.1,
      },
      gps: {
        GPSLatitudeRef: '',
        GPSLatitude: [0.1, 0.1, 0.1],
        GPSLongitudeRef: '',
        GPSLongitude: [0.1, 0.1, 0.1],
      },
      image: {
        Make: '',
        Model: ''
      }
    };
    try {
      const raw = await read(getNode(node.parent)!.absolutePath as string);
      Object.assign(exif.exif, raw.exif);
      Object.assign(exif.gps, raw.gps);
      Object.assign(exif.image, raw.image);
    } catch (error) {
    }
    createNodeField({
      node,
      name: 'exif',
      value: exif
    });
  }
}
