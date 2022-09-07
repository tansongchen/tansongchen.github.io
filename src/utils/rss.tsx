const feeds = [
  {
    serialize: ({ query }: { query: Queries.RecipesQuery & { site: Queries.Site } }) => {
      const { notionDatabase, site } = query;
      return notionDatabase?.childrenNotionPage?.filter(node => node?.image).map(node => {
        return {
          title: node?.title,
          categories: [node?.properties?.Category],
          description: node?.properties?.Rating,
          url: site?.siteMetadata?.siteUrl + '/recipes/',
          guid: node?.title,
          enclosure: {
            url: site?.siteMetadata?.siteUrl + node?.image?.childImageSharp?.resize.src
          },
          date: new Date(node?.lastEditedTime)
        }
      })
    },
    query: `
    query RecipesRSS {
      notionDatabase(title: {eq: "菜谱"}) {
        childrenNotionPage {
          title
          properties {
            Category
            Complexity
            Rating
          }
          lastEditedTime
          image {
            childImageSharp {
              resize(width: 500, height: 500, toFormat: WEBP) {
                src
              }
            }
          }
        }
      }
    }
    `,
    output: `/rss.xml`,
    title: "众妙斋",
    description: "让您可以在您喜爱的 RSS 阅读器上获取众妙斋的更新（目前仅支持美食板块）",
    feed_url: 'https://tansongchen.com/rss.xml',
    site_url: 'https://tansongchen.com',
    image_url: 'https://tansongchen.com/favicon-32x32.png',
    managingEditor: '谭淞宸',
    webMaster: '谭淞宸',
    copyright: '谭淞宸 2017 - 2022',
    languages: 'zh'
  }
];

export default feeds;
