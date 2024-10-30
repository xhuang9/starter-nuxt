export const CREATE_POST_MUTATION = `
  mutation createPost($title: String!, $message: String, $authorId: ID!) {
    save_posts_text_Entry(
      title: $title,
      textBlock: $message,
      authorId: $authorId
    ) {
      title
      textBlock
    }
  }
`