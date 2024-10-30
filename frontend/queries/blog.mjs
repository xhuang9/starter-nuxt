export const BLOG_QUERY = `
  query Blog($limit: Int!, $offset: Int!) {
  blogEntries(limit: 1) {
    ... on page_Entry {
      id
      slug
      title
      pageSubheading
      pageContent
    }
  }
  articleEntries(limit: $limit, offset: $offset) {
    ... on page_Entry {
      id
      slug
      title
      pageSubheading
      pageContent
      postDate @formatDateTime(format: "F j, Y")
    }
  }
  entryCount(section: "article")
  }
`