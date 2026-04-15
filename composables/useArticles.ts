export const useArticles = () => {
  const articles = ref([])
  const loading = ref(true)

  const fetchArticles = async () => {
    try {
      const res = await $fetch('https://api.npoint.io/749e4cc46af7d03db38a')
      articles.value = res.articles
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { articles, loading, fetchArticles }
}