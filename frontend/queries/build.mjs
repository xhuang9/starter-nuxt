//This query will select all the /[slug] pages from the craft cms.
//You cn add more queries to select other pages.
export const BUILD_QUERY = `
query MyQuery {
    pagesEntries {
      ... on page_Entry {
        uri
      }
    }
}`;