export const ARTICLE_QUERY = `
  query Article($slug: [String]) {
    articleEntries(slug: $slug) {
      ... on page_Entry {
      id
      slug
      title
      pageSubheading
      pageContent
      postDate @formatDateTime(format: "F j, Y")
      next(section: "article") {
        id
        slug
        title
        postDate @formatDateTime(format: "F j, Y")
      }
      prev(section: "article") {
        id
        slug
        title
        postDate @formatDateTime(format: "F j, Y")
      }
      category {
        ... on category_Entry {
            id
            title
          }
        }
    }
  }
}`